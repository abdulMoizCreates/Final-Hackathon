"use client";

import { useRef } from "react";
import { Building, Users, User, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap, Draggable, useGSAP } from "@/lib/gsap";
import SectionHeading from "./SectionHeading";

const ROLES = [
  {
    icon: Building,
    title: "Company Administrator",
    desc: "Owns the system once. Sets the rules everything else obeys.",
    permissions: [
      "First-run setup & working hours",
      "Office geofence",
      "Departments & HR logins",
      "Final payroll lock",
    ],
    preview: ["Working hours · 09:00–18:00", "Geofence · 120 m", "HR logins · issued"],
  },
  {
    icon: Users,
    title: "HR Operations",
    desc: "Runs the people layer, day after day.",
    permissions: [
      "Employee directory",
      "Temporary login distribution",
      "Leave approval inbox",
      "Attendance boards",
      "Monthly draft runs",
    ],
    preview: ["Inbox · 2 requests", "Attendance board · live", "Draft run · October"],
  },
  {
    icon: User,
    title: "Employee Self-Service",
    desc: "Everything an employee needs, without asking HR.",
    permissions: [
      "One-click web check-in",
      "Natural-language leave requests",
      "Attendance calendar",
      "PDF payslip downloads",
    ],
    preview: ["Check in · one click", "Leave · “Friday off?”", "Payslip · PDF"],
  },
];

const CARD_W = 400;
const GAP = 24;

export default function Roles() {
  const container = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable[]>([]);

  const maxDrag = () => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return 0;
    return Math.max(0, track.scrollWidth - viewport.clientWidth);
  };

  const updateProgress = () => {
    const track = trackRef.current;
    const bar = progressRef.current;
    if (!track || !bar) return;
    const max = maxDrag();
    const x = gsap.getProperty(track, "x") as number;
    const pct = max > 0 ? Math.min(1, Math.max(0, -x / max)) : 0;
    bar.style.transform = `scaleX(${0.06 + pct * 0.94})`;
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-role-card]", {
          y: 34,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-roles-slider]", start: "top 78%", once: true },
        });
      });

      const draggable = Draggable.create(trackRef.current, {
        type: "x",
        bounds: { minX: -maxDrag(), maxX: 0 },
        edgeResistance: 0.82,
        allowNativeTouchScrolling: true,
        snap: {
          x: (value: number) => Math.round(value / (CARD_W + GAP)) * (CARD_W + GAP),
        },
        onDrag: updateProgress,
        onThrowUpdate: updateProgress,
      });
      draggableRef.current = draggable;

      const onResize = () => {
        draggableRef.current[0]?.applyBounds({ minX: -maxDrag(), maxX: 0 });
        updateProgress();
      };
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        draggableRef.current.forEach((d) => d.kill());
        draggableRef.current = [];
      };
    },
    { scope: container }
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    const track = trackRef.current;
    if (!track) return;
    const x = gsap.getProperty(track, "x") as number;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      gsap.to(track, { x: Math.max(x - (CARD_W + GAP), -maxDrag()), duration: 0.7, ease: "power3.out", onUpdate: updateProgress });
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      gsap.to(track, { x: Math.min(x + (CARD_W + GAP), 0), duration: 0.7, ease: "power3.out", onUpdate: updateProgress });
    }
  };

  return (
    <section ref={container} id="roles" className="py-20 sm:py-28 scroll-mt-20" aria-labelledby="roles-title">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <SectionHeading
          id="roles-title"
          eyebrow="Role architecture"
          title={
            <>
              Three roles. Nothing&nbsp;
              <span style={{ color: "var(--ink-3)" }}>they shouldn&rsquo;t see.</span>
            </>
          }
          lede="Every screen, action and record is scoped by role — drag through the three ways people meet HCM Lite."
        />

        {/* Slider */}
        <div
          data-roles-slider
          ref={viewportRef}
          className="mt-12 overflow-hidden -mx-5 sm:-mx-6 px-5 sm:px-6"
          role="region"
          aria-roledescription="carousel"
          aria-label="Roles of HCM Lite"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          <div ref={trackRef} className="flex gap-6 w-max will-change-transform touch-pan-y cursor-grab active:cursor-grabbing">
            {ROLES.map((role) => (
              <article
                key={role.title}
                data-role-card
                className="w-[300px] sm:w-[400px] shrink-0 rounded-2xl gradient-border shadow-card p-6 sm:p-7 select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--primary-soft)", color: "var(--primary-hover)" }} aria-hidden>
                    <role.icon size={18} />
                  </span>
                  <h3 className="display-md" style={{ fontSize: "1.125rem" }}>{role.title}</h3>
                </div>
                <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--ink-3)" }}>
                  {role.desc}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {role.permissions.map((perm) => (
                    <li key={perm} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--ink-2)" }}>
                      <Check size={14} className="mt-0.5 shrink-0" strokeWidth={2.5} aria-hidden style={{ color: "var(--primary)" }} />
                      {perm}
                    </li>
                  ))}
                </ul>

                {/* Mini UI preview */}
                <div className="mt-6 rounded-xl px-4 py-3 font-mono text-[11px] leading-relaxed space-y-1" style={{ background: "var(--canvas)", border: "1px solid #EEF1F4", color: "var(--ink-3)" }} aria-hidden>
                  {role.preview.map((line) => (
                    <div key={line} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "var(--primary)" }} />
                      {line}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-5 mt-8">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const x = gsap.getProperty(trackRef.current, "x") as number;
                gsap.to(trackRef.current, { x: Math.min(x + (CARD_W + GAP), 0), duration: 0.7, ease: "power3.out", onUpdate: updateProgress });
              }}
              className="w-10 h-10 rounded-xl border flex items-center justify-center transition-colors hover:bg-slate-50"
              style={{ borderColor: "#E4E9EE", color: "var(--ink-2)" }}
              aria-label="Previous role"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => {
                const x = gsap.getProperty(trackRef.current, "x") as number;
                gsap.to(trackRef.current, { x: Math.max(x - (CARD_W + GAP), -maxDrag()), duration: 0.7, ease: "power3.out", onUpdate: updateProgress });
              }}
              className="w-10 h-10 rounded-xl border flex items-center justify-center transition-colors hover:bg-slate-50"
              style={{ borderColor: "#E4E9EE", color: "var(--ink-2)" }}
              aria-label="Next role"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "#E4E9EE" }} aria-hidden>
            <div ref={progressRef} className="h-full w-full origin-left" style={{ background: "var(--primary)", transform: "scaleX(0.06)" }} />
          </div>
          <span className="text-[11px] font-mono hidden sm:block" style={{ color: "var(--ink-4)" }}>drag · arrow keys</span>
        </div>
      </div>
    </section>
  );
}
