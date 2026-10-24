"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";

export default function PayrollPage() {
  const { user } = useAuth();
  const role = user?.role ?? "Employee";
  const [runs, setRuns] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [month, setMonth] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/payroll")
      .then((r) => setRuns(Array.isArray(r.data) ? r.data : r.data?.runs || []))
      .catch(() => setRuns([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!month) return;
    setCreating(true);
    setError("");
    try {
      await api.post("/payroll", { month });
      const r = await api.get("/payroll");
      setRuns(Array.isArray(r.data) ? r.data : r.data?.runs || []);
      setMonth("");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Could not create draft.");
    } finally {
      setCreating(false);
    }
  };

  const handleFinalize = async (id: string) => {
    try {
      await api.put(`/payroll/${id}/finalize`);
      const r = await api.get("/payroll");
      setRuns(Array.isArray(r.data) ? r.data : r.data?.runs || []);
    } catch {}
  };

  const columns = [
    { key: "month", label: "Month" },
    { key: "status", label: "Status", render: (val: unknown) => <StatusBadge status={(val as string) || "draft"} /> },
    { key: "employeeCount", label: "Employees", align: "right" as const },
    { key: "totalNet", label: "Net total", align: "right" as const, render: (val: unknown) => `PKR ${((val as number) || 0).toLocaleString()}` },
    ...(role === "Admin" ? [{
      key: "actions",
      label: "",
      render: (_: unknown, row: Record<string, unknown>) => (row.status === "draft" ? (
        <button
          onClick={(e) => { e.stopPropagation(); handleFinalize((row._id || row.id) as string); }}
          className="px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background: "var(--primary)", color: "var(--on-primary)" }}
        >
          Finalize
        </button>
      ) : null),
    }] : []),
  ];

  return (
    <>
      <PageHeader title="Payroll" subtitle="Monthly payroll runs">
        {role === "HR" && (
          <div className="flex items-center gap-2">
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink)" }}
            />
            <button
              onClick={handleCreate}
              disabled={creating || !month}
              className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              style={{ background: "var(--primary)", color: "var(--on-primary)" }}
            >
              {creating ? "..." : "Create draft"}
            </button>
          </div>
        )}
      </PageHeader>
      {error && <p className="text-sm mb-4" style={{ color: "var(--st-absent-fg)" }}>{error}</p>}
      <DataTable
        columns={columns}
        data={runs}
        loading={loading}
        emptyTitle="No payroll runs"
        emptyDescription="Create a draft for a month once attendance is recorded."
      />
    </>
  );
}

