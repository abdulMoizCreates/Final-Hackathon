"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const CAPABILITIES = [
  "Geofenced check-in",
  "Grace allowances",
  "Half-day thresholds",
  "Leave approvals",
  "PDF payslips",
  "Role scopes",
  "Attendance boards",
  "Monthly draft runs",
  "Audit trail",
  "Natural-language leave requests",
  "Tool-calling AI assistant",
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="flex items-center shrink-0" aria-hidden={hidden}>
      {CAPABILITIES.map((cap) => (
        <div key={cap} className="flex items-center">
          <span className="px-5 text-sm font-medium whitespace-nowrap" style={{ color: "var(--ink-2)" }}>
            {cap}
          </span>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--primary)" }} aria-hidden />
        </div>
      ))}
    </div>
  );
}

/** Infinite capability marquee — GSAP loop, static under reduced motion. */
export default function Marquee() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-marquee-track]", {
          xPercent: -50,
          ease: "none",
          duration: 28,
          repeat: -1,
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} aria-label="Platform capabilities" className="py-10 sm:py-12">
      <p className="eyebrow text-center mb-6">Everything the ledger runs on</p>
      <div className="marquee-mask overflow-hidden border-y py-5" style={{ borderColor: "#E4E9EE" }}>
        <div data-marquee-track className="flex w-max will-change-transform">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
