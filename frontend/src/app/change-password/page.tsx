"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Could not change password.");
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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--canvas)" }}>
      <div className="w-full max-w-md p-8 rounded-2xl shadow-sm space-y-6" style={{ background: "var(--surface)" }}>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--ink)" }}>Choose a new password</h2>
          <p className="text-xs mt-1" style={{ color: "var(--ink-2)" }}>
            You signed in with a temporary password. Set your own to continue.
          </p>
        </div>

        {error && <p className="text-xs" style={{ color: "var(--st-absent-fg)" }}>{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>
              Current temporary password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>
              New password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>
              Confirm new password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 mt-2"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            {loading ? "Saving..." : "Save password"}
          </button>
        </form>
      </div>
    </div>
  );
}

