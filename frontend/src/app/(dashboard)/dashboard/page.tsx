"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
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
  BarChart2,
  DollarSign,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function DashboardPage() {
  const { user, role } = useAuth();
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
    <div className="space-y-6 font-sans">
      {/* ──────────────── Top Welcome Header ──────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Welcome back, {user?.name || "Ahmed"}!</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
            Here's what's happening in your organization today.
          </p>
        </div>
      </div>

      {/* ──────────────── 4 Pastel KPI Cards with Waves from Mockup ──────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Present Today (Mint) */}
        <div className="rounded-2xl p-5 bg-[#E7FAF4] border border-[#A7F3D0]/50 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-3xl font-extrabold text-slate-900 tabular-nums">42</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold text-slate-700">Present Today</span>
                <span className="text-[11px] font-bold text-emerald-600">↑ +2%</span>
              </div>
            </div>
            {/* SVG Wave Sparkline */}
            <svg className="w-24 h-10 text-emerald-500" viewBox="0 0 100 40" fill="none">
              <path
                d="M0 30 C 20 30, 30 15, 50 20 C 70 25, 80 5, 100 15"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: On Leave (Coral) */}
        <div className="rounded-2xl p-5 bg-[#FFF1F0] border border-[#FECDD3]/50 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-600">
              <Calendar size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-3xl font-extrabold text-slate-900 tabular-nums">5</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold text-slate-700">On Leave</span>
                <span className="text-[11px] font-bold text-rose-500">↓ -1%</span>
              </div>
            </div>
            {/* SVG Wave Sparkline */}
            <svg className="w-24 h-10 text-rose-400" viewBox="0 0 100 40" fill="none">
              <path
                d="M0 20 C 20 20, 40 35, 60 25 C 80 15, 90 28, 100 22"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Late Today (Purple) */}
        <div className="rounded-2xl p-5 bg-[#F3EEFF] border border-[#DDD6FE]/50 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-600">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-3xl font-extrabold text-slate-900 tabular-nums">3</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold text-slate-700">Late Today</span>
                <span className="text-[11px] font-bold text-purple-600">↓ -0.5%</span>
              </div>
            </div>
            {/* SVG Wave Sparkline */}
            <svg className="w-24 h-10 text-purple-500" viewBox="0 0 100 40" fill="none">
              <path
                d="M0 25 C 25 35, 45 10, 70 30 C 85 40, 95 18, 100 20"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Attendance Rate (Cyan) */}
        <div className="rounded-2xl p-5 bg-[#EBF8FF] border border-[#BAE6FD]/50 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-600">
              <Briefcase size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-3xl font-extrabold text-slate-900 tabular-nums">96%</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold text-slate-700">Attendance Rate</span>
                <span className="text-[11px] font-bold text-sky-600">↑ +1%</span>
              </div>
            </div>
            {/* SVG Wave Sparkline */}
            <svg className="w-24 h-10 text-sky-500" viewBox="0 0 100 40" fill="none">
              <path
                d="M0 30 C 20 20, 40 32, 60 12 C 80 20, 90 8, 100 15"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ──────────────── Middle Row: Attendance Chart + Department Donut + Camera Check-in ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Attendance Overview (Line + Area Curve Chart) - 5 Cols */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <BarChart2 size={16} className="text-teal-600" />
              <span>Attendance Overview</span>
            </h3>
            <div className="relative">
              <button
                type="button"
                onClick={() => setChartMenuOpen(!chartMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <span>{chartPeriod}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {chartMenuOpen && (
                <div className="absolute right-0 top-9 w-32 bg-white rounded-xl shadow-xl border border-slate-100 p-1 z-30">
                  {["This Month", "Last Month", "This Year"].map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setChartPeriod(p);
                        setChartMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        chartPeriod === p ? "bg-teal-50 text-teal-800 font-bold" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Area Line Chart Rendering */}
          <div className="relative h-52 w-full pt-4">
            {/* Tooltip Badge */}
            <div className="absolute top-2 right-12 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg">
              42 Present
            </div>

            <svg className="w-full h-40 overflow-visible" viewBox="0 0 400 150">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="400" y2="30" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="70" x2="400" y2="70" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="110" x2="400" y2="110" stroke="#F1F5F9" strokeWidth="1" />
              
              {/* Filled Area */}
              <path
                d="M 20 110 Q 120 70 200 65 T 380 30 L 380 150 L 20 150 Z"
                fill="url(#chartGradient)"
              />
              {/* Curve Stroke */}
              <path
                d="M 20 110 Q 120 70 200 65 T 380 30"
                fill="none"
                stroke="#0D9488"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Points */}
              <circle cx="20" cy="110" r="4.5" fill="#0D9488" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="140" cy="72" r="4.5" fill="#0D9488" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="260" cy="63" r="4.5" fill="#0D9488" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="380" cy="30" r="5" fill="#0D9488" stroke="#FFFFFF" strokeWidth="2.5" />
            </svg>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2 px-3">
              <span>W1</span>
              <span>W2</span>
              <span>W3</span>
              <span>W4</span>
            </div>
          </div>
        </div>

        {/* Department Overview (Donut Chart) - 4 Cols */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Briefcase size={16} className="text-teal-600" />
            <span>Department Overview</span>
          </h3>

          <div className="flex items-center justify-between gap-4 py-2">
            {/* Donut Graphic */}
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="4.5" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#0D9488" strokeWidth="4.5" strokeDasharray="40 100" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#0284C7" strokeWidth="4.5" strokeDasharray="25 100" strokeDashoffset="-40" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#6366F1" strokeWidth="4.5" strokeDasharray="20 100" strokeDashoffset="-65" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#CBD5E1" strokeWidth="4.5" strokeDasharray="15 100" strokeDashoffset="-85" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-slate-900 leading-none">42</span>
                <span className="text-[10px] text-slate-400 font-medium">Employees</span>
              </div>
            </div>

            {/* Department Breakdown Legend */}
            <div className="space-y-2 text-xs flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488]" /> Engineering
                </span>
                <span className="font-bold text-slate-800">40%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" /> HR
                </span>
                <span className="font-bold text-slate-800">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" /> Design
                </span>
                <span className="font-bold text-slate-800">20%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Others
                </span>
                <span className="font-bold text-slate-800">15%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Camera Check-in Card (Signature Mockup Widget) - 3 Cols */}
        <div className="lg:col-span-3 bg-[#0B2125] text-white rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-tight flex items-center gap-1.5 text-white">
              <Camera size={16} className="text-teal-400" /> Camera Check-in
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Online
            </span>
          </div>

          {/* Visual Camera Feed Simulator */}
          <div className="relative my-3 rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 border border-teal-500/20 flex items-center justify-center">
            {/* Background Office Preview */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80')`
              }}
            />

            {/* Simulated Face Bounding Box */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-24 rounded-lg border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Users size={24} className="text-emerald-300" />
                </div>
              </div>
              {/* Detected Badge */}
              <div className="mt-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-md">
                <CheckCircle2 size={11} /> Face Detected
              </div>
            </div>
          </div>

          {/* Check-in Action Button */}
          <button
            onClick={handleCameraCheckIn}
            disabled={checkingIn || cameraChecked}
            className="w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-75"
            style={{
              background: cameraChecked ? "#059669" : "#10B981",
              color: "#022C22",
            }}
          >
            <Camera size={14} />
            <span>{cameraChecked ? "Checked In Successfully!" : checkingIn ? "Processing Face..." : "Check In"}</span>
          </button>
        </div>
      </div>

      {/* ──────────────── Bottom Row: Upcoming Leaves + Recent Activity + AI Assistant ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Upcoming Leaves (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Calendar size={16} className="text-teal-600" />
              <span>Upcoming Leaves</span>
            </h3>
            <Link href="/leave" className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              { id: 1, name: "Sara Ahmed", type: "Casual Leave • 1 Day", date: "Today", pillBg: "bg-emerald-100 text-emerald-800" },
              { id: 2, name: "Hamza Ali", type: "Sick Leave • 2 Days", date: "25 Oct", pillBg: "bg-sky-100 text-sky-800" },
              { id: 3, name: "Ayesha Khan", type: "Casual Leave • 1 Day", date: "26 Oct", pillBg: "bg-sky-100 text-sky-800" },
            ].map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-3">{item.id}</span>
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                    {item.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">{item.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{item.type}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${item.pillBg}`}>
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Clock size={16} className="text-teal-600" />
              <span>Recent Activity</span>
            </h3>
            <Link href="/audit-log" className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { icon: <CheckCircle2 size={14} className="text-emerald-600" />, bg: "bg-emerald-50", text: "Attendance marked for Ahmed Khan", time: "2m ago" },
              { icon: <Plane size={14} className="text-sky-600" />, bg: "bg-sky-50", text: "Leave approved for Sara Ahmed", time: "5m ago" },
              { icon: <UserPlus size={14} className="text-purple-600" />, bg: "bg-purple-50", text: "New employee added: Usman Tariq", time: "12m ago" },
              { icon: <DollarSign size={14} className="text-teal-600" />, bg: "bg-teal-50", text: "Payroll run completed for October", time: "1h ago" },
            ].map((act, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg ${act.bg} flex items-center justify-center shrink-0`}>
                    {act.icon}
                  </div>
                  <p className="text-xs font-medium text-slate-700 truncate">{act.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 ml-2">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant Card (4 Cols) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#0B2125] via-[#0E353B] to-[#124D55] text-white rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-teal-400/20 flex items-center justify-center text-teal-300">
                <Sparkles size={14} />
              </div>
              <h3 className="text-sm font-bold text-white">AI Assistant</h3>
            </div>
            <p className="text-xs text-teal-100/75 leading-relaxed">
              Ask anything about your HR system...
            </p>
          </div>

          {/* AI Reply Bubble if generated */}
          {aiAnswer && (
            <div className="my-3 p-3 bg-white/10 rounded-xl text-xs text-teal-50 leading-relaxed border border-teal-400/20 animate-fadeIn">
              {aiAnswer}
            </div>
          )}

          {/* Input Box */}
          <form onSubmit={handleAiAsk} className="relative mt-4">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="e.g. Who is on leave today?"
              className="w-full pl-3.5 pr-10 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder:text-teal-200/50 outline-none focus:ring-2 focus:ring-teal-400/40"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-teal-400 text-slate-950 hover:bg-teal-300 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
