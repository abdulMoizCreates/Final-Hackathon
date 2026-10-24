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
import { useRouter } from "next/navigation";
import { Clock, CalendarDays } from "lucide-react";

function AdminDashboard() {
  const [metrics, setMetrics] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    api.get("/dashboard/admin")
      .then((r) => setMetrics(r.data))
      .catch(() => setError("Could not load dashboard. Check your connection and try again."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  const kpis = [
    { label: "Headcount", value: (metrics as Record<string, unknown>)?.headcount ?? 0 },
    { label: "Attrition YTD", value: `${(metrics as Record<string, unknown>)?.attrition ?? 0}%` },
    { label: "Payroll cost", value: `PKR ${((metrics as Record<string, unknown>)?.payrollCost as number)?.toLocaleString() ?? 0}` },
    { label: "Average salary", value: `PKR ${((metrics as Record<string, unknown>)?.avgSalary as number)?.toLocaleString() ?? 0}` },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle={new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} />
      
      {error ? (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      ) : (
        <div className="space-y-6">
          {/* Setup checklist */}
          <div className="rounded-xl p-6" style={{ background: "var(--surface)" }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>Set up HCM Lite</h2>
            <p className="text-sm mb-4" style={{ color: "var(--ink-2)" }}>
              Add your company details, office hours and a department. Then create a login for HR.
            </p>
            <div className="space-y-2">
              {["Company details", "Office hours and location", "Departments", "Leave types", "HR login", "First employee"].map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-sm py-1.5">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{ background: "var(--sunken)", color: "var(--ink-3)" }}>{i + 1}</span>
                  <span style={{ color: "var(--ink-2)" }}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <KpiStrip items={kpis as { label: string; value: string | number }[]} />
        </div>
      )}
    </>
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

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[1,2,3,4,5].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  const kpis = [
    { label: "Headcount", value: (metrics as Record<string, unknown>)?.headcount ?? 0 },
    { label: "Present today", value: (metrics as Record<string, unknown>)?.present ?? 0 },
    { label: "On leave", value: (metrics as Record<string, unknown>)?.onLeave ?? 0 },
    { label: "Late today", value: (metrics as Record<string, unknown>)?.late ?? 0 },
    { label: "Pending approvals", value: (metrics as Record<string, unknown>)?.pending ?? 0 },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle={new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} />
      <div className="space-y-6">
        <KpiStrip items={kpis as { label: string; value: string | number }[]} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl p-6" style={{ background: "var(--surface)" }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--ink)" }}>Attendance trend</h3>
            <EmptyState title="No data for this period" description="Attendance data will appear here once employees check in." />
          </div>
          <div className="rounded-xl p-6" style={{ background: "var(--surface)" }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--ink)" }}>Top late-comers</h3>
            <EmptyState title="No late-comers" description="Late arrival data will appear here." />
          </div>
        </div>
      </div>
    </>
  );
}

function EmployeeDashboard() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/attendance/today")
      .then((r) => setAttendance(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    setError("");
    try {
      const r = await api.post("/attendance/check-in");
      setAttendance(r.data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string }; status?: number } };
      setError(axiosErr.response?.data?.message || "Could not check in. Try again.");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setCheckingIn(true);
    setError("");
    try {
      const r = await api.post("/attendance/check-out");
      setAttendance(r.data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string }; status?: number } };
      setError(axiosErr.response?.data?.message || "Could not check out. Try again.");
    } finally {
      setCheckingIn(false);
    }
  };

  const checkedIn = !!(attendance as Record<string, unknown>)?.checkIn;
  const checkedOut = !!(attendance as Record<string, unknown>)?.checkOut;

  return (
    <>
      <PageHeader title="Dashboard" subtitle={new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Check-in panel */}
        <div className="lg:col-span-7 rounded-xl p-6" style={{ background: "var(--surface)" }}>
          <div className="mb-6">
            <DayRail
              checkInAt={(attendance as Record<string, unknown>)?.checkIn as string | undefined}
              checkOutAt={(attendance as Record<string, unknown>)?.checkOut as string | undefined}
              status={(attendance as Record<string, unknown>)?.status as string | undefined}
              size="lg"
            />
          </div>
          <p className="text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
            {checkedOut
              ? `Checked out`
              : checkedIn
              ? `Checked in`
              : "Not checked in"}
          </p>
          {error && <p className="text-sm mb-3" style={{ color: "var(--st-absent-fg)" }}>{error}</p>}
          {!checkedOut && (
            <button
              onClick={checkedIn ? handleCheckOut : handleCheckIn}
              disabled={checkingIn}
              className="px-8 py-3 rounded-lg text-base font-medium transition-colors disabled:opacity-50"
              style={{ background: "var(--primary)", color: "var(--on-primary)", height: 48 }}
            >
              {checkingIn ? "..." : checkedIn ? "Check out" : "Check in"}
            </button>
          )}
        </div>

        {/* Right panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl p-6" style={{ background: "var(--surface)" }}>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--ink)" }}>
              <Clock size={16} /> Hours this week
            </h3>
            <p className="text-2xl font-medium tabular-nums" style={{ color: "var(--ink)" }}>0h 0m</p>
            <div className="h-2 rounded-full mt-2" style={{ background: "var(--sunken)" }}>
              <div className="h-full rounded-full" style={{ width: "0%", background: "var(--primary)" }} />
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--ink-3)" }}>of 40 hours</p>
          </div>

          <div className="rounded-xl p-6" style={{ background: "var(--surface)" }}>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--ink)" }}>
              <CalendarDays size={16} /> Leave balance
            </h3>
            <div className="space-y-2 text-sm">
              {[
                { type: "Annual", remaining: 14, quota: 14 },
                { type: "Sick", remaining: 8, quota: 8 },
                { type: "Casual", remaining: 10, quota: 10 },
              ].map((l) => (
                <div key={l.type} className="flex justify-between">
                  <span style={{ color: "var(--ink-2)" }}>{l.type}</span>
                  <span className="tabular-nums font-medium" style={{ color: "var(--ink)" }}>
                    {l.remaining} of {l.quota}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="rounded-xl p-6" style={{ background: "var(--surface)" }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--ink)" }}>Last payslip</h3>
          <EmptyState title="No payslips yet" description="Your payslip appears here after Admin finalizes the month." />
        </div>
        <div className="rounded-xl p-6" style={{ background: "var(--surface)" }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--ink)" }}>Announcements</h3>
          <EmptyState title="No announcements" description="Posts from HR and Admin appear here." />
        </div>
      </div>
    </>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role ?? "Employee";

  if (role === "Admin") return <AdminDashboard />;
  if (role === "HR") return <HRDashboard />;
  return <EmployeeDashboard />;
}

