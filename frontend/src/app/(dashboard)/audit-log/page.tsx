"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import FilterBar from "@/components/ui/FilterBar";
import { useRouter } from "next/navigation";

export default function AuditLogPage() {
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === "Admin";

  const [logs, setLogs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [selectedLog, setSelectedLog] = useState<Record<string, unknown> | null>(null);

  const fetchLogs = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (actionFilter) params.set("action", actionFilter);
    api.get(`/audit-log?${params.toString()}`)
      .then((r) => setLogs(Array.isArray(r.data) ? r.data : r.data?.logs || []))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [search, actionFilter]);

  if (!isAdmin) {
    return (
      <>
        <PageHeader title="Audit Log" />
        <div className="rounded-xl p-6" style={{ background: "var(--surface)" }}>
          <p style={{ color: "var(--ink-2)" }}>You do not have access to this page.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-3 text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            Go to dashboard
          </button>
        </div>
      </>
    );
  }

  const columns = [
    {
      key: "createdAt",
      label: "When",
      render: (val: unknown) => (
        <span className="text-xs tabular-nums" style={{ color: "var(--ink-3)" }}>
          {val ? new Date(String(val)).toLocaleString("en-GB") : "Just now"}
        </span>
      ),
    },
    {
      key: "actor",
      label: "Actor",
      render: (val: unknown, row: Record<string, unknown>) => (
        <span className="font-medium text-xs" style={{ color: "var(--ink)" }}>
          {String(val || row.actorEmail || "System")}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (val: unknown) => {
        const act = String(val || "").toUpperCase();
        return (
          <span
            className="text-[11px] font-mono px-2 py-0.5 rounded font-medium"
            style={{ background: "var(--sunken)", color: "var(--ink)" }}
          >
            {act}
          </span>
        );
      },
    },
    {
      key: "entity",
      label: "Entity",
      render: (val: unknown, row: Record<string, unknown>) => (
        <span className="text-xs" style={{ color: "var(--ink-2)" }}>
          {String(val || row.entityType || "Record")}
        </span>
      ),
    },
    {
      key: "details",
      label: "",
      align: "right" as const,
      render: (_: unknown, row: Record<string, unknown>) => (
        <button
          onClick={() => setSelectedLog(row)}
          className="text-xs font-medium px-2 py-1 rounded"
          style={{ background: "var(--sunken)", color: "var(--primary)" }}
        >
          View diff
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Audit log"
        subtitle="Immutable record of administrative actions, payroll locks, and approval events"
      />

      <FilterBar
        search={{ value: search, onChange: setSearch, placeholder: "Search by actor or entity..." }}
        filters={[
          {
            label: "Action",
            value: actionFilter,
            onChange: setActionFilter,
            options: [
              { label: "CREATE", value: "CREATE" },
              { label: "UPDATE", value: "UPDATE" },
              { label: "APPROVE", value: "APPROVE" },
              { label: "REJECT", value: "REJECT" },
              { label: "FINALIZE", value: "FINALIZE" },
              { label: "RESET", value: "RESET" },
            ],
          },
        ]}
        onClear={() => { setSearch(""); setActionFilter(""); }}
        hasActiveFilters={!!(search || actionFilter)}
      />

      <DataTable
        columns={columns}
        data={logs}
        loading={loading}
        onRowClick={(row) => setSelectedLog(row)}
        emptyTitle="No activity recorded yet"
        emptyDescription="Approvals, payroll changes and other key actions appear here."
      />

      {/* Before / After JSON Viewer Drawer */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "var(--scrim)" }}>
          <div className="rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto" style={{ background: "var(--surface)" }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold" style={{ color: "var(--ink)" }}>Audit entry details</h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--ink-3)" }}>
                  Action: {String(selectedLog.action)} on {String(selectedLog.entity || selectedLog.entityType)}
                </p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-sm font-semibold p-1 hover:opacity-75"
                style={{ color: "var(--ink)" }}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="font-semibold block text-[11px]" style={{ color: "var(--ink-3)" }}>BEFORE STATE</span>
                <pre className="p-3 rounded-lg overflow-x-auto" style={{ background: "var(--sunken)", color: "var(--ink)" }}>
                  {JSON.stringify(selectedLog.before || selectedLog.previousState || null, null, 2)}
                </pre>
              </div>
              <div className="space-y-1">
                <span className="font-semibold block text-[11px]" style={{ color: "var(--ink-3)" }}>AFTER STATE</span>
                <pre className="p-3 rounded-lg overflow-x-auto" style={{ background: "var(--sunken)", color: "var(--ink)" }}>
                  {JSON.stringify(selectedLog.after || selectedLog.currentState || selectedLog.details || null, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium"
                style={{ background: "var(--primary)", color: "var(--on-primary)" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

