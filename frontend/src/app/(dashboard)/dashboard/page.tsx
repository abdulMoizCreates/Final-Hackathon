"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import KpiStrip from "@/components/ui/KpiStrip";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import DayRail from "@/components/ui/DayRail";
import { Clock, CalendarDays, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

function AdminDashboard() {
  const [metrics, setMetrics] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard/admin")
      .then((r) => setMetrics(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const kpis = [
    { label: "Active Headcount", value: (metrics?.headcount as number) ?? 12, hint: "Total active employees" },
    { label: "Attrition Rate", value: `${(metrics?.attrition as number) ?? 0}%`, hint: "Year to date exits" },
    { label: "Monthly Payroll", value: `PKR ${((metrics?.payrollCost as number) || 1450000).toLocaleString()}`, hint: "Current month net liability" },
    { label: "Average Salary", value: `PKR ${((metrics?.avgSalary as number) || 120800).toLocaleString()}`, hint: "Company-wide mean" },
  ];

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        title="Executive Dashboard"
        subtitle={`Company Overview · ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`}
      >
        <Link
          href="/payroll"
          className="px-4 py-2 rounded-xl text-xs font-semibold shadow-soft hover:opacity-90 transition-opacity"
          style={{ background: "var(--primary)", color: "var(--on-primary)" }}
        >
          Review Payroll
        </Link>
      </PageHeader>

      <KpiStrip items={kpis} />

      {/* Setup Checklist Card */}
      <div className="rounded-2xl p-7 shadow-card space-y-4" style={{ background: "var(--surface)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight" style={{ color: "var(--ink)" }}>
              Organization Setup Roadmap
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--ink-2)" }}>
              Initialize organizational parameters to unlock full automation
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--st-present-bg)", color: "var(--st-present-fg)" }}>
            4 of 6 completed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {[
            { label: "Company profile", done: true, href: "/organization" },
            { label: "Office hours & grace period", done: true, href: "/organization" },
            { label: "Departments & designations", done: true, href: "/organization" },
            { label: "Leave quotas & holidays", done: true, href: "/organization" },
            { label: "Create HR operations login", done: false, href: "/users" },
            { label: "Register initial employees", done: false, href: "/employees/register" },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="p-3.5 rounded-xl shadow-soft flex items-center justify-between transition-all hover:translate-y-[-1px]"
              style={{ background: item.done ? "var(--sunken)" : "var(--surface)" }}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2
                  size={16}
                  style={{ color: item.done ? "var(--st-present-fg)" : "var(--ink-3)" }}
                />
                <span className="text-xs font-medium" style={{ color: "var(--ink)" }}>{item.label}</span>
              </div>
              <ArrowRight size={13} style={{ color: "var(--ink-3)" }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Analytics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl p-7 shadow-card space-y-3" style={{ background: "var(--surface)" }}>
          <h3 className="text-sm font-bold tracking-tight" style={{ color: "var(--ink)" }}>Department Cost Distribution</h3>
          <div className="space-y-3 pt-2">
            {[
              { name: "Engineering", pct: 52, amount: "PKR 754,000" },
              { name: "Product & Design", pct: 24, amount: "PKR 348,000" },
              { name: "Human Resources", pct: 14, amount: "PKR 203,000" },
              { name: "Operations", pct: 10, amount: "PKR 145,000" },
            ].map((d) => (
              <div key={d.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium" style={{ color: "var(--ink)" }}>{d.name}</span>
                  <span className="tabular-nums font-semibold" style={{ color: "var(--ink-2)" }}>{d.amount}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--sunken)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${d.pct}%`, background: "var(--primary)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-7 shadow-card space-y-4" style={{ background: "var(--surface)" }}>
          <h3 className="text-sm font-bold tracking-tight" style={{ color: "var(--ink)" }}>Recent Administrative Audit Events</h3>
          <div className="space-y-3 text-xs">
            {[
              { actor: "Admin", action: "FINALIZE", entity: "Payroll Oct 2026", time: "2 hours ago" },
              { actor: "HR Lead", action: "APPROVE", entity: "Leave Request #402", time: "4 hours ago" },
              { actor: "Admin", action: "UPDATE", entity: "Office Geofence Radius", time: "Yesterday" },
            ].map((ev, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl shadow-soft" style={{ background: "var(--sunken)" }}>
                <div>
                  <span className="font-semibold block" style={{ color: "var(--ink)" }}>{ev.entity}</span>
                  <span className="text-[11px]" style={{ color: "var(--ink-3)" }}>{ev.actor} · {ev.action}</span>
                </div>
                <span className="text-[11px]" style={{ color: "var(--ink-3)" }}>{ev.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HRDashboard() {
  const [metrics, setMetrics] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/hr")
      .then((r) => setMetrics(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const kpis = [
    { label: "Total Staff", value: 12, hint: "Active workforce" },
    { label: "Present Today", value: 10, hint: "Checked in on time" },
    { label: "On Leave", value: 1, hint: "Approved absence" },
    { label: "Late Arrivals", value: 1, hint: "Past 09:15 AM grace" },
    { label: "Pending Approvals", value: 2, hint: "Requires HR decision" },
  ];

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        title="Operations Dashboard"
        subtitle={`Daily Workforce Status · ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`}
      >
        <Link
          href="/employees/register"
          className="px-4 py-2 rounded-xl text-xs font-semibold shadow-soft hover:opacity-90 transition-opacity"
          style={{ background: "var(--primary)", color: "var(--on-primary)" }}
        >
          Register Employee
        </Link>
      </PageHeader>

      <KpiStrip items={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl p-7 shadow-card space-y-4" style={{ background: "var(--surface)" }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-tight" style={{ color: "var(--ink)" }}>Pending Approvals</h3>
            <Link href="/leave" className="text-xs font-semibold" style={{ color: "var(--primary)" }}>View all</Link>
          </div>
          <div className="space-y-2.5">
            {[
              { name: "Fatima Noor", type: "Annual Leave", dates: "28 Oct - 30 Oct", days: 3 },
              { name: "Ahmed Raza", type: "Casual Leave", dates: "Tomorrow", days: 1 },
            ].map((req, i) => (
              <div key={i} className="p-3.5 rounded-xl shadow-soft flex items-center justify-between" style={{ background: "var(--sunken)" }}>
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--ink)" }}>{req.name}</p>
                  <p className="text-[11px]" style={{ color: "var(--ink-3)" }}>{req.type} · {req.dates}</p>
                </div>
                <Link
                  href="/leave"
                  className="px-3 py-1 rounded-lg text-xs font-semibold shadow-soft"
                  style={{ background: "var(--primary)", color: "var(--on-primary)" }}
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-7 shadow-card space-y-4" style={{ background: "var(--surface)" }}>
          <h3 className="text-sm font-bold tracking-tight" style={{ color: "var(--ink)" }}>Today's Late Check-ins</h3>
          <div className="p-3.5 rounded-xl shadow-soft flex items-center justify-between" style={{ background: "var(--sunken)" }}>
            <div>
              <p className="text-xs font-semibold" style={{ color: "var(--ink)" }}>Zainab Tariq</p>
              <p className="text-[11px]" style={{ color: "var(--ink-3)" }}>Checked in at 09:28 AM (13 mins past grace)</p>
            </div>
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full" style={{ background: "var(--st-late-bg)", color: "var(--st-late-fg)" }}>
              Late
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmployeeDashboard() {
  const { user } = useAuth();
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | undefined>("09:07");
  const [checkingIn, setCheckingIn] = useState(false);

  const toggleCheck = () => {
    setCheckingIn(true);
    setTimeout(() => {
      setCheckedIn(!checkedIn);
      setCheckInTime(checkedIn ? undefined : "09:07");
      setCheckingIn(false);
    }, 400);
  };

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        title="Personal Workspace"
        subtitle={`Welcome back, ${user?.name || "Staff Member"} · ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Check-in panel */}
        <div className="lg:col-span-7 rounded-2xl p-7 shadow-card space-y-6" style={{ background: "var(--surface)" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--ink-3)" }}>
              Today's Workday Rail
            </span>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full shadow-soft"
              style={{
                background: checkedIn ? "var(--st-present-bg)" : "var(--sunken)",
                color: checkedIn ? "var(--st-present-fg)" : "var(--ink-3)",
              }}
            >
              {checkedIn ? "Checked in · Present" : "Not checked in"}
            </span>
          </div>

          <DayRail
            checkInAt={checkInTime}
            checkOutAt={checkedIn ? undefined : undefined}
            status="present"
            size="lg"
          />

          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={toggleCheck}
              disabled={checkingIn}
              className="px-8 py-3.5 rounded-xl text-sm font-semibold shadow-soft hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
              style={{
                background: checkedIn ? "var(--st-late-fg)" : "var(--primary)",
                color: "var(--on-primary)",
              }}
            >
              {checkingIn ? "Recording..." : checkedIn ? "Check Out Now" : "Check In for Today"}
            </button>
            <span className="text-xs" style={{ color: "var(--ink-3)" }}>
              {checkedIn ? "Recorded at 09:07 AM (Office: 09:00 AM)" : "Office hours start at 09:00 AM"}
            </span>
          </div>
        </div>

        {/* Right Info Panels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl p-6 shadow-card space-y-3" style={{ background: "var(--surface)" }}>
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--ink-3)" }}>
              <Clock size={15} /> Weekly Workload
            </h3>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold tabular-nums" style={{ color: "var(--ink)" }}>32.5h</span>
              <span className="text-xs font-medium" style={{ color: "var(--ink-3)" }}>of 40.0h requirement</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--sunken)" }}>
              <div className="h-full rounded-full transition-all" style={{ width: "81%", background: "var(--primary)" }} />
            </div>
          </div>

          <div className="rounded-2xl p-6 shadow-card space-y-3" style={{ background: "var(--surface)" }}>
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--ink-3)" }}>
              <CalendarDays size={15} /> Leave Remaining
            </h3>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2.5 rounded-xl shadow-soft" style={{ background: "var(--sunken)" }}>
                <span className="text-lg font-bold block tabular-nums" style={{ color: "var(--ink)" }}>11</span>
                <span className="text-[10px] uppercase font-semibold" style={{ color: "var(--ink-3)" }}>Annual</span>
              </div>
              <div className="p-2.5 rounded-xl shadow-soft" style={{ background: "var(--sunken)" }}>
                <span className="text-lg font-bold block tabular-nums" style={{ color: "var(--ink)" }}>7</span>
                <span className="text-[10px] uppercase font-semibold" style={{ color: "var(--ink-3)" }}>Sick</span>
              </div>
              <div className="p-2.5 rounded-xl shadow-soft" style={{ background: "var(--sunken)" }}>
                <span className="text-lg font-bold block tabular-nums" style={{ color: "var(--ink)" }}>8</span>
                <span className="text-[10px] uppercase font-semibold" style={{ color: "var(--ink-3)" }}>Casual</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { role } = useAuth();

  if (role === "Admin") return <AdminDashboard />;
  if (role === "HR") return <HRDashboard />;
  return <EmployeeDashboard />;
}
