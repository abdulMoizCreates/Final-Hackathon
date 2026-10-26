"use client";

import { useRef } from "react";
import { Clock, MapPin, CalendarClock } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import SectionHeading from "./SectionHeading";

/* Day spans 08:00 → 20:00 (720 min). DayRail product facts:
   office start 09:00, 15-min grace, half-day threshold, check-out compute. */
const POS = {
  checkIn: ((9 * 60 + 7 - 480) / 720) * 100,   // 9.3%
  grace: ((9 * 60 + 15 - 480) / 720) * 100,    // 10.4%
  halfDay: ((13 * 60 - 480) / 720) * 100,      // 41.7%
  checkOut: ((18 * 60 + 2 - 480) / 720) * 100, // 83.6%
};

const FACTS = [
  { icon: MapPin, label: "Geofenced check-in", note: "Office perimeter enforced at the door" },
  { icon: Clock, label: "15-min grace window", note: "Late arrivals computed, never argued" },
  { icon: CalendarClock, label: "Half-day at check-out", note: "Threshold applied automatically" },
];

export default function DayrailShowcase() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: "[data-rail]",
            start: "top 78%",
            end: "top 28%",
            scrub: 0.6,
          },
        });
        tl.from("[data-rail-fill]", { scaleX: 0, duration: 1.2, transformOrigin: "left center" })
          .from("[data-rail-marker]", { scale: 0, opacity: 0, duration: 0.35, stagger: 0.18, ease: "back.out(2.2)" }, "<0.35")
          .from("[data-rail-label]", { y: 12, opacity: 0, duration: 0.5, stagger: 0.16 }, "<0.25")
          .from("[data-rail-fact]", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, "<0.2");
      });
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      id="dayrail"
      className="py-20 sm:py-28 scroll-mt-20"
      aria-labelledby="dayrail-title"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <SectionHeading
          id="dayrail-title"
          align="center"
          eyebrow="Signature Dayrail"
          title={
            <>
              One bar. The whole workday,&nbsp;
              <span style={{ color: "var(--ink-3)" }}>computed.</span>
            </>
          }
          lede="Check-in, grace, late, half-day and check-out — the timeline settles every argument before payroll ever opens."
        />

        {/* The rail */}
        <div data-rail className="relative max-w-4xl mx-auto mt-16 sm:mt-20 px-2" role="img"
          aria-label="Dayrail workday timeline: check-in 09:07, 15 minute grace window, late after 09:15, half-day threshold 13:00, check-out 18:02 — automatically computed">
          {/* Time scale */}
          <div className="flex justify-between mb-3" aria-hidden>
            {["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"].map((t) => (
              <span data-rail-tick key={t} className="text-[10px] font-mono" style={{ color: "var(--ink-5)" }}>
                {t}
              </span>
            ))}
          </div>

          {/* Track */}
          <div className="relative h-5 rounded-full overflow-hidden" style={{ background: "var(--sunken)" }}>
            {/* Grace window */}
            <div
              className="absolute top-0 bottom-0"
              style={{ left: `${POS.checkIn - 0.4}%`, width: `${POS.grace - POS.checkIn + 0.8}%`, background: "var(--highlight-soft)" }}
              aria-hidden
            />
            {/* Worked time — scrubs in */}
            <div
              data-rail-fill
              className="absolute top-0 bottom-0"
              style={{
                left: `${POS.checkIn}%`,
                width: `${POS.checkOut - POS.checkIn}%`,
                background: "linear-gradient(90deg, var(--accent) 0%, var(--accent-hover) 100%)",
              }}
              aria-hidden
            />
          </div>

          {/* Markers */}
          <div data-rail-marker className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow-soft"
            style={{ left: `${POS.checkIn}%`, background: "var(--accent)" }} aria-hidden />
          <div data-rail-marker className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-white shadow-soft"
            style={{ left: `${POS.grace}%`, background: "var(--highlight)" }} aria-hidden />
          <div data-rail-marker className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow-soft"
            style={{ left: `${POS.halfDay}%`, background: "var(--accent)" }} aria-hidden />
          <div data-rail-marker className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-soft"
            style={{ left: `${POS.checkOut}%`, background: "var(--ink)" }} aria-hidden />

          {/* Labels — alternate above/below; simplified on mobile */}
          <div data-rail-label className="absolute -top-12 hidden sm:flex flex-col items-center -translate-x-1/2" style={{ left: `${POS.checkIn}%` }} aria-hidden>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white shadow-card whitespace-nowrap" style={{ color: "var(--ink)" }}>Check-in · 09:07</span>
            <span className="w-px h-3 mt-1" style={{ background: "#D8DEE5" }} />
          </div>
          <div data-rail-label className="absolute top-10 flex-col items-center -translate-x-1/2" style={{ left: "12%" }} aria-hidden>
            <span className="w-px h-3 mb-1" style={{ background: "#D8DEE5" }} />
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white shadow-card whitespace-nowrap" style={{ color: "var(--ink)" }}>
              Grace 15 min <span style={{ color: "var(--ink-4)" }}>· late after</span> 09:15
            </span>
          </div>
          <div data-rail-label className="absolute top-10 flex-col items-center -translate-x-1/2" style={{ left: `${POS.halfDay}%` }} aria-hidden>
            <span className="w-px h-3 mb-1" style={{ background: "#D8DEE5" }} />
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white shadow-card whitespace-nowrap" style={{ color: "var(--ink)" }}>Half-day threshold · 13:00</span>
          </div>
          <div data-rail-label className="absolute -top-12 flex-col items-center -translate-x-1/2" style={{ left: `${POS.checkOut}%` }} aria-hidden>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white shadow-card whitespace-nowrap" style={{ color: "var(--ink)" }}>Check-out · 18:02</span>
            <span className="w-px h-3 mt-1" style={{ background: "#D8DEE5" }} />
          </div>
        </div>

        {/* Facts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mt-20 sm:mt-24">
          {FACTS.map((fact) => (
            <div
              key={fact.label}
              data-rail-fact
              className="rounded-2xl p-5 flex items-start gap-3.5 gradient-border shadow-card"
            >
              <fact.icon size={18} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} aria-hidden />
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{fact.label}</div>
                <div className="text-xs mt-1 leading-relaxed" style={{ color: "var(--ink-3)" }}>{fact.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
