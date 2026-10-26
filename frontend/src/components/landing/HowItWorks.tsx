"use client";

import { useRef } from "react";
import { MapPin, Bell, FileText, Check } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import SectionHeading from "./SectionHeading";

const STEPS = [
  {
    icon: MapPin,
    tag: "Dayrail",
    title: "Attendance closes first",
    desc: "Every check-in and check-out lands on the Dayrail — geofence verified, grace applied, status computed.",
  },
  {
    icon: Bell,
    tag: "Approval inbox",
    title: "Leave writes into the ledger",
    desc: "Approved leave adjusts the same daily record. There is no side spreadsheet to reconcile.",
  },
  {
    icon: FileText,
    tag: "Monthly draft",
    title: "Payroll computes from it",
    desc: "Payslips are calculated from the one record — attendance and leave already agree by construction.",
  },
];

export default function HowItWorks() {
  const container = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* Desktop — pinned, scrubbed storytelling with SVG line draw */
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const path = pathRef.current;
        if (!path) return;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top top",
            end: "+=1600",
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.from("[data-step-card='0']", { opacity: 0, y: 30, duration: 0.6 }, 0)
          .to("[data-node='0']", { scale: 1.25, backgroundColor: "#0F766E", duration: 0.4 }, 0)
          .to(path, { strokeDashoffset: 0, duration: 3.2, ease: "none" }, 0.2)
          .from("[data-step-card='1']", { opacity: 0, y: 30, duration: 0.6 }, 1.15)
          .to("[data-node='1']", { scale: 1.25, backgroundColor: "#0F766E", duration: 0.4 }, 1.35)
          .from("[data-step-card='2']", { opacity: 0, y: 30, duration: 0.6 }, 2.3)
          .to("[data-node='2']", { scale: 1.25, backgroundColor: "#0F766E", duration: 0.4 }, 2.5)
          .from("[data-resolution]", { opacity: 0, y: 26, scale: 0.96, duration: 0.8, ease: "power3.out" }, 3.2);
      });

      /* Mobile / reduced motion — stacked, gently revealed */
      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        gsap.from("[data-step-card]", {
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: stageRef.current, start: "top 75%", once: true },
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} id="how-it-works" className="scroll-mt-20" aria-labelledby="how-title">
      <div className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <SectionHeading
            id="how-title"
            align="center"
            eyebrow="How it works"
            title={
              <>
                Attendance → Leave → Payroll,&nbsp;
                <span style={{ color: "var(--ink-3)" }}>one flow.</span>
              </>
            }
            lede="Scroll through the path every month takes — and see why nothing ever needs reconciling."
          />
        </div>

        {/* ── Desktop pinned stage ── */}
        <div ref={stageRef} className="hidden lg:flex h-screen flex-col items-center justify-center overflow-hidden" aria-hidden={false}>
          {/* SVG flow line */}
          <svg viewBox="0 0 640 140" className="w-full max-w-3xl" fill="none" aria-hidden>
            <path
              ref={pathRef}
              d="M 40 70 C 160 20, 320 120, 480 70 S 600 40, 620 70"
              stroke="var(--primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {STEPS.map((_, i) => (
              <circle
                key={i}
                data-node={i}
                cx={[40, 320, 620][i]}
                cy={[70, 82, 70][i]}
                r="10"
                fill="#CBD5E1"
              />
            ))}
          </svg>

          {/* Step cards — absolutely stacked, timeline swaps them */}
          <div className="relative w-full max-w-xl h-[300px] mt-10">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                data-step-card={i}
                className="absolute inset-x-0 top-0 rounded-2xl gradient-border shadow-card p-7 sm:p-8"
                style={{ opacity: i === 0 ? 1 : undefined }}
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--primary-soft)", color: "var(--primary-hover)" }} aria-hidden>
                    <step.icon size={18} />
                  </span>
                  <span className="eyebrow">{step.tag}</span>
                </div>
                <h3 className="display-md mt-4">{step.title}</h3>
                <p className="text-sm leading-relaxed mt-2" style={{ color: "var(--ink-3)" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Resolution */}
          <div data-resolution className="mt-8 flex items-center gap-2.5 rounded-full px-5 py-2.5 shadow-soft" style={{ background: "var(--primary-soft)", color: "var(--primary-deep)" }}>
            <Check size={15} strokeWidth={2.75} aria-hidden />
            <span className="text-sm font-semibold">One record per day. One calculation per payslip.</span>
          </div>
        </div>

        {/* ── Mobile stacked flow ── */}
        <div className="lg:hidden max-w-xl mx-auto px-5 sm:px-6 mt-12 space-y-4">
          {STEPS.map((step, i) => (
            <div key={step.title} data-step-card className="relative pl-8">
              {i < STEPS.length - 1 && (
                <span className="absolute left-[13px] top-10 bottom-[-1.5rem] w-px" style={{ background: "#E4E9EE" }} aria-hidden />
              )}
              <span className="absolute left-0 top-5 w-[27px] flex justify-center">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-soft" style={{ background: "var(--primary)" }} aria-hidden />
              </span>
              <div className="rounded-2xl gradient-border shadow-card p-6">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--primary-soft)", color: "var(--primary-hover)" }} aria-hidden>
                    <step.icon size={16} />
                  </span>
                  <span className="eyebrow">{step.tag}</span>
                </div>
                <h3 className="text-base font-display font-semibold tracking-tight mt-3">{step.title}</h3>
                <p className="text-sm leading-relaxed mt-1.5" style={{ color: "var(--ink-3)" }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2.5 rounded-full px-5 py-2.5 shadow-soft w-fit" style={{ background: "var(--primary-soft)", color: "var(--primary-deep)" }}>
            <Check size={15} strokeWidth={2.75} aria-hidden />
            <span className="text-sm font-semibold">One record per day. One calculation per payslip.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
