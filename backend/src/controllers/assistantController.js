import {
  GEMINI_MODEL,
  getGeminiClient,
  SYSTEM_INSTRUCTION,
} from "../config/gemini.js";

// In-memory chat history per browser session so the assistant remembers the
// conversation, ChatGPT-style. Fine for a demo; swap for a datastore if needed.
const HISTORY_LIMIT = 24; // number of contents entries kept per session
const histories = new Map();

function getHistory(sessionId) {
  let history = histories.get(sessionId);
  if (!history) {
    history = [];
    histories.set(sessionId, history);
  }
  return history;
}

function trimHistory(history) {
  while (history.length > HISTORY_LIMIT) {
    history.shift();
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

// Google sometimes returns 503 (high demand) or 429 (rate limit), especially on
// the free tier — retry briefly instead of failing the visitor's question.
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 4000;

async function startStream(client, history) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await client.models.generateContentStream({
        model: GEMINI_MODEL,
        contents: history,
        config: { systemInstruction: SYSTEM_INSTRUCTION },
      });
    } catch (error) {
      lastError = error;
      const retryable = error.status === 503 || error.status === 429;
      if (!retryable || attempt === MAX_ATTEMPTS) break;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * attempt));
    }
  }
  throw lastError;
}

export function getStatus(_req, res) {
  res.json({ online: Boolean(getGeminiClient()), model: GEMINI_MODEL });
}

export async function chat(req, res) {
  const { sessionId, message } = req.body ?? {};

  if (!sessionId || !message || typeof message !== "string") {
    return res
      .status(400)
      .json({ message: "sessionId and message are required" });
  }

  // Stream the answer back as Server-Sent Events for a ChatGPT-style output.
  startSse(res);

  const client = getGeminiClient();
  if (!client) {
    sendEvent(res, {
      error:
        "GEMINI_API_KEY is not set on the server. Add it to backend/.env and restart the backend.",
    });
    endStream(res);
    return;
  }

  const history = getHistory(sessionId);
  trimHistory(history);
  history.push({ role: "user", parts: [{ text: message.trim() }] });

  let replyText = "";
  try {
    const stream = await startStream(client, history);

    for await (const chunk of stream) {
      if (res.writableEnded || res.destroyed) break; // visitor closed the widget mid-stream
      const delta = chunk.text;
      if (delta) {
        replyText += delta;
        sendEvent(res, { delta });
      }
    }

    if (replyText) {
      history.push({ role: "model", parts: [{ text: replyText }] });
    }
  } catch (error) {
    if (!replyText) {
      history.pop();
    }
    console.error("Gemini API error:", error.message);
    sendEvent(res, {
      error:
        error.status === 503 || error.status === 429
          ? "The AI is getting a lot of traffic right now. Try again in a minute."
          : "The AI service failed to respond. Please try again.",
    });
  } finally {
    if (!res.writableEnded && !res.destroyed) endStream(res);
  }
}

export function resetSession(req, res) {
  const { sessionId } = req.body ?? {};
  if (!sessionId) {
    return res.status(400).json({ message: "sessionId is required" });
  }
  histories.delete(sessionId);
  res.json({ status: "ok" });
}
