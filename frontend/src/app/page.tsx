"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import DayRail from "@/components/ui/DayRail";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: "var(--canvas)", color: "var(--ink)" }}>
      {/* Top Navigation */}
      <header className="px-6 sm:px-12 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-40 border-b border-slate-100" style={{ background: "rgba(255, 255, 255, 0.95)", boxShadow: "var(--shadow-subtle)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--primary)", boxShadow: "0 2px 8px rgba(13,148,136,0.3)" }}>
            <div className="w-4 h-0.5 rounded bg-white relative">
              <div className="absolute w-2 h-2 rounded-full -top-[3px] left-1" style={{ background: "var(--highlight)" }} />
            </div>
          </div>
          <span className="font-bold text-lg tracking-tight">HCM Lite</span>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              style={{ background: "var(--primary)", color: "var(--on-primary)" }}
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-black/5 transition-colors cursor-pointer"
                style={{ color: "var(--ink)" }}
              >
                Sign in
              </Link>
              <Link
                href="/setup"
                className="px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                style={{ background: "var(--primary)", color: "var(--on-primary)" }}
              >
                Company setup
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-14 sm:py-20 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold shadow-soft"
              style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
            >
              <Sparkles size={13} /> Precision Human Capital Management
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12]">
              Attendance, leave and payroll that agree with each other.
            </h1>

            <p className="text-base sm:text-lg max-w-xl font-normal leading-relaxed" style={{ color: "var(--ink-2)" }}>
              One record for every day, one calculation for every payslip, and an AI assistant that answers strictly from live ledger records.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={user ? "/dashboard" : "/login"}
                className="px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold shadow-soft hover:opacity-90 transition-all flex items-center gap-2"
                style={{ background: "var(--primary)", color: "var(--on-primary)" }}
              >
                <span>{user ? "Open workspace" : "Sign in to workspace"}</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/setup"
                className="px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold shadow-soft hover:bg-black/5 transition-all"
                style={{ background: "var(--surface)", color: "var(--ink)" }}
              >
                First-run setup
              </Link>
            </div>
          </div>

          {/* Signature DayRail Hero Card */}
          <div
            className="lg:col-span-5 rounded-2xl p-7 shadow-card space-y-4"
            style={{ background: "var(--surface)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--ink-3)" }}>
                Signature DayRail
              </span>
              <span
                className="text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-soft"
                style={{ background: "var(--st-present-bg)", color: "var(--st-present-fg)" }}
              >
                Present · 09:07 AM
              </span>
            </div>

            <DayRail
              checkInAt="09:07"
              checkOutAt="18:02"
              status="present"
              size="lg"
            />

            <p className="text-xs leading-relaxed" style={{ color: "var(--ink-2)" }}>
              The horizontal workday timeline automatically computes late arrivals, grace allowances, and half-day thresholds at check-out.
            </p>
          </div>
        </div>

        {/* 3 Core Roles Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="rounded-2xl p-7 shadow-card space-y-2.5 transition-all hover:translate-y-[-2px]" style={{ background: "var(--surface)" }}>
            <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: "var(--primary)" }}>Role 1</span>
            <h3 className="font-bold text-base tracking-tight" style={{ color: "var(--ink)" }}>Company Administrator</h3>
            <p className="text-xs leading-relaxed font-normal" style={{ color: "var(--ink-2)" }}>
              First-run setup, working hours, office location perimeter, department structures, HR logins, and final payroll lock.
            </p>
          </div>

          <div className="rounded-2xl p-7 shadow-card space-y-2.5 transition-all hover:translate-y-[-2px]" style={{ background: "var(--surface)" }}>
            <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: "var(--primary)" }}>Role 2</span>
            <h3 className="font-bold text-base tracking-tight" style={{ color: "var(--ink)" }}>HR Operations</h3>
            <p className="text-xs leading-relaxed font-normal" style={{ color: "var(--ink-2)" }}>
              Employee directory, temporary login distribution, leave approval inbox, attendance boards, and monthly draft runs.
            </p>
          </div>

          <div className="rounded-2xl p-7 shadow-card space-y-2.5 transition-all hover:translate-y-[-2px]" style={{ background: "var(--surface)" }}>
            <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: "var(--primary)" }}>Role 3</span>
            <h3 className="font-bold text-base tracking-tight" style={{ color: "var(--ink)" }}>Employee Self-Service</h3>
            <p className="text-xs leading-relaxed font-normal" style={{ color: "var(--ink-2)" }}>
              One-click web check-in, smart leave requests via natural language, attendance calendar, and PDF payslip downloads.
            </p>
          </div>
        </div>

        {/* AI Assistant Callout */}
        <div
          className="rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-panel"
          style={{
            background: "linear-gradient(135deg, #091A17 0%, #0F2420 50%, #173B34 100%)",
            color: "var(--sidebar-ink)",
          }}
        >
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Integrated Gemini AI</span>
            <h3 className="text-2xl font-bold tracking-tight">Smart HR Assistant with Tool Calling</h3>
            <p className="text-xs max-w-xl font-normal leading-relaxed" style={{ color: "var(--sidebar-ink-2)" }}>
              Answers questions from actual attendance and leave records, proposes leave forms from sentences, and adheres strictly to role scopes.
            </p>
          </div>
          <Link
            href="/login"
            className="shrink-0 px-6 py-3 rounded-xl text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-soft transition-all"
          >
            Try live assistant
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs font-medium border-t border-slate-100" style={{ background: "var(--surface)", color: "var(--ink-3)" }}>
        HCM Lite &mdash; Enterprise Human Capital Management Platform &copy; 2026
      </footer>
    </div>
  );
}
