"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useAuth } from "@/context/AuthContext";

export default function FinalCta() {
  const { user } = useAuth();
  const container = useRef<HTMLElement>(null);
  const magnetRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-cta-part]", {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: container.current, start: "top 72%", once: true },
        });
      });

      /* Magnetic pull — fine pointers only */
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const magnet = magnetRef.current;
        if (!magnet) return;
        const xTo = gsap.quickTo(magnet, "x", { duration: 0.4, ease: "power3.out" });
        const yTo = gsap.quickTo(magnet, "y", { duration: 0.4, ease: "power3.out" });

        const onMove = (e: PointerEvent) => {
          const r = magnet.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };
        magnet.addEventListener("pointermove", onMove);
        magnet.addEventListener("pointerleave", onLeave);
        return () => {
          magnet.removeEventListener("pointermove", onMove);
          magnet.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="py-16 sm:py-24" aria-label="Get started">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl text-center py-16 sm:py-24 px-6" style={{ background: "linear-gradient(160deg, var(--moss-950), var(--moss-900) 55%, var(--moss-800))" }}>
          {/* Glow + dots */}
          <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[380px] w-[560px] rounded-full blur-3xl" style={{ background: "radial-gradient(closest-side, rgba(22,101,52,0.35), transparent)" }} />
          <div aria-hidden className="absolute inset-0 bg-dots opacity-20 [mask-image:radial-gradient(60%_60%_at_50%_40%,#000,transparent)]" />

          <div className="relative space-y-5">
            <h2 data-cta-part className="display-lg mx-auto max-w-2xl" style={{ color: "#F1F5F9" }}>
              Run a company where the numbers already&nbsp;agree.
            </h2>
            <p data-cta-part className="text-base leading-relaxed mx-auto max-w-xl" style={{ color: "var(--sidebar-ink-2)" }}>
              Set up the office once — attendance, leave and payroll line up from the first day
              onward. Demo accounts are listed right on the sign-in page.
            </p>
            <div data-cta-part className="pt-4">
              <span ref={magnetRef} className="inline-block will-change-transform">
                <Link
                  href={user ? "/dashboard" : "/login"}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-semibold bg-accent hover:bg-accent-hover active:scale-[0.98] text-white transition-all duration-200"
                  style={{ boxShadow: "0 12px 32px -8px rgba(22,101,52,0.5)" }}
                >
                  {user ? "Open workspace" : "Try live assistant"}
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </span>
            </div>
            <p data-cta-part className="text-xs" style={{ color: "#7D8590" }}>
              {user ? "Your workspace is ready." : "Or start with the first-run company setup."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
