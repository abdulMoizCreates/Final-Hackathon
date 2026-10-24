"use client";

import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { assistantApi, streamChat, type AssistantStatus } from "@/api/assistant";
import MarkdownResponse from "./MarkdownResponse";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_QUESTIONS = [
  "What does this website do?",
  "What tech stack is it built with?",
  "What features does it have?",
  "How do I get started?",
];

function newSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [status, setStatus] = useState<AssistantStatus | null>(null);

  const sessionIdRef = useRef("");
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = newSessionId();
    }
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      assistantApi
        .status()
        .then(setStatus)
        .catch(() => setStatus({ online: false, model: "" }));
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  // Stop any in-flight stream if the widget ever unmounts.
  useEffect(() => () => abortRef.current?.abort(), []);

  const appendDelta = useCallback((delta: string) => {
    setMessages((prev) => {
      const next = [...prev];
      const last = next[next.length - 1];
      if (last?.role === "assistant") {
        next[next.length - 1] = { ...last, content: last.content + delta };
      }
      return next;
    });
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming || !sessionIdRef.current) return;

      setMessages((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "assistant", content: "" },
      ]);
      setInput("");
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await streamChat(
          sessionIdRef.current,
          trimmed,
          appendDelta,
          controller.signal
        );
      } catch (error) {
        const aborted = error instanceof Error && error.name === "AbortError";
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (!last || last.role !== "assistant") return prev;
          if (aborted) {
            next[next.length - 1] = {
              ...last,
              content: last.content || "Stopped.",
            };
          } else {
            const note =
              error instanceof Error
                ? error.message
                : "Something went wrong. Please try again.";
            next[next.length - 1] = {
              ...last,
              content: last.content
                ? `${last.content}\n\n⚠️ ${note}`
                : `⚠️ ${note}`,
            };
          }
          return next;
        });
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        setStreaming(false);
      }
    },
    [streaming, appendDelta]
  );

  const resetChat = () => {
    abortRef.current?.abort();
    void assistantApi.reset(sessionIdRef.current).catch(() => {});
    sessionIdRef.current = newSessionId();
    setMessages([]);
    setInput("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send(input);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <section
          aria-label="AI chat assistant"
          className="flex h-[580px] max-h-[calc(100vh-8rem)] w-[min(92vw,420px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
        >
          {/* Header */}
          <header className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-violet-600 p-4 text-white">
            <span className="text-2xl" aria-hidden>
              🛸
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-semibold">
                Antigravity Assistant
              </h2>
              <p className="flex items-center gap-1.5 text-xs text-blue-100">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    status?.online ? "bg-emerald-400" : "bg-amber-300"
                  }`}
                  aria-hidden
                />
                {status?.online
                  ? `AI online · ${status.model}`
                  : "Demo mode — no API key"}
              </p>
            </div>
            <button
              type="button"
              onClick={resetChat}
              title="Start a new chat"
              aria-label="Start a new chat"
              className="rounded-lg p-2 hover:bg-white/20"
            >
              ↺
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              title="Close chat"
              aria-label="Close chat"
              className="rounded-lg p-2 hover:bg-white/20"
            >
              ✕
            </button>
          </header>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3 text-sm dark:bg-gray-800">
                  Hi! I&apos;m the site&apos;s AI assistant, powered by the
                  Gemini API. Ask me anything about this website.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => void send(question)}
                      className="rounded-xl border border-gray-200 px-3 py-2 text-left text-xs text-gray-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => {
              const isAssistant = message.role === "assistant";
              const isLastStreaming =
                index === messages.length - 1 && streaming && isAssistant;

              return (
                <div
                  key={index}
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    !isAssistant
                      ? "ml-auto rounded-br-md bg-blue-600 text-white whitespace-pre-wrap"
                      : "mr-auto rounded-bl-md bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  }`}
                >
                  {isAssistant ? (
                    <div className="relative">
                      <MarkdownResponse
                        content={message.content}
                        isStreaming={isLastStreaming}
                      />
                      {isLastStreaming && message.content !== "" && (
                        <span
                          className="ml-1 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-current"
                          aria-hidden
                        />
                      )}
                    </div>
                  ) : (
                    message.content
                  )}
                </div>
              );
            })}

            {streaming &&
              messages[messages.length - 1]?.content === "" && (
                <div
                  className="mr-auto flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3 dark:bg-gray-800"
                  aria-label="Assistant is typing"
                >
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                </div>
              )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-end gap-2 border-t border-gray-200 p-3 dark:border-gray-700">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about this website…"
              aria-label="Message"
              className="max-h-24 flex-1 resize-none rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-600"
            />
            <button
              type="button"
              onClick={() => void send(input)}
              disabled={streaming || !input.trim()}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </section>
      )}

      {/* Floating toggle */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        title={open ? "Close AI chat" : "Chat with the AI about this website"}
        aria-label={open ? "Close AI chat" : "Open AI chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-2xl text-white shadow-lg transition hover:scale-105"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
