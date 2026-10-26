import User from "../models/User.js";
import {
  GEMINI_MODEL,
  buildSystemInstruction,
  getGeminiClient,
} from "../config/gemini.js";
import { executeTool, TOOL_DECLARATIONS } from "../utils/assistantTools.js";
import { checkRateLimit } from "../utils/assistantRateLimit.js";

// In-memory chat history per user+session so the assistant remembers the
// conversation, ChatGPT-style. Keyed by `${userId}:${sessionId}` so one user
// can never read another user's conversation by guessing session ids.
// Fine for a demo; swap for a datastore if you scale out.
const HISTORY_LIMIT = 24; // number of contents entries kept per session
const histories = new Map();

function getHistory(userId, sessionId) {
  const key = `${userId}:${sessionId}`;
  let history = histories.get(key);
  if (!history) {
    history = [];
    histories.set(key, history);
  }
  return history;
}

function trimHistory(history) {
  while (history.length > HISTORY_LIMIT) {
    history.shift();
    // Keep contents valid: a function-response turn must never be orphaned
    // from the function-call turn it answers, so drop it too.
    if (history[0]?.parts?.some((part) => part.functionResponse)) {
      history.shift();
    }
  }
}

function startSse(res) {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // don't buffer behind proxies
  if (typeof res.flushHeaders === "function") res.flushHeaders();
}

function sendEvent(res, payload) {
  if (res.writableEnded || res.destroyed) return;
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function endStream(res) {
  if (res.writableEnded || res.destroyed) return;
  res.write("data: [DONE]\n\n");
  res.end();
}

// Free tier sees 429 (quota) and 503 (overloaded) regularly — retry briefly
// with exponential backoff instead of failing the user's question.
const MAX_ATTEMPTS = 3; // 1 original try + 2 retries, and ONLY for 429/503
const BASE_DELAY_MS = 4000; // waits: 4s, then 8s
const REQUEST_TIMEOUT_MS = 60_000; // give up on a hung request after 60s
const MAX_TOOL_TURNS = 4; // tool loop round-trips per user message

function isRetryable(error) {
  const status = error?.status;
  const msg = error?.message ?? "";
  return (
    status === 429 ||
    status === 503 ||
    /RESOURCE_EXHAUSTED|UNAVAILABLE|overloaded/i.test(msg)
  );
}

async function startStream(client, history, user) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await client.models.generateContentStream({
        model: GEMINI_MODEL,
        contents: history,
        config: {
          systemInstruction: buildSystemInstruction(user),
          tools: TOOL_DECLARATIONS,
          abortSignal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        },
      });
    } catch (error) {
      lastError = error;
      if (!isRetryable(error) || attempt === MAX_ATTEMPTS) break;
      console.warn(
        `[assistant] retryable error (attempt ${attempt}/${MAX_ATTEMPTS}): status=${error?.status ?? "?"} msg=${error?.message ?? "?"}`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, BASE_DELAY_MS * 2 ** (attempt - 1))
      );
    }
  }
  throw lastError;
}

// Map SDK/server errors to one friendly sentence. Full details stay in the
// server log — the client only gets the short version.
function friendlyError(error) {
  const status = error?.status;
  const msg = error?.message ?? "";
  if (status === 429 || /RESOURCE_EXHAUSTED/i.test(msg)) {
    return "The AI assistant hit its free-tier quota. Please try again in about a minute.";
  }
  if (status === 503 || /UNAVAILABLE|overloaded/i.test(msg)) {
    return "The AI service is busy right now. Please try again shortly.";
  }
  if (status === 403 || /PERMISSION_DENIED/i.test(msg)) {
    return "The assistant's API key was refused by Google. Check the key and its restrictions in Google AI Studio.";
  }
  if (status === 404 || /NOT_FOUND/i.test(msg)) {
    return `The configured model "${GEMINI_MODEL}" is not available for this API key. Set GEMINI_MODEL in backend/.env to a supported Flash model.`;
  }
  if (/deadline|timeout|aborted|ETIMEDOUT|ECONNRESET|fetch failed|network/i.test(msg)) {
    return "The AI took too long to respond. Please try again.";
  }
  if (status === 400) {
    return "The AI assistant couldn't process that request. Please rephrase it and try again.";
  }
  return "The AI service failed to respond. Please try again.";
}

/**
 * Streams one full conversation turn:
 *   model streams → if it asks for tools → server executes them under the
 *   user's role scope → results go back → repeat (max MAX_TOOL_TURNS) →
 *   the final text streams to the client.
 * Everything the model emits is pushed back verbatim (parts array), which
 * preserves thoughtSignature fields required by newer Gemini models.
 * Returns the final reply text (for logging/history); history is mutated.
 */
async function runConversation({ res, client, history, user, toolCallsMade }) {
  for (let turn = 0; turn < MAX_TOOL_TURNS; turn++) {
    const stream = await startStream(client, history, user);

    const parts = [];
    let text = "";
    const calls = [];

    for await (const chunk of stream) {
      if (res.writableEnded || res.destroyed) break; // client closed mid-stream
      if (chunk.text) {
        text += chunk.text;
        sendEvent(res, { delta: chunk.text });
      }
      // Raw parts live on candidates[0].content (the SDK has no top-level
      // `parts` getter). Keeping them verbatim preserves thoughtSignature.
      const chunkParts = chunk.candidates?.[0]?.content?.parts ?? [];
      if (chunkParts.length) parts.push(...chunkParts);
      if (chunk.functionCalls?.length) calls.push(...chunk.functionCalls);
    }

    if (res.writableEnded || res.destroyed) return text;

    // No tool calls → this is the final answer turn.
    if (calls.length === 0) {
      if (text) history.push({ role: "model", parts: [{ text }] });
      return text;
    }

    // Tool turn: keep the model's own parts verbatim (incl. thoughtSignature),
    // execute each requested tool under the user's scope, and send the
    // results back as function-response parts.
    history.push({
      role: "model",
      parts: parts.length
        ? parts
        : calls.map((call) => ({
            functionCall: { id: call.id, name: call.name, args: call.args },
          })),
    });

    const responseParts = [];
    for (const call of calls) {
      toolCallsMade.push(call.name);
      sendEvent(res, { toolCall: { name: call.name, id: call.id ?? null } });
      const result = await executeTool(call.name, call.args ?? {}, user);
      sendEvent(res, {
        toolDone: {
          name: call.name,
          ok: Boolean(result.ok),
          ...(result.ok ? {} : { error: result.error }),
        },
      });
      responseParts.push({
        functionResponse: {
          id: call.id,
          name: call.name,
          response: result,
        },
      });
    }
    history.push({ role: "user", parts: responseParts });
  }

  return "I couldn't complete that request within the allowed number of tool steps. Please try rephrasing it.";
}

export function getStatus(_req, res) {
  res.json({ online: Boolean(getGeminiClient()), model: GEMINI_MODEL });
}

export async function chat(req, res) {
  const startedAt = Date.now();
  const { sessionId, message } = req.body ?? {};

  if (
    !sessionId ||
    typeof sessionId !== "string" ||
    sessionId.length > 64 ||
    !message ||
    typeof message !== "string"
  ) {
    return res
      .status(400)
      .json({ message: "sessionId and message are required" });
  }

  const trimmed = message.trim();
  if (!trimmed) {
    return res.status(400).json({ message: "Message cannot be empty." });
  }
  if (trimmed.length > 2000) {
    return res
      .status(400)
      .json({ message: "Message is too long (2000 characters max)." });
  }

  // Role and scopes come from the verified JWT, resolved fresh from the DB —
  // never from anything the client sends.
  const user = await User.findById(req.user.userId)
    .select("name role employeeId isActive")
    .lean();
  if (!user || !user.isActive) {
    return res.status(403).json({ message: "This account is not active." });
  }

  const client = getGeminiClient();
  if (!client) {
    return res.status(503).json({
      message:
        "The AI assistant is not configured on this server yet. Add GEMINI_API_KEY to backend/.env and restart the backend.",
    });
  }

  // Protect the shared free-tier quota before opening the stream.
  const limit = checkRateLimit(user._id.toString());
  if (!limit.allowed) {
    return res.status(429).json({
      message: `You're sending messages too quickly. Please wait ${limit.retryAfterSeconds}s and try again.`,
      retryAfterSeconds: limit.retryAfterSeconds,
    });
  }

  // Stream the answer back as Server-Sent Events for a ChatGPT-style output.
  startSse(res);

  const history = getHistory(user._id.toString(), sessionId);
  trimHistory(history);
  history.push({ role: "user", parts: [{ text: trimmed }] });

  let replyText = "";
  const toolCallsMade = [];

  try {
    replyText = await runConversation({
      res,
      client,
      history,
      user,
      toolCallsMade,
    });
  } catch (error) {
    if (!replyText) history.pop(); // don't strand the failed user turn
    console.error(
      `[assistant] chat failed: status=${error?.status ?? "?"} msg=${error?.message ?? error}`
    );
    sendEvent(res, { error: friendlyError(error) });
  } finally {
    console.log(
      `[assistant] model=${GEMINI_MODEL} user=${user._id} role=${user.role} tools=${toolCallsMade.join("+") || "none"} latency=${Date.now() - startedAt}ms chars=${replyText.length}`
    );
    if (!res.writableEnded && !res.destroyed) endStream(res);
  }
}

export function resetSession(req, res) {
  const { sessionId } = req.body ?? {};
  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ message: "sessionId is required" });
  }
  histories.delete(`${req.user.userId}:${sessionId}`);
  res.json({ status: "ok" });
}
