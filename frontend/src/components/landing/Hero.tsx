"use client";

import Link from "next/link";
import { useRef } from "react";
import { Sparkles, ArrowRight, Check, MapPin, Bell, FileDown } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useAuth } from "@/context/AuthContext";
import DashboardMockup from "./DashboardMockup";

const PROOF_CHIPS = [
  { icon: Check, label: "One record per day" },
  { icon: Check, label: "One calculation per payslip" },
  { icon: Check, label: "Answers from live ledger data" },
];

const HERO_LINES = ["Attendance, leave", "and payroll"];
const HERO_LINE_MUTED = "that agree with each other.";

export default function Hero() {
  const { user } = useAuth();
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* Load-in intro — everything animates from, content visible without JS */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
        tl.from("[data-hero-badge]", { y: 18, opacity: 0, duration: 0.7 })
          .from(
            "[data-hero-line]",
            { yPercent: 115, duration: 1.05, stagger: 0.1 },
            "<0.1"
          )
          .from("[data-hero-fade]", { y: 22, opacity: 0, duration: 0.8, stagger: 0.08 }, "<0.25")
          .from("[data-hero-mockup]", { y: 90, opacity: 0, duration: 1.1 }, "<0.2")
          .from("[data-float]", { opacity: 0, scale: 0.85, duration: 0.6, stagger: 0.12 }, "<0.4");

        /* Scroll parallax on the floating mini-cards + subtle frame lift */
        mm.add("(min-width: 768px)", () => {
          gsap.to("[data-float='1']", {
            y: -52,
            ease: "none",
            scrollTrigger: { trigger: container.current, start: "top top", end: "bottom top", scrub: true },
          });
          gsap.to("[data-float='2']", {
            y: -84,
            ease: "none",
            scrollTrigger: { trigger: container.current, start: "top top", end: "bottom top", scrub: true },
          });
          gsap.to("[data-float='3']", {
            y: -38,
            ease: "none",
            scrollTrigger: { trigger: container.current, start: "top top", end: "bottom top", scrub: true },
          });
          gsap.to("[data-hero-frame]", {
            rotateX: 0,
            y: 0,
            ease: "none",
            scrollTrigger: { trigger: "[data-hero-frame]", start: "top 90%", end: "top 35%", scrub: true },
          });
        });
      });
    },
    { scope: container, revertOnUpdate: false }
  );

  return (
    <section ref={container} className="relative overflow-x-clip" aria-label="Introduction">
      {/* Backdrop — dots + brand glows */}
      <div className="absolute inset-0 bg-dots opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_0%,#000_30%,transparent_75%)]" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[480px] w-[820px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(13,148,136,0.14), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-64 -left-40 h-[380px] w-[380px] rounded-full blur-3xl opacity-60"
        style={{ background: "radial-gradient(closest-side, rgba(242,176,30,0.10), transparent)" }}
      />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 pt-32 sm:pt-40 pb-16 sm:pb-20">
        {/* Badge */}
        <div className="flex justify-center">
          <span
            data-hero-badge
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-soft"
            style={{ background: "var(--primary-soft)", color: "var(--primary-hover)" }}
          >
            <Sparkles size={13} aria-hidden /> Precision human capital management
          </span>
        </div>

        {/* Headline — masked line reveal */}
        <h1 className="display-xl text-center mt-7 mx-auto max-w-4xl" style={{ color: "var(--ink)" }}>
          {HERO_LINES.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.09em] -mb-[0.09em]" aria-hidden={false}>
              <span data-hero-line className="block">{line}</span>
            </span>
          ))}
          <span className="block overflow-hidden pb-[0.09em] -mb-[0.09em]">
            <span data-hero-line className="block" style={{ color: "var(--ink-3)" }}>
              {HERO_LINE_MUTED}
            </span>
          </span>
        </h1>

        {/* Lede + CTAs */}
        <p data-hero-fade className="lede max-w-xl mx-auto text-center mt-6">
          One record for every day, one calculation for every payslip — and an AI assistant
          that answers strictly from live ledger records.
        </p>

        <div data-hero-fade className="flex flex-wrap justify-center items-center gap-3 mt-8">
          <Link
            href={user ? "/dashboard" : "/login"}
            className="px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-primary-deep active:scale-[0.98] bg-primary-strong text-white flex items-center gap-2"
            style={{ boxShadow: "0 8px 20px -6px rgba(15,118,110,0.5)" }}
          >
            <span>{user ? "Open workspace" : "Sign in to workspace"}</span>
            <ArrowRight size={16} aria-hidden />
          </Link>
          <Link
            href="/setup"
            className="px-6 py-3.5 rounded-xl text-sm font-semibold border bg-white transition-colors duration-200 hover:bg-slate-50 active:scale-[0.98]"
            style={{ borderColor: "#E4E9EE", color: "var(--ink)" }}
          >
            First-run setup
          </Link>
        </div>

        {/* Proof chips */}
        <ul data-hero-fade className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-7">
          {PROOF_CHIPS.map((chip) => (
            <li key={chip.label} className="flex items-center gap-2 text-sm" style={{ color: "var(--ink-3)" }}>
              <chip.icon size={14} aria-hidden style={{ color: "var(--primary)" }} strokeWidth={2.5} />
              {chip.label}
            </li>
          ))}
        </ul>

        {/* Dashboard mockup with floating cards */}
        <div className="relative mt-14 sm:mt-20 [perspective:1200px]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-8 -top-10 h-40 rounded-full blur-3xl"
            style={{ background: "radial-gradient(closest-side, rgba(13,148,136,0.18), transparent)" }}
          />
          <div data-hero-frame style={{ transform: "rotateX(6deg)" }} className="relative will-change-transform">
            <DashboardMockup />
          </div>

          {/* Floating mini-cards */}
          <div
            data-float="1"
            className="hidden sm:flex absolute -left-4 lg:-left-10 top-20 items-center gap-2.5 rounded-xl px-4 py-3 glass shadow-lift"
            aria-hidden
          >
            <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--st-present-bg)", color: "var(--st-present-fg)" }}>
              <MapPin size={15} />
            </span>
            <div>
              <div className="text-xs font-semibold" style={{ color: "var(--ink)" }}>Check-in confirmed</div>
              <div className="text-[11px] font-mono tabular-nums" style={{ color: "var(--ink-4)" }}>09:07 · inside geofence</div>
            </div>
          </div>

          <div
            data-float="2"
            className="hidden md:flex absolute -right-3 lg:-right-9 top-56 items-center gap-2.5 rounded-xl px-4 py-3 glass shadow-lift"
            aria-hidden
          >
            <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--st-leave-bg)", color: "var(--st-leave-fg)" }}>
              <Bell size={15} />
            </span>
            <div>
              <div className="text-xs font-semibold" style={{ color: "var(--ink)" }}>Leave approved</div>
              <div className="text-[11px]" style={{ color: "var(--ink-4)" }}>Inbox cleared</div>
            </div>
          </div>

          <div
            data-float="3"
            className="hidden sm:flex absolute left-6 lg:left-16 -bottom-6 items-center gap-2.5 rounded-xl px-4 py-3 glass shadow-lift"
            aria-hidden
          >
            <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--primary-soft)", color: "var(--primary-hover)" }}>
              <FileDown size={15} />
            </span>
            <div>
              <div className="text-xs font-semibold" style={{ color: "var(--ink)" }}>Payslip ready</div>
              <div className="text-[11px]" style={{ color: "var(--ink-4)" }}>October · PDF</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
