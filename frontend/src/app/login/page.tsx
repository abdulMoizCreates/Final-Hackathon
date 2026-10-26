"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth, UserRole } from "@/context/AuthContext";
import DayRail from "@/components/ui/DayRail";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, switchRole } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">(() =>
    searchParams?.get("mode") === "signup" ? "signup" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDemoFill = (roleChoice: UserRole, demoEmail: string) => {
    switchRole(roleChoice);
    setEmail(demoEmail);
    setPassword("Password@123");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
        router.push("/dashboard");
      } else {
        if (password.length < 6) {
          setError("Password must be at least 6 characters.");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }
        await register(email, password);
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      if (mode === "login") {
        setError(axiosErr.response?.data?.message || "Email or password is incorrect.");
      } else {
        setError(axiosErr.response?.data?.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score += 1;
    return score;
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 font-sans" style={{ background: "var(--canvas)" }}>
      {/* ──────────────── Left Showcase Panel (Spruce Brand Identity) ──────────────── */}
      <div
        data-enter
        className="lg:col-span-5 p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden"
        style={{
          background: "linear-gradient(175deg, #091A17 0%, #0F2420 50%, #153831 100%)",
          color: "var(--sidebar-ink)",
        }}
      >
        <div
          className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full pointer-events-none opacity-10"
          style={{ background: "radial-gradient(circle, #3FB59B 0%, transparent 70%)" }}
        />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-soft"
              style={{ background: "#0F4C45" }}
            >
              <div className="w-5 h-0.5 rounded bg-white relative">
                <div
                  className="absolute w-2 h-2 rounded-full -top-[3px] left-1"
                  style={{ background: "#F2B01E" }}
                />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight block leading-none">HCM Lite</span>
              <span className="text-[10px] tracking-wider uppercase opacity-70 font-mono">Ledger System</span>
            </div>
          </Link>
        </div>

        {/* Central Narrative & Signature DayRail Showcase */}
        <div className="my-10 lg:my-14 space-y-8 relative z-10">
          <div>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 shadow-soft"
              style={{ background: "rgba(255,255,255,0.08)", color: "#7DB5EA" }}
            >
              <ShieldCheck size={14} /> Immutable Ledger Architecture
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight">
              Attendance, leave and payroll that agree with each other.
            </h1>
            <p className="mt-4 text-sm leading-relaxed max-w-md" style={{ color: "var(--sidebar-ink-2)" }}>
              Every calculation traces directly back to daily biometric records. Zero manual reconciliation, automated tax slabs, and scoped Gemini AI.
            </p>
          </div>

          {/* Live DayRail Signature Card */}
          <div
            className="p-5 rounded-2xl space-y-3 shadow-panel backdrop-blur-sm"
            style={{
              background: "rgba(18, 48, 42, 0.75)",
            }}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-[11px]" style={{ color: "#DCE8E4" }}>
                Workday Status
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-soft"
                style={{ background: "#17694B", color: "#FFFFFF" }}
              >
                Present · 09:07 AM
              </span>
            </div>
            <DayRail
              checkInAt="09:07"
              checkOutAt="18:02"
              status="present"
              size="lg"
            />
            <div className="flex items-center justify-between text-[11px] pt-1" style={{ color: "var(--sidebar-ink-2)" }}>
              <span>Office: 09:00 AM</span>
              <span>Grace: 15 min</span>
              <span>Half day: 5h</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs" style={{ color: "var(--sidebar-ink-2)" }}>
          <span>HCM Lite — Enterprise Edition</span>
          <span className="font-mono text-[11px]">v1.0.0</span>
        </div>
      </div>

      {/* ──────────────── Right Form Panel ──────────────── */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div
          data-enter
          className="w-full max-w-md rounded-2xl p-8 sm:p-10 shadow-card space-y-6"
          style={{ background: "var(--surface)" }}
        >
          {/* Header & Mode Switcher */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--ink)" }}>
                {mode === "login" ? "Sign in to workspace" : "Create employee account"}
              </h2>
              <p className="text-xs mt-1" style={{ color: "var(--ink-2)" }}>
                {mode === "login"
                  ? "Enter your registered credentials to access your ledger"
                  : "Fill in your details to create your access account"}
              </p>
            </div>

            {/* Segmented Pill Tab Toggle */}
            <div className="grid grid-cols-2 p-1 rounded-xl shadow-soft" style={{ background: "var(--sunken)" }}>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === "login" ? "shadow-card font-bold" : ""
                }`}
                style={{
                  background: mode === "login" ? "var(--surface)" : "transparent",
                  color: mode === "login" ? "var(--ink)" : "var(--ink-3)",
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === "signup" ? "shadow-card font-bold" : ""
                }`}
                style={{
                  background: mode === "signup" ? "var(--surface)" : "transparent",
                  color: mode === "signup" ? "var(--ink)" : "var(--ink-3)",
                }}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              className="p-3.5 rounded-xl text-xs flex items-center gap-2.5 shadow-soft"
              style={{ background: "var(--st-absent-bg)", color: "var(--st-absent-fg)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--st-absent-fg)" }} />
              <p className="flex-1 font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold" style={{ color: "var(--ink-3)" }}>
                  Full name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "var(--ink-3)" }}
                  />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Muhammad Bilal"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none shadow-soft transition-all focus:bg-white"
                    style={{
                      background: "var(--sunken)",
                      color: "var(--ink)",
                    }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-semibold" style={{ color: "var(--ink-3)" }}>
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--ink-3)" }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm outline-none shadow-soft transition-all focus:bg-white"
                  style={{
                    background: "var(--sunken)",
                    color: "var(--ink)",
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold" style={{ color: "var(--ink-3)" }}>
                  Password
                </label>
                {mode === "login" && (
                  <span className="text-[11px]" style={{ color: "var(--ink-3)" }}>
                    Ask HR if forgotten
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--ink-3)" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={mode === "signup" ? 6 : undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none shadow-soft transition-all focus:bg-white"
                  style={{
                    background: "var(--sunken)",
                    color: "var(--ink)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {mode === "signup" && password && (
                <div className="space-y-1 pt-1">
                  <div className="grid grid-cols-3 gap-1.5 h-1">
                    <div
                      className="rounded-full transition-colors"
                      style={{ background: strength >= 1 ? "var(--st-late-fg)" : "#CBD5E1" }}
                    />
                    <div
                      className="rounded-full transition-colors"
                      style={{ background: strength >= 2 ? "var(--st-present-fg)" : "#CBD5E1" }}
                    />
                    <div
                      className="rounded-full transition-colors"
                      style={{ background: strength >= 3 ? "var(--primary)" : "#CBD5E1" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {mode === "signup" && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold" style={{ color: "var(--ink-3)" }}>
                  Confirm password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "var(--ink-3)" }}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none shadow-soft transition-all focus:bg-white"
                    style={{
                      background: "var(--sunken)",
                      color: "var(--ink)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-soft active:scale-[0.99] cursor-pointer"
              style={{
                background: "var(--primary)",
                color: "var(--on-primary)",
              }}
            >
              {loading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>{mode === "login" ? "Sign in to account" : "Create account"}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Quick-Fill for Evaluators / Hackathon Judges */}
          {mode === "login" && (
            <div className="pt-3 space-y-2.5">
              <span className="text-[11px] font-semibold block uppercase tracking-wider" style={{ color: "var(--ink-3)" }}>
                Quick Test Credentials (Auto-Roles)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoFill("Admin", "admin@company.com")}
                  className="px-2.5 py-2 rounded-xl text-xs font-semibold shadow-soft text-center transition-all hover:scale-[1.02]"
                  style={{ background: "var(--sunken)", color: "var(--ink)" }}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill("HR", "hr@company.com")}
                  className="px-2.5 py-2 rounded-xl text-xs font-semibold shadow-soft text-center transition-all hover:scale-[1.02]"
                  style={{ background: "var(--sunken)", color: "var(--ink)" }}
                >
                  HR Ops
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill("Employee", "employee@company.com")}
                  className="px-2.5 py-2 rounded-xl text-xs font-semibold shadow-soft text-center transition-all hover:scale-[1.02]"
                  style={{ background: "var(--sunken)", color: "var(--ink)" }}
                >
                  Employee
                </button>
              </div>
            </div>
          )}

          <div className="text-center pt-2">
            <p className="text-xs" style={{ color: "var(--ink-2)" }}>
              Need to initialize a brand new company?{" "}
              <Link href="/setup" className="font-semibold underline hover:opacity-80" style={{ color: "var(--primary)" }}>
                First-run setup wizard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm font-sans">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
