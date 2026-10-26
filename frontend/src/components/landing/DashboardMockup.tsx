"use client";

import DayRail from "@/components/ui/DayRail";

/**
 * High-fidelity HTML/CSS mockup of the HCM Lite workspace —
 * real DayRail component, attendance KPIs, payroll summary.
 * Pure markup, no images. Floating mini-cards get parallax from Hero.
 */
export default function DashboardMockup() {
  return (
    <div
      className="gradient-border rounded-2xl overflow-hidden text-left"
      style={{ boxShadow: "var(--shadow-lift)" }}
      aria-hidden
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{ background: "var(--surface)", borderColor: "#EEF1F4" }}
      >
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FCA5A5" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FCD34D" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#6EE7B7" }} />
        </div>
        <div
          className="mx-auto px-3 py-1 rounded-md text-[11px] font-mono"
          style={{ background: "var(--sunken)", color: "var(--ink-4)" }}
        >
          hcm-lite.app/workspace
        </div>
        <div className="w-10" />
      </div>

      {/* App screen */}
      <div className="p-5 sm:p-7 space-y-5" style={{ background: "var(--surface)" }}>
        {/* Screen header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display font-semibold text-sm" style={{ color: "var(--ink)" }}>
              Today · Tue, 27 Oct
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-4)" }}>
              Office perimeter · 120m geofence
            </div>
          </div>
          <span
            className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
            style={{ background: "var(--st-present-bg)", color: "var(--st-present-fg)" }}
          >
            Ledger synced
          </span>
        </div>

        {/* Signature DayRail */}
        <div
          className="rounded-xl p-4"
          style={{ background: "var(--canvas)", border: "1px solid #EEF1F4" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">Dayrail</span>
            <span
              className="text-[11px] px-2 py-0.5 rounded-full font-semibold tabular-nums"
              style={{ background: "var(--st-present-bg)", color: "var(--st-present-fg)" }}
            >
              Present · 09:07 AM
            </span>
          </div>
          <DayRail checkInAt="09:07" checkOutAt="18:02" status="present" size="lg" />
        </div>

        {/* Attendance KPIs */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Present", value: "8", bg: "var(--kpi-mint-bg)", fg: "var(--kpi-mint-fg)" },
            { label: "Late", value: "2", bg: "var(--st-late-bg)", fg: "var(--st-late-fg)" },
            { label: "On leave", value: "3", bg: "var(--kpi-purple-bg)", fg: "var(--kpi-purple-fg)" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl px-3.5 py-3"
              style={{ background: kpi.bg }}
            >
              <div className="stat-num text-xl leading-none" style={{ color: kpi.fg }}>
                {kpi.value}
              </div>
              <div className="text-[11px] font-medium mt-1.5" style={{ color: "var(--ink-3)" }}>
                {kpi.label}
              </div>
            </div>
          ))}
        </div>

        {/* Payroll summary */}
        <div className="rounded-xl p-4 space-y-2.5" style={{ background: "var(--canvas)", border: "1px solid #EEF1F4" }}>
          <div className="flex items-center justify-between">
            <span className="eyebrow">Payroll · October draft</span>
            <span className="text-[11px]" style={{ color: "var(--ink-4)" }}>Lock on 31st</span>
          </div>
          <div className="text-xs font-mono tabular-nums space-y-1.5" style={{ color: "var(--ink-3)" }}>
            <div className="flex justify-between">
              <span>Basic</span>
              <span style={{ color: "var(--ink-2)" }}>Rs. 120,000</span>
            </div>
            <div className="flex justify-between">
              <span>Allowances</span>
              <span style={{ color: "var(--kpi-mint-fg)" }}>+Rs. 18,000</span>
            </div>
            <div className="flex justify-between">
              <span>Deductions</span>
              <span style={{ color: "var(--kpi-coral-fg)" }}>−Rs. 6,000</span>
            </div>
            <div className="flex justify-between pt-1.5 font-semibold" style={{ borderTop: "1px dashed #D8DEE5", color: "var(--ink)" }}>
              <span>Net pay</span>
              <span className="text-sm">Rs. 132,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
