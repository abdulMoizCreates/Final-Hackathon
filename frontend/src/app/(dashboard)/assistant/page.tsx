"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { streamChat, assistantApi } from "@/api/assistant";
import AssistantMarkdown from "@/components/chat/AssistantMarkdown";
import {
  Sparkles,
  Send,
  Bot,
  RefreshCw,
  Copy,
  Check
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
}

export default function AssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: `Hello ${user?.name || "there"}! I am your **HCM Lite AI Assistant**.\n\nYou can ask me anything about attendance records, leave requests, company HR policies, or payroll summaries. How can I help you today?`,
      time: "10:24 AM",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messageIdRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Honest status badge — reflects the real backend configuration instead of
  // always claiming "Operational".
  useEffect(() => {
    let cancelled = false;
    assistantApi
      .status()
      .then((s) => !cancelled && setStatus(s.online ? "online" : "offline"))
      .catch(() => !cancelled && setStatus("offline"));
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || loading) return;

    const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    const botId = `b-${++messageIdRef.current}`;

    const userMsg: Message = {
      id: `u-${++messageIdRef.current}`,
      sender: "user",
      text: textToSend,
      time,
    };

    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: botId, sender: "bot", text: "", time },
    ]);
    if (!customPrompt) setInput("");
    setLoading(true);

    let received = "";
    try {
      // Real backend stream (SSE) — deltas append into the bot bubble live.
      await streamChat("hcm-session", textToSend, (delta) => {
        received += delta;
        setMessages((prev) =>
          prev.map((m) => (m.id === botId ? { ...m, text: m.text + delta } : m))
        );
      });
      if (!received) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId
              ? { ...m, text: "The assistant returned an empty response. Please try again." }
              : m
          )
        );
      }
    } catch (error) {
      const note =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      setMessages((prev) =>
        prev.map((m) => (m.id === botId ? { ...m, text: `⚠ ${note}` } : m))
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const suggestions = [
    "Who is on leave today?",
    "Show attendance summary for this week",
    "Draft an announcement for holiday",
    "What are the rules for late arrivals?",
    "How is net salary calculated in HCM Lite?",
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4 font-sans">
      {/* ──────────────── Top Header Bar ──────────────── */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-teal-900/10">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">AI HR Copilot</h1>
            <p className="text-xs text-slate-400">Powered by Enterprise AI</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {status === "online" && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Operational
            </span>
          )}
          {status === "offline" && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Assistant offline
            </span>
          )}
          {status === "checking" && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
              Checking…
            </span>
          )}
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* ──────────────── Chat Thread Container ──────────────── */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isBot = msg.sender === "bot";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isBot ? "justify-start" : "justify-end"}`}
            >
              {isBot && (
                <div className="w-8 h-8 rounded-xl bg-teal-800 text-teal-200 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Bot size={18} />
                </div>
              )}

              <div
                className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 relative group ${
                  isBot
                    ? "bg-slate-50 text-slate-800 border border-slate-100"
                    : "bg-teal-700 text-white shadow-md shadow-teal-900/10"
                }`}
              >
                {isBot ? (
                  <AssistantMarkdown content={msg.text} />
                ) : (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                )}
                <div
                  className={`text-[10px] flex items-center justify-between pt-1 ${
                    isBot ? "text-slate-400" : "text-teal-200"
                  }`}
                >
                  <span>{msg.time}</span>
                  {isBot && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-slate-700 cursor-pointer"
                      title="Copy text"
                    >
                      {copiedId === msg.id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    </button>
                  )}
                </div>
              </div>

              {!isBot && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-sm">
                  {user?.name ? user.name[0] : "U"}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-800 text-teal-200 flex items-center justify-center shrink-0">
              <Bot size={18} />
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
              <span>Analyzing HR records and formulating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ──────────────── Suggestion Chips ──────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-teal-50 hover:text-teal-800 text-slate-600 text-xs font-medium shadow-sm border border-slate-100 whitespace-nowrap transition-all cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>

      {/* ──────────────── Input Box ──────────────── */}
      <div className="bg-white p-2.5 rounded-2xl shadow-sm flex items-center gap-2 border border-slate-100">
        <input
          type="text"
          placeholder="Ask AI anything about employees, attendance, policies, or leaves..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-4 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white transition-all disabled:opacity-40 disabled:hover:bg-teal-700 shadow-md shadow-teal-900/10 cursor-pointer"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
