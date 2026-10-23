import api from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

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
 */
export async function streamChat(
  sessionId: string,
  message: string,
  onDelta: StreamDeltaHandler,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(`${API_URL}/assistant/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, message }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error("The assistant service is unavailable right now.");
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
        const parsed: { delta?: string; error?: string } = JSON.parse(payload);
        if (parsed.error) throw new Error(parsed.error);
        if (parsed.delta) onDelta(parsed.delta);
      } catch (error) {
        if (error instanceof SyntaxError) continue; // skip malformed event
        throw error;
      }
    }
  }
}
