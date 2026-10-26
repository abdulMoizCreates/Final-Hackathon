import api from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface AssistantStatus {
  online: boolean;
  model: string;
}

export type StreamDeltaHandler = (delta: string) => void;

export const assistantApi = {
  status: async (): Promise<AssistantStatus> => {
    const { data } = await api.get<AssistantStatus>("/assistant/status");
    return data;
  },

  reset: async (sessionId: string): Promise<void> => {
    await api.post("/assistant/reset", { sessionId });
  },
};

/**
 * Streams an assistant answer token-by-token (SSE) for a ChatGPT-style feel.
 * Uses native fetch because axios does not support streaming in the browser.
 * The Bearer token comes from localStorage (same source as lib/api) because
 * the backend gates /assistant/chat behind auth and resolves role scopes
 * server-side from it.
 */
export async function streamChat(
  sessionId: string,
  message: string,
  onDelta: StreamDeltaHandler,
  signal?: AbortSignal
): Promise<void> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = localStorage.getItem("accessToken");
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}/assistant/chat`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ sessionId, message }),
    signal,
  });

  if (!response.ok || !response.body) {
    let serverMessage = "";
    try {
      const data = await response.json();
      if (typeof data?.message === "string") serverMessage = data.message;
    } catch {
      // non-JSON error body — fall back to the friendly messages below
    }
    if (response.status === 401) {
      throw new Error(serverMessage || "Please sign in to use the AI assistant.");
    }
    if (response.status === 429) {
      throw new Error(
        serverMessage ||
          "You're sending messages too quickly. Please wait a moment and try again."
      );
    }
    if (response.status === 503) {
      throw new Error(
        serverMessage || "The assistant service is not configured right now."
      );
    }
    throw new Error(serverMessage || "The assistant service is unavailable right now.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const event of events) {
      const line = event
        .split("\n")
        .find((eventLine) => eventLine.startsWith("data: "));
      if (!line) continue;

      const payload = line.slice(6);
      if (payload === "[DONE]") return;
      if (!payload) continue;

      try {
        const parsed: {
          delta?: string;
          error?: string;
          toolCall?: { name: string; id?: string | null };
          toolDone?: { name: string; ok: boolean; error?: string };
        } = JSON.parse(payload);
        if (parsed.error) throw new Error(parsed.error);
        if (parsed.delta) onDelta(parsed.delta);
        // toolCall / toolDone events are ignored for now — the Phase 2 UI
        // redesign will surface them as tool chips.
      } catch (error) {
        if (error instanceof SyntaxError) continue; // skip malformed event
        throw error;
      }
    }
  }
}
