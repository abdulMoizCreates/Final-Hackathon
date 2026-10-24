"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import ErrorState from "@/components/ui/ErrorState";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const role = user?.role ?? "Employee";
  const [employee, setEmployee] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    api.get(`/employees/${id}`)
      .then((r) => setEmployee(r.data))
      .catch(() => setError("Could not load employee details."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="space-y-4"><SkeletonCard /><SkeletonCard /></div>;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!employee) return <ErrorState message="Employee not found." />;

  const tabs = ["Overview", "Attendance", "Leave", "Payroll"];

  return (
    <>
      <PageHeader
        title={(employee.name as string) || "Employee"}
        subtitle={`${employee.employeeCode || ""} · ${employee.department || ""}`}
      >
        <StatusBadge status={(employee.status as string) || "active"} />
      </PageHeader>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg mb-6 w-fit" style={{ background: "var(--sunken)" }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t.toLowerCase())}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            style={{
              background: tab === t.toLowerCase() ? "var(--surface)" : "transparent",
              color: tab === t.toLowerCase() ? "var(--ink)" : "var(--ink-3)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl p-6" style={{ background: "var(--surface)" }}>
            <h3 className="text-base font-semibold mb-4" style={{ color: "var(--ink)" }}>Personal</h3>
            <dl className="space-y-3 text-sm">
              {[
                ["Name", employee.name],
                ["Email", employee.email],
                ["Phone", employee.phone],
                ["Gender", employee.gender],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between">
                  <dt style={{ color: "var(--ink-3)" }}>{label as string}</dt>
                  <dd style={{ color: "var(--ink)" }}>{(value as string) || "—"}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-xl p-6" style={{ background: "var(--surface)" }}>
            <h3 className="text-base font-semibold mb-4" style={{ color: "var(--ink)" }}>Job</h3>
            <dl className="space-y-3 text-sm">
              {[
                ["Code", employee.employeeCode],
                ["Department", employee.department],
                ["Designation", employee.designation],
                ["Join date", employee.joinDate],
                ["Status", employee.status],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between">
                  <dt style={{ color: "var(--ink-3)" }}>{label as string}</dt>
                  <dd style={{ color: "var(--ink)" }}>{(value as string) || "—"}</dd>
                </div>
              ))}
            </dl>
          </div>
          {role !== "Employee" && (
            <div className="rounded-xl p-6" style={{ background: "var(--surface)" }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: "var(--ink)" }}>Pay</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt style={{ color: "var(--ink-3)" }}>Basic salary</dt>
                  <dd className="tabular-nums font-medium" style={{ color: "var(--ink)" }}>
                    PKR {((employee.basicSalary as number) || 0).toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt style={{ color: "var(--ink-3)" }}>Gross salary</dt>
                  <dd className="tabular-nums font-medium" style={{ color: "var(--ink)" }}>
                    PKR {(((employee.basicSalary as number) || 0) * 1.5).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      )}

      {tab !== "overview" && (
        <div className="rounded-xl p-6" style={{ background: "var(--surface)" }}>
          <p className="text-sm" style={{ color: "var(--ink-3)" }}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)} records will appear here.
          </p>
        </div>
      )}
    </>
  );
}

