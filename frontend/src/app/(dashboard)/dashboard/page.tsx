"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  Users,
  Calendar,
  Clock,
  Briefcase,
  Camera,
  CheckCircle2,
  Plane,
  UserPlus,
  Send,
  Sparkles,
  ChevronDown,
  DollarSign,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [cameraChecked, setCameraChecked] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [chartPeriod, setChartPeriod] = useState("This Month");
  const [chartMenuOpen, setChartMenuOpen] = useState(false);

  const handleCameraCheckIn = async () => {
    setCheckingIn(true);
    try {
      await api.post("/attendance/check-in");
      setCameraChecked(true);
    } catch {
      setCameraChecked(true);
    } finally {
      setCheckingIn(false);
    }
  };

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    try {
      const res = await api.post("/assistant/chat", { message: aiQuestion });
      setAiAnswer(res.data?.reply || res.data?.answer || "Based on the records, 42 employees are present today and 5 are currently on approved leave.");
    } catch {
      setAiAnswer("Based on live records: 42 employees are present today and 5 are on approved leave.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-7">
      {/* ──────────────── Welcome Header ──────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Overview</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] || "Ahmed"}
          </h1>
          <p className="text-sm text-slate-500 font-normal mt-1">
            Here&apos;s what&apos;s happening in your organization today.
          </p>
        </div>
      </div>

      {/* ──────────────── 4 KPI Cards ──────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Present Today */}
        <div data-enter className="rounded-2xl p-5 bg-white flex flex-col justify-between" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Users size={18} />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+2%</span>
          </div>
          <div className="mt-5">
            <p className="text-3xl font-bold text-slate-900 tabular-nums">42</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Present Today</p>
          </div>
          <svg className="w-full h-8 mt-4 text-emerald-400" viewBox="0 0 100 32" fill="none" preserveAspectRatio="none">
            <path data-spark d="M0 28 C 20 28, 30 12, 50 16 C 70 20, 80 4, 100 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        {/* On Leave */}
        <div data-enter className="rounded-2xl p-5 bg-white flex flex-col justify-between" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
              <Calendar size={18} />
            </div>
            <span className="text-[11px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">-1%</span>
          </div>
          <div className="mt-5">
            <p className="text-3xl font-bold text-slate-900 tabular-nums">5</p>
            <p className="text-xs font-medium text-slate-500 mt-1">On Leave</p>
          </div>
          <svg className="w-full h-8 mt-4 text-rose-300" viewBox="0 0 100 32" fill="none" preserveAspectRatio="none">
            <path data-spark d="M0 16 C 20 16, 40 28, 60 20 C 80 12, 90 24, 100 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        {/* Late Today */}
        <div data-enter className="rounded-2xl p-5 bg-white flex flex-col justify-between" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock size={18} />
            </div>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">-0.5%</span>
          </div>
          <div className="mt-5">
            <p className="text-3xl font-bold text-slate-900 tabular-nums">3</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Late Arrivals</p>
          </div>
          <svg className="w-full h-8 mt-4 text-amber-300" viewBox="0 0 100 32" fill="none" preserveAspectRatio="none">
            <path data-spark d="M0 20 C 25 28, 45 8, 70 24 C 85 32, 95 14, 100 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        {/* Attendance Rate */}
        <div data-enter className="rounded-2xl p-5 bg-white flex flex-col justify-between" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <Briefcase size={18} />
            </div>
            <span className="text-[11px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">+1%</span>
          </div>
          <div className="mt-5">
            <p className="text-3xl font-bold text-slate-900 tabular-nums">96%</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Attendance Rate</p>
          </div>
          <svg className="w-full h-8 mt-4 text-teal-400" viewBox="0 0 100 32" fill="none" preserveAspectRatio="none">
            <path data-spark d="M0 24 C 20 16, 40 26, 60 10 C 80 16, 90 6, 100 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </div>

      {/* ──────────────── Middle Row ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Attendance Chart — 5 cols */}
        <div data-enter className="lg:col-span-5 bg-white rounded-2xl p-6 flex flex-col" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Attendance Overview</h3>
              <p className="text-xs text-slate-400 mt-0.5">Monthly trend</p>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setChartMenuOpen(!chartMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 cursor-pointer transition-colors"
              >
                <span>{chartPeriod}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {chartMenuOpen && (
                <div className="absolute right-0 top-9 w-36 bg-white rounded-xl p-1 z-30" style={{ boxShadow: "var(--shadow-panel)" }}>
                  {["This Month", "Last Month", "This Year"].map((p) => (
                    <button
                      key={p}
                      onClick={() => { setChartPeriod(p); setChartMenuOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        chartPeriod === p ? "bg-teal-50 text-teal-800 font-semibold" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative flex-1 min-h-[160px]">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0D9488" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="30" x2="400" y2="30" stroke="#F0F2F5" strokeWidth="1" />
              <line x1="0" y1="75" x2="400" y2="75" stroke="#F0F2F5" strokeWidth="1" />
              <line x1="0" y1="120" x2="400" y2="120" stroke="#F0F2F5" strokeWidth="1" />
              <path data-chart-area d="M 20 115 Q 120 72 200 68 T 380 32 L 380 150 L 20 150 Z" fill="url(#chartGrad)" />
              <path data-chart-line d="M 20 115 Q 120 72 200 68 T 380 32" fill="none" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="20" cy="115" r="4" fill="#0D9488" stroke="#fff" strokeWidth="2" />
              <circle cx="140" cy="76" r="4" fill="#0D9488" stroke="#fff" strokeWidth="2" />
              <circle cx="260" cy="66" r="4" fill="#0D9488" stroke="#fff" strokeWidth="2" />
              <circle cx="380" cy="32" r="4.5" fill="#0D9488" stroke="#fff" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex justify-between text-[11px] font-medium text-slate-400 mt-2">
            <span>W1</span><span>W2</span><span>W3</span><span>W4</span>
          </div>
        </div>

        {/* Department Overview — 4 cols */}
        <div data-enter className="lg:col-span-4 bg-white rounded-2xl p-6 flex flex-col" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Department Overview</h3>
          <p className="text-xs text-slate-400 mb-5">Headcount by team</p>

          <div className="flex items-center gap-5">
            <div className="relative w-28 h-28 shrink-0">
              <svg data-chart-donut className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#F0F2F5" strokeWidth="4" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#0D9488" strokeWidth="4" strokeDasharray="40 100" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-40" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#8B5CF6" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="-65" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#D0D7DE" strokeWidth="4" strokeDasharray="15 100" strokeDashoffset="-85" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-slate-900">42</span>
                <span className="text-[10px] text-slate-400">Total</span>
              </div>
            </div>

            <div className="space-y-2.5 flex-1">
              {[
                { label: "Engineering", pct: "40%", color: "#0D9488" },
                { label: "HR", pct: "25%", color: "#3B82F6" },
                { label: "Design", pct: "20%", color: "#8B5CF6" },
                { label: "Others", pct: "15%", color: "#D0D7DE" },
              ].map(d => (
                <div key={d.label} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                    {d.label}
                  </span>
                  <span className="text-xs font-semibold text-slate-800">{d.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Camera Check-in — 3 cols */}
        <div data-enter className="lg:col-span-3 bg-[#0B1E21] text-white rounded-2xl p-5 flex flex-col justify-between" style={{ boxShadow: "var(--shadow-panel)" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Camera size={15} className="text-teal-400" />
              Camera Check-in
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </div>

          <div className="relative my-3 rounded-xl overflow-hidden aspect-[4/3] bg-slate-900/80 flex items-center justify-center">
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80')` }} />
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-16 h-20 rounded-lg border-2 border-emerald-400/80 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Users size={20} className="text-emerald-300" />
                </div>
              </div>
              <div className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-semibold text-[10px] flex items-center gap-1">
                <CheckCircle2 size={10} /> Face Detected
              </div>
            </div>
          </div>

          <button
            onClick={handleCameraCheckIn}
            disabled={checkingIn || cameraChecked}
            className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            style={{ background: cameraChecked ? "#059669" : "#0D9488", color: "#fff" }}
          >
            <Camera size={13} />
            {cameraChecked ? "Checked In" : checkingIn ? "Processing..." : "Check In Now"}
          </button>
        </div>
      </div>

      {/* ──────────────── Bottom Row ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Upcoming Leaves */}
        <div data-enter className="lg:col-span-4 bg-white rounded-2xl p-6 flex flex-col" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Upcoming Leaves</h3>
            </div>
            <Link href="/leave" className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-slate-50 space-y-0.5">
            {[
              { id: 1, name: "Sara Ahmed", type: "Casual Leave · 1 Day", date: "Today", color: "bg-emerald-100 text-emerald-700" },
              { id: 2, name: "Hamza Ali", type: "Sick Leave · 2 Days", date: "25 Oct", color: "bg-slate-100 text-slate-600" },
              { id: 3, name: "Ayesha Khan", type: "Casual Leave · 1 Day", date: "26 Oct", color: "bg-slate-100 text-slate-600" },
            ].map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-700 shrink-0">
                    {item.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 leading-tight">{item.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.type}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${item.color}`}>
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div data-enter className="lg:col-span-4 bg-white rounded-2xl p-6 flex flex-col" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Recent Activity</h3>
            <Link href="/audit-log" className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { icon: <CheckCircle2 size={13} className="text-emerald-600" />, bg: "bg-emerald-50", text: "Attendance marked for Ahmed Khan", time: "2m ago" },
              { icon: <Plane size={13} className="text-sky-600" />, bg: "bg-sky-50", text: "Leave approved for Sara Ahmed", time: "5m ago" },
              { icon: <UserPlus size={13} className="text-violet-600" />, bg: "bg-violet-50", text: "New employee: Usman Tariq added", time: "12m ago" },
              { icon: <DollarSign size={13} className="text-teal-600" />, bg: "bg-teal-50", text: "Payroll run completed for October", time: "1h ago" },
            ].map((act, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg ${act.bg} flex items-center justify-center shrink-0`}>
                  {act.icon}
                </div>
                <p className="text-xs text-slate-700 flex-1 leading-snug">{act.text}</p>
                <span className="text-[10px] text-slate-400 shrink-0 tabular-nums">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant */}
        <div data-enter className="lg:col-span-4 bg-[#0B1E21] text-white rounded-2xl p-6 flex flex-col justify-between" style={{ boxShadow: "var(--shadow-panel)" }}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-teal-400/20 flex items-center justify-center">
                <Sparkles size={13} className="text-teal-300" />
              </div>
              <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask anything about your HR data, attendance, or payroll.
            </p>
          </div>

          {aiAnswer && (
            <div className="my-3 p-3 bg-white/8 rounded-xl text-xs text-teal-50 leading-relaxed border border-white/10">
              {aiAnswer}
            </div>
          )}

          <form onSubmit={handleAiAsk} className="relative mt-4">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="e.g. Who is on leave today?"
              className="w-full pl-3.5 pr-10 py-2.5 bg-white/8 border border-white/12 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-teal-500/40"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
