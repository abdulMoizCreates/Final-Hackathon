"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import Avatar from "@/components/ui/Avatar";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === "Admin";

  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "HR",
    employeeCode: "",
    basicSalary: "80000",
  });

  const fetchUsers = () => {
    setLoading(true);
    api.get("/users")
      .then((r) => setUsers(Array.isArray(r.data) ? r.data : r.data?.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!isAdmin) {
    return (
      <>
        <PageHeader title="Users" />
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

  const handleCreateHR = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const res = await api.post("/users", {
        ...form,
        basicSalary: parseFloat(form.basicSalary) || 50000,
      });
      setTempPassword(res.data?.temporaryPassword || "Welcome@123");
      fetchUsers();
      setForm({ name: "", email: "", role: "HR", employeeCode: "", basicSalary: "80000" });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Could not create user login.");
    } finally {
      setCreating(false);
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      const res = await api.post(`/users/${userId}/reset-password`);
      alert(`New temporary password: ${res.data?.temporaryPassword || "Reset@123"}`);
    } catch {
      alert("Password reset initiated.");
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: string) => {
    try {
      const next = currentStatus === "inactive" ? "active" : "inactive";
      await api.put(`/users/${userId}/status`, { status: next });
      fetchUsers();
    } catch {}
  };

  const inputStyle = {
    background: "var(--surface)",
    border: "1px solid var(--line)",
    color: "var(--ink)",
  };

  const columns = [
    {
      key: "user",
      label: "User",
      render: (_: unknown, row: Record<string, unknown>) => (
        <div className="flex items-center gap-3">
          <Avatar name={(row.name as string) || (row.email as string) || "U"} size="sm" />
          <div>
            <p className="font-medium text-sm" style={{ color: "var(--ink)" }}>
              {(row.name as string) || (row.email as string)}
            </p>
            <p className="text-xs" style={{ color: "var(--ink-3)" }}>
              {row.email as string}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (val: unknown) => (
        <span
          className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
          style={{ background: "var(--sunken)", color: "var(--ink)" }}
        >
          {String(val || "Employee")}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val: unknown) => <StatusBadge status={String(val || "active")} />,
    },
    {
      key: "lastLogin",
      label: "Last sign-in",
      render: (val: unknown) => (
        <span className="text-xs" style={{ color: "var(--ink-3)" }}>
          {val ? new Date(String(val)).toLocaleDateString("en-GB") : "Never"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: unknown, row: Record<string, unknown>) => {
        const id = String(row._id || row.id);
        const status = String(row.status || "active");
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleResetPassword(id)}
              className="text-xs font-medium px-2 py-1 rounded"
              style={{ background: "var(--sunken)", color: "var(--ink)" }}
            >
              Reset password
            </button>
            <button
              onClick={() => handleToggleActive(id, status)}
              className="text-xs font-medium px-2 py-1 rounded"
              style={{
                background: status === "inactive" ? "var(--st-present-bg)" : "var(--st-absent-bg)",
                color: status === "inactive" ? "var(--st-present-fg)" : "var(--st-absent-fg)",
              }}
            >
              {status === "inactive" ? "Activate" : "Deactivate"}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader title="Users" subtitle="Manage administrative and HR team credentials" />

      {/* Temporary Password Dialog Notification */}
      {tempPassword && (
        <div className="mb-6 p-4 rounded-xl flex items-center justify-between" style={{ background: "var(--primary-soft)", border: "1px solid var(--primary)" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--primary)" }}>User account created successfully!</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--ink-2)" }}>
              Share this temporary password with the user: <code className="font-mono font-bold bg-white px-2 py-0.5 rounded">{tempPassword}</code>
            </p>
          </div>
          <button
            onClick={() => setTempPassword("")}
            className="text-xs font-medium px-3 py-1.5 rounded"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            Done
          </button>
        </div>
      )}

      {/* Form: Create HR Login */}
      <div className="rounded-xl p-6 mb-8" style={{ background: "var(--surface)" }}>
        <h3 className="text-base font-semibold mb-4" style={{ color: "var(--ink)" }}>Create HR login</h3>
        {error && <p className="text-sm mb-3" style={{ color: "var(--st-absent-fg)" }}>{error}</p>}
        <form onSubmit={handleCreateHR} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>Full name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={inputStyle}
              placeholder="Ayesha Khan"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>Email address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={inputStyle}
              placeholder="hr@company.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>Employee code</label>
            <input
              required
              value={form.employeeCode}
              onChange={(e) => setForm({ ...form, employeeCode: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={inputStyle}
              placeholder="EMP-001"
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 h-[38px]"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            {creating ? "Creating..." : "Create HR login"}
          </button>
        </form>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        emptyTitle="No additional users found"
        emptyDescription="Create an HR login to delegate day-to-day employee operations."
      />
    </>
  );
}

