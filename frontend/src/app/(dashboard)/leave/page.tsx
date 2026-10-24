"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import Avatar from "@/components/ui/Avatar";

function EmployeeLeave() {
  const [balance, setBalance] = useState<{ type: string; remaining: number; quota: number }[]>([]);
  const [history, setHistory] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ type: "", startDate: "", endDate: "", reason: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [smartInput, setSmartInput] = useState("");
  const [fillingForm, setFillingForm] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/leave/balance").then((r) => setBalance(Array.isArray(r.data) ? r.data : r.data?.balance || [
        { type: "Annual", remaining: 14, quota: 14 },
        { type: "Sick", remaining: 8, quota: 8 },
        { type: "Casual", remaining: 10, quota: 10 },
      ])).catch(() => setBalance([
        { type: "Annual", remaining: 14, quota: 14 },
        { type: "Sick", remaining: 8, quota: 8 },
        { type: "Casual", remaining: 10, quota: 10 },
      ])),
      api.get("/leave/my").then((r) => setHistory(Array.isArray(r.data) ? r.data : r.data?.requests || [])).catch(() => setHistory([])),
    ]).finally(() => setLoading(false));
  }, []);

  const handleSmartLeave = async () => {
    if (!smartInput.trim()) return;
    setFillingForm(true);
    try {
      const r = await api.post("/ai/smart-leave", { text: smartInput });
      const { type, startDate, endDate, reason } = r.data;
      setForm({ type: type || "", startDate: startDate || "", endDate: endDate || "", reason: reason || smartInput });
      setSuccess("Filled from your sentence. Check the dates, then send.");
    } catch {
      setError("The assistant is unavailable. Fill the form manually.");
    } finally {
      setFillingForm(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/leave", form);
      setSuccess("Leave request sent.");
      setForm({ type: "", startDate: "", endDate: "", reason: "" });
      const r = await api.get("/leave/my");
      setHistory(Array.isArray(r.data) ? r.data : r.data?.requests || []);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Could not send request.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = { background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink)" };

  const columns = [
    { key: "type", label: "Type" },
    { key: "startDate", label: "Start" },
    { key: "endDate", label: "End" },
    { key: "days", label: "Days", align: "right" as const },
    { key: "status", label: "Status", render: (val: unknown) => <StatusBadge status={(val as string) || "pending"} /> },
    { key: "reason", label: "Reason" },
  ];

  return (
    <>
      <PageHeader title="Leave" subtitle="Your leave balance and requests" />

      {/* Balance strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {balance.map((b) => (
          <div key={b.type} className="rounded-xl p-4" style={{ background: "var(--surface)" }}>
            <p className="text-xs font-medium" style={{ color: "var(--ink-3)" }}>{b.type}</p>
            <p className="text-2xl font-medium tabular-nums mt-1" style={{ color: "var(--ink)" }}>
              {b.remaining} <span className="text-sm font-normal" style={{ color: "var(--ink-3)" }}>of {b.quota}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Smart leave */}
      <div className="rounded-xl p-6 mb-6" style={{ background: "var(--surface)" }}>
        <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>Describe your leave</label>
        <div className="flex gap-2">
          <input
            value={smartInput}
            onChange={(e) => setSmartInput(e.target.value)}
            placeholder="For example: next Monday and Tuesday off for my sister's wedding"
            className="flex-1 px-3 py-2 rounded-lg text-sm"
            style={inputStyle}
          />
          <button
            onClick={handleSmartLeave}
            disabled={fillingForm}
            className="px-4 py-2 rounded-lg text-sm font-medium shrink-0"
            style={{ background: "var(--sunken)", color: "var(--ink)" }}
          >
            {fillingForm ? "..." : "Fill form"}
          </button>
        </div>
      </div>

      {/* Apply form */}
      <form onSubmit={handleSubmit} className="rounded-xl p-6 mb-6 space-y-4" style={{ background: "var(--surface)" }}>
        <h3 className="text-base font-semibold" style={{ color: "var(--ink)" }}>Apply for leave</h3>
        {error && <p className="text-sm" style={{ color: "var(--st-absent-fg)" }}>{error}</p>}
        {success && <p className="text-sm" style={{ color: "var(--st-present-fg)" }}>{success}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle}>
              <option value="">Select type</option>
              <option value="Annual">Annual</option>
              <option value="Sick">Sick</option>
              <option value="Casual">Casual</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          <div />
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>Start date</label>
            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>End date</label>
            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>Reason</label>
          <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required rows={3} className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={inputStyle} />
        </div>
        <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50" style={{ background: "var(--primary)", color: "var(--on-primary)" }}>
          {submitting ? "Sending..." : "Send request"}
        </button>
      </form>

      <h3 className="text-base font-semibold mb-3" style={{ color: "var(--ink)" }}>History</h3>
      <DataTable
        columns={columns}
        data={history}
        loading={loading}
        emptyTitle="No leave requests"
        emptyDescription="Requests you send appear here with their status."
      />
    </>
  );
}

function LeaveApprovals() {
  const [requests, setRequests] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [comment, setComment] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = () => {
    setLoading(true);
    api.get(`/leave?status=${filter}`)
      .then((r) => setRequests(Array.isArray(r.data) ? r.data : r.data?.requests || []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRequests(); }, [filter]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    if (action === "reject" && !comment.trim()) return;
    setActionLoading(true);
    try {
      await api.put(`/leave/${id}/${action}`, { comment });
      setComment("");
      setSelected(null);
      fetchRequests();
    } catch {
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      key: "employee",
      label: "Employee",
      render: (_: unknown, row: Record<string, unknown>) => (
        <div className="flex items-center gap-2">
          <Avatar name={(row.employeeName as string) || "?"} size="sm" />
          <span className="font-medium">{row.employeeName as string}</span>
        </div>
      ),
    },
    { key: "type", label: "Type" },
    { key: "startDate", label: "Start" },
    { key: "endDate", label: "End" },
    { key: "days", label: "Days", align: "right" as const },
    { key: "status", label: "Status", render: (val: unknown) => <StatusBadge status={(val as string) || "pending"} /> },
  ];

  return (
    <>
      <PageHeader title="Leave" subtitle="Approval inbox" />

      <div className="flex gap-1 p-1 rounded-lg mb-6 w-fit" style={{ background: "var(--sunken)" }}>
        {["pending", "approved", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors"
            style={{
              background: filter === s ? "var(--surface)" : "transparent",
              color: filter === s ? "var(--ink)" : "var(--ink-3)",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <DataTable
            columns={columns}
            data={requests}
            loading={loading}
            onRowClick={(row) => setSelected((row._id || row.id) as string)}
            emptyTitle="Nothing waiting for approval"
            emptyDescription="New leave requests appear here."
          />
        </div>
        {selected && (
          <div className="lg:col-span-5">
            <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--surface)" }}>
              {(() => {
                const req = requests.find((r) => (r._id || r.id) === selected);
                if (!req) return <p style={{ color: "var(--ink-3)" }}>Select a request.</p>;
                return (
                  <>
                    <h3 className="font-semibold" style={{ color: "var(--ink)" }}>{req.employeeName as string}</h3>
                    <div className="text-sm space-y-1" style={{ color: "var(--ink-2)" }}>
                      <p>{req.type as string} · {req.days as number} days</p>
                      <p>{req.startDate as string} to {req.endDate as string}</p>
                      <p className="mt-2">{req.reason as string}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>Comment</label>
                      <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink)" }} />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAction(selected, "approve")}
                        disabled={actionLoading}
                        className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                        style={{ background: "var(--primary)", color: "var(--on-primary)" }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(selected, "reject")}
                        disabled={actionLoading || !comment.trim()}
                        className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                        style={{ background: "var(--sunken)", color: "var(--ink)" }}
                      >
                        Reject
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function LeavePage() {
  const { user } = useAuth();
  const role = user?.role ?? "Employee";
  if (role === "Employee") return <EmployeeLeave />;
  return <LeaveApprovals />;
}

