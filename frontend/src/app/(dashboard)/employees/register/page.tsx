"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";

export default function RegisterEmployeePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", gender: "",
    employeeCode: "", department: "", designation: "", joinDate: "",
    basicSalary: "",
  });
  const [departments, setDepartments] = useState<{ _id: string; name: string }[]>([]);
  const [designations, setDesignations] = useState<{ _id: string; name: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  useEffect(() => {
    api.get("/departments").then((r) => setDepartments(Array.isArray(r.data) ? r.data : r.data?.departments || [])).catch(() => {});
    api.get("/designations").then((r) => setDesignations(Array.isArray(r.data) ? r.data : r.data?.designations || [])).catch(() => {});
  }, []);

  const gross = form.basicSalary ? Math.round(parseFloat(form.basicSalary) * 1.5) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const r = await api.post("/employees", { ...form, basicSalary: parseFloat(form.basicSalary) });
      setTempPassword(r.data.temporaryPassword || r.data.password || "Check email");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Could not register employee.");
    } finally {
      setSubmitting(false);
    }
  };

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const inputStyle = {
    background: "var(--surface)",
    border: "1px solid var(--line)",
    color: "var(--ink)",
  };

  if (tempPassword) {
    return (
      <>
        <PageHeader title="Employee registered" />
        <div className="max-w-lg rounded-xl p-6" style={{ background: "var(--surface)" }}>
          <p className="text-sm mb-4" style={{ color: "var(--ink-2)" }}>
            Share this temporary password with the employee. They must change it at first sign-in.
          </p>
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "var(--sunken)" }}>
            <code className="text-lg font-mono font-semibold flex-1" style={{ color: "var(--ink)" }}>{tempPassword}</code>
            <button
              onClick={() => navigator.clipboard.writeText(tempPassword)}
              className="text-sm font-medium px-3 py-1.5 rounded"
              style={{ background: "var(--primary)", color: "var(--on-primary)" }}
            >
              Copy
            </button>
          </div>
          <button
            onClick={() => router.push("/employees")}
            className="mt-4 text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            Go to employees
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Register employee" subtitle="Create an employee record and login" />
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        {error && <p className="text-sm" style={{ color: "var(--st-absent-fg)" }}>{error}</p>}

        {/* Personal */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--surface)" }}>
          <h3 className="text-base font-semibold" style={{ color: "var(--ink)" }}>Personal</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>Full name</label>
              <input value={form.name} onChange={(e) => update("name", e.target.value)} required className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>Email</label>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>Phone</label>
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>Gender</label>
              <select value={form.gender} onChange={(e) => update("gender", e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--surface)" }}>
          <h3 className="text-base font-semibold" style={{ color: "var(--ink)" }}>Job</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>Employee code</label>
              <input value={form.employeeCode} onChange={(e) => update("employeeCode", e.target.value)} required className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>Department</label>
              <select value={form.department} onChange={(e) => update("department", e.target.value)} required className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle}>
                <option value="">Select</option>
                {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>Designation</label>
              <select value={form.designation} onChange={(e) => update("designation", e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle}>
                <option value="">Select</option>
                {designations.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>Join date</label>
              <input type="date" value={form.joinDate} onChange={(e) => update("joinDate", e.target.value)} required className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Pay */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--surface)" }}>
          <h3 className="text-base font-semibold" style={{ color: "var(--ink)" }}>Pay</h3>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>Basic salary (PKR)</label>
            <input type="number" value={form.basicSalary} onChange={(e) => update("basicSalary", e.target.value)} required min="1" className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle} />
          </div>
          {gross > 0 && (
            <p className="text-sm" style={{ color: "var(--ink-2)" }}>
              Gross PKR {gross.toLocaleString()}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
          style={{ background: "var(--primary)", color: "var(--on-primary)" }}
        >
          {submitting ? "Registering..." : "Register employee"}
        </button>
      </form>
    </>
  );
}

