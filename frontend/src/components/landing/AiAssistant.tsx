"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Check, Database, FileText, ShieldCheck, Zap } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";

const CAPABILITIES = [
  { icon: Database, text: "Answers strictly from live attendance & leave records" },
  { icon: Zap, text: "Drafts leave forms from plain sentences via tool calling" },
  { icon: ShieldCheck, text: "Respects role scopes — employees never see payroll" },
];

const CHAT = {
  user: "Can I take Friday off?",
  tool: 'draft_leave_request({ type: "annual", date: "friday" })',
  answer: "Done — your annual leave request for Friday is drafted and waiting in the approval inbox. Balance checks out.",
};

export default function AiAssistant() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-ai-copy]", {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: container.current, start: "top 70%", once: true },
        });

        /* Chat sequence — plays once when the panel scrolls into view */
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: "[data-chat-panel]", start: "top 62%", once: true },
        });
        tl.from("[data-msg-user]", { y: 20, opacity: 0, scale: 0.96, duration: 0.55 })
          .from("[data-msg-tool]", { y: 16, opacity: 0, scale: 0.96, duration: 0.5 }, "<0.35")
          .fromTo("[data-typing]", { display: "flex", opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 }, "<0.3")
          .to("[data-typing]", { opacity: 0, duration: 0.3 }, "+=0.9")
          .set("[data-typing]", { display: "none" })
          .from("[data-msg-ai]", { y: 20, opacity: 0, scale: 0.96, duration: 0.6 }, "<0.05");
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} id="ai-assistant" className="py-20 sm:py-28 scroll-mt-20" aria-labelledby="ai-title">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: "linear-gradient(140deg, var(--moss-950) 0%, var(--moss-900) 45%, var(--moss-800) 100%)",
            boxShadow: "var(--shadow-lift)",
          }}
        >
          {/* Mesh glows */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full blur-3xl"
            style={{ background: "radial-gradient(closest-side, rgba(110,231,183,0.10), transparent)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-20 h-[380px] w-[380px] rounded-full blur-3xl opacity-70"
            style={{ background: "radial-gradient(closest-side, rgba(22,101,52,0.30), transparent)" }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center p-7 sm:p-12 lg:p-16">
            {/* Copy */}
            <div className="space-y-5">
              <span data-ai-copy className="eyebrow" style={{ color: "var(--accent-light)" }}>Integrated Gemini AI</span>
              <h2 data-ai-copy id="ai-title" className="display-lg" style={{ color: "#F1F5F9" }}>
                An assistant that answers from the ledger, not from vibes.
              </h2>
              <p data-ai-copy className="text-base leading-relaxed" style={{ color: "var(--sidebar-ink-2)" }}>
                Ask in plain language — the assistant calls real tools against real records and
                stays inside the role you&rsquo;re in.
              </p>
              <ul className="space-y-3 pt-1">
                {CAPABILITIES.map((cap) => (
                  <li key={cap.text} data-ai-copy className="flex items-start gap-2.5">
                    <cap.icon size={16} className="shrink-0 mt-0.5" style={{ color: "var(--accent-light)" }} aria-hidden />
                    <span className="text-sm leading-relaxed" style={{ color: "#D7E4DE" }}>{cap.text}</span>
                  </li>
                ))}
              </ul>
              <div data-ai-copy className="pt-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-accent hover:bg-accent-hover active:scale-[0.98] text-white"
                  style={{ boxShadow: "0 8px 20px -6px rgba(22,101,52,0.45)" }}
                >
                  Try live assistant <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </div>

            {/* Chat mockup */}
            <div
              data-chat-panel
              data-ai-copy
              className="rounded-2xl p-5 sm:p-6 space-y-4"
              style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(230,237,211,0.10)", backdropFilter: "blur(8px)" }}
              aria-hidden
            >
              <div className="flex items-center gap-2 pb-3" style={{ borderBottom: "1px solid rgba(230,237,211,0.08)" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent-light)" }} />
                <span className="text-xs font-medium" style={{ color: "#9FB8AE" }}>HR Assistant · employee scope</span>
              </div>

              {/* User bubble */}
              <div data-msg-user className="flex justify-end">
                <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-md text-sm" style={{ background: "var(--accent)", color: "#FFFFFF" }}>
                  {CHAT.user}
                </div>
              </div>

              {/* Tool-call chip */}
              <div data-msg-tool className="flex justify-start">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-[11px]" style={{ background: "rgba(255,255,255,0.06)", border: "1px dashed rgba(134,233,200,0.4)", color: "var(--accent-light)" }}>
                  <FileText size={12} aria-hidden />
                  <span className="truncate max-w-[260px] sm:max-w-none">{CHAT.tool}</span>
                </div>
              </div>

              {/* Typing indicator */}
              <div data-typing className="hidden justify-start" style={{ display: "none" }}>
                <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-md" style={{ background: "rgba(255,255,255,0.07)" }}>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#9FB8AE", animation: `hcm-bounce 1s ease-in-out ${i * 0.15}s infinite` }}
                    />
                  ))}
                </div>
              </div>

              {/* Assistant bubble */}
              <div data-msg-ai className="flex justify-start">
                <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-bl-md text-sm leading-relaxed" style={{ background: "rgba(255,255,255,0.07)", color: "#E6EDF3" }}>
                  {CHAT.answer}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Check size={12} style={{ color: "var(--accent-light)" }} aria-hidden />
                <span className="text-[11px]" style={{ color: "#9FB8AE" }}>Grounded in ledger data · role-scoped</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
