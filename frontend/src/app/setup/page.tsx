"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    companyName: "",
    timezone: "Asia/Karachi",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!form.companyName.trim()) {
        setError("Company name is required.");
        return;
      }
      setError("");
      setStep(2);
      return;
    }

    if (form.adminPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.post("/setup", form);
      router.push("/login");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Could not complete company setup.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "var(--surface)",
    border: "1px solid var(--line)",
    color: "var(--ink)",
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12">
      {/* Brand Hero Left (5 cols on lg) */}
      <div
        className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between"
        style={{ background: "var(--sidebar)", color: "var(--sidebar-ink)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
            <div className="w-4 h-0.5 rounded bg-white relative">
              <div className="absolute w-2 h-2 rounded-full -top-[3px] left-1" style={{ background: "var(--highlight)" }} />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight">HCM Lite</span>
        </div>

        <div className="my-12">
          <h1 className="text-3xl lg:text-4xl font-serif leading-snug">
            Attendance, leave and payroll that agree with each other.
          </h1>
          <p className="mt-4 text-sm max-w-sm" style={{ color: "var(--sidebar-ink-2)" }}>
            Every number on every screen and in every AI answer traces to the exact same record.
          </p>
        </div>

        <p className="text-xs" style={{ color: "var(--sidebar-ink-2)" }}>
          First-Run Setup · Step {step} of 2
        </p>
      </div>

      {/* Form Right (7 cols on lg) */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12" style={{ background: "var(--canvas)" }}>
        <div className="w-full max-w-md space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--primary)" }}>
              Step {step} of 2
            </span>
            <h2 className="text-2xl font-bold mt-1" style={{ color: "var(--ink)" }}>
              {step === 1 ? "Company profile" : "Create Admin account"}
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--ink-2)" }}>
              {step === 1
                ? "Name your organization to initialize the ledger system."
                : "Create the primary administrator login for this organization."}
            </p>
          </div>

          {error && <p className="text-sm" style={{ color: "var(--st-absent-fg)" }}>{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>
                    Company name
                  </label>
                  <input
                    required
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    placeholder="Acme Technologies"
                    className="w-full px-3 py-2.5 rounded-lg text-sm"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>
                    Timezone
                  </label>
                  <select
                    value={form.timezone}
                    onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg text-sm"
                    style={inputStyle}
                  >
                    <option value="Asia/Karachi">Asia/Karachi (PKT, UTC+5)</option>
                    <option value="UTC">UTC</option>
                    <option value="Asia/Dubai">Asia/Dubai (UTC+4)</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>
                    Admin full name
                  </label>
                  <input
                    required
                    value={form.adminName}
                    onChange={(e) => setForm({ ...form, adminName: e.target.value })}
                    placeholder="Muhammad Ali"
                    className="w-full px-3 py-2.5 rounded-lg text-sm"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>
                    Admin email address
                  </label>
                  <input
                    type="email"
                    required
                    value={form.adminEmail}
                    onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                    placeholder="admin@company.com"
                    className="w-full px-3 py-2.5 rounded-lg text-sm"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>
                    Password (minimum 8 characters)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={form.adminPassword}
                    onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 rounded-lg text-sm"
                    style={inputStyle}
                  />
                </div>
              </>
            )}

            <div className="flex items-center justify-between pt-2">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-medium"
                  style={{ color: "var(--ink-2)" }}
                >
                  ← Back to Step 1
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="ml-auto px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                style={{ background: "var(--primary)", color: "var(--on-primary)" }}
              >
                {step === 1 ? "Next: Admin account" : loading ? "Creating..." : "Complete setup"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

