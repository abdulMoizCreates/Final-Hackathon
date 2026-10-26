"use client";

import { useRef } from "react";
import { FileDown, Bell, MapPin, ScrollText } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import SectionHeading from "./SectionHeading";

/* Deterministic month pattern (present/late/leave/absent/rest) — hydration-safe */
const HEAT: string[] = [
  "p","p","p","p","l","r","r",
  "p","late","p","p","p","r","r",
  "p","p","lv","p","p","r","r",
  "p","p","p","late","p","r","r",
  "p","p","p","p","lv","r","r",
];
const HEAT_STYLE: Record<string, string> = {
  p: "var(--accent)", late: "var(--highlight)", lv: "#94A3B8", r: "var(--sunken)",
};
const HEAT_OP: Record<string, number> = { p: 0.85, late: 0.9, lv: 0.7, r: 1 };

const AUDIT_LINES = [
  "09:07 · check-in · geofence OK",
  "13:00 · leave posted · ledger",
  "18:02 · check-out · day closed",
  "09:00 · payroll draft · locked",
];

function BentoCard({
  className = "",
  children,
  onPointerMove,
  onPointerLeave,
}: {
  className?: string;
  children: React.ReactNode;
  onPointerMove?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerLeave?: (e: React.PointerEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      data-bento-card
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`spotlight rounded-2xl gradient-border shadow-card p-6 sm:p-7 will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

export default function BentoGrid() {
  const container = useRef<HTMLElement>(null);
  const canHover = useRef(false);

  useGSAP(
    () => {
      canHover.current =
        window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-bento-card]", {
          y: 34,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: "[data-bento-grid]", start: "top 75%", once: true },
        });
      });
    },
    { scope: container }
  );

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canHover.current) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    gsap.to(el, {
      rotateX: ((e.clientY - r.top) / r.height - 0.5) * -3.5,
      rotateY: ((e.clientX - r.left) / r.width - 0.5) * 3.5,
      transformPerspective: 900,
      duration: 0.5,
      ease: "power2.out",
    });
  };
  const onLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canHover.current) return;
    gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "power3.out" });
  };

  return (
    <section ref={container} id="features" className="py-20 sm:py-28 scroll-mt-20" aria-labelledby="features-title">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <SectionHeading
          id="features-title"
          eyebrow="Features"
          title={
            <>
              Everything agrees because it&rsquo;s&nbsp;
              <span style={{ color: "var(--ink-3)" }}>one system.</span>
            </>
          }
          lede="No export-import rituals, no reconciliation meetings. The same daily record feeds attendance boards, approvals and payslips."
        />

        <div data-bento-grid className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-14 sm:mt-16">
          {/* Attendance heatmap — large */}
          <BentoCard className="md:col-span-7" onPointerMove={onMove} onPointerLeave={onLeave}>
            <h3 className="display-md">Attendance calendar</h3>
            <p className="text-sm leading-relaxed mt-2" style={{ color: "var(--ink-3)" }}>
              A month of days at a glance — present, late, leave and absent, straight from the
              daily ledger.
            </p>
            <div className="mt-6 grid grid-cols-7 gap-1.5 max-w-md" aria-hidden>
              {HEAT.map((cell, i) => (
                <span
                  key={i}
                  className="h-6 rounded-md"
                  style={{ background: HEAT_STYLE[cell], opacity: HEAT_OP[cell] }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-4" aria-hidden>
              {[
                ["Present", "var(--accent)"],
                ["Late", "var(--highlight)"],
                ["On leave", "#94A3B8"],
              ].map(([label, color]) => (
                <span key={label} className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: "var(--ink-3)" }}>
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} /> {label}
                </span>
              ))}
            </div>
          </BentoCard>

          {/* Geofence radar — small */}
          <BentoCard className="md:col-span-5" onPointerMove={onMove} onPointerLeave={onLeave}>
            <h3 className="display-md">Geofenced check-in</h3>
            <p className="text-sm leading-relaxed mt-2" style={{ color: "var(--ink-3)" }}>
              The office perimeter is set once. Check-in only counts inside it.
            </p>
            <div className="relative mt-6 h-44 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: "var(--sunken)" }} aria-hidden>
              <div className="absolute w-52 h-52 rounded-full border" style={{ borderColor: "rgba(22,101,52,0.16)" }} />
              <div className="absolute w-36 h-36 rounded-full border" style={{ borderColor: "rgba(22,101,52,0.26)" }} />
              <div className="absolute w-20 h-20 rounded-full border" style={{ borderColor: "rgba(22,101,52,0.4)" }} />
              <span className="relative w-3.5 h-3.5 rounded-full" style={{ background: "var(--accent)" }}>
                <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(22,101,52,0.3)" }} />
              </span>
              <span className="absolute top-4 right-5 flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md bg-white shadow-soft" style={{ color: "var(--ink-2)" }}>
                <MapPin size={11} style={{ color: "var(--accent)" }} /> 120 m radius
              </span>
            </div>
          </BentoCard>

          {/* Approval inbox — small */}
          <BentoCard className="md:col-span-5" onPointerMove={onMove} onPointerLeave={onLeave}>
            <h3 className="display-md">Leave approval inbox</h3>
            <p className="text-sm leading-relaxed mt-2" style={{ color: "var(--ink-3)" }}>
              Requests arrive drafted; HR approves with one click. The ledger adjusts itself.
            </p>
            <div className="mt-6 space-y-2.5" aria-hidden>
              {[
                { name: "A. Raza", type: "Annual leave · Fri", chip: "Approve" },
                { name: "S. Khan", type: "Sick leave · Mon", chip: "Approve" },
              ].map((req) => (
                <div key={req.name} className="flex items-center justify-between rounded-xl px-3.5 py-3" style={{ background: "var(--canvas)", border: "1px solid #EEF1F4" }}>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: "var(--ink)" }}>{req.name}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-4)" }}>{req.type}</div>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg" style={{ background: "var(--sunken)", color: "var(--accent)" }}>
                    <Bell size={11} /> {req.chip}
                  </span>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Payslip — large */}
          <BentoCard className="md:col-span-7" onPointerMove={onMove} onPointerLeave={onLeave}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="display-md">Payslips from the same record</h3>
                <p className="text-sm leading-relaxed mt-2" style={{ color: "var(--ink-3)" }}>
                  One calculation per payslip — computed from the daily record, downloadable as
                  PDF by the employee.
                </p>
              </div>
              <FileDown size={18} className="shrink-0 mt-1" style={{ color: "var(--accent)" }} aria-hidden />
            </div>
            <div className="mt-6 rounded-xl p-4" style={{ background: "var(--canvas)", border: "1px solid #EEF1F4" }} aria-hidden>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold" style={{ color: "var(--ink)" }}>Payslip · October</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ background: "var(--sunken)", color: "var(--ink-2)" }}>computed</span>
              </div>
              <div className="text-xs font-mono tabular-nums space-y-1.5" style={{ color: "var(--ink-3)" }}>
                <div className="flex justify-between"><span>Basic</span><span>Rs. 120,000</span></div>
                <div className="flex justify-between"><span>Allowances</span><span style={{ color: "var(--accent)" }}>+Rs. 18,000</span></div>
                <div className="flex justify-between pt-1 font-semibold" style={{ borderTop: "1px dashed #D8DEE5", color: "var(--ink)" }}><span>Net</span><span>Rs. 132,000</span></div>
              </div>
            </div>
          </BentoCard>

          {/* Audit trail — full width */}
          <BentoCard className="md:col-span-12" onPointerMove={onMove} onPointerLeave={onLeave}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5">
                <ScrollText size={20} style={{ color: "var(--accent)" }} aria-hidden />
                <h3 className="display-md mt-3">Audit trail, by default</h3>
                <p className="text-sm leading-relaxed mt-2" style={{ color: "var(--ink-3)" }}>
                  Every posting, approval and lock is logged — so payroll day is boring, in the
                  best possible way.
                </p>
              </div>
              <div className="lg:col-span-7 rounded-xl p-4 font-mono text-[11px] sm:text-xs leading-loose tabular-nums" style={{ background: "var(--moss-900)", color: "#9FB8AE" }} aria-hidden>
                {AUDIT_LINES.map((line) => (
                  <div key={line} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent-light)" }} />
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
