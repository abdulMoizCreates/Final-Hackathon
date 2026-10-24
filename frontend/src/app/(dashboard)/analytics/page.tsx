"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  BarChart2,
  TrendingUp,
  Users,
  Calendar,
  Sparkles,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  PieChart
} from "lucide-react";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState("30");

  const depts = [
    { name: "Engineering", count: 21, percent: 42, color: "#14B8A6" },
    { name: "Sales", count: 12, percent: 24, color: "#3B82F6" },
    { name: "Marketing", count: 8, percent: 16, color: "#F59E0B" },
    { name: "Human Resources", count: 5, percent: 10, color: "#EC4899" },
    { name: "Finance", count: 4, percent: 8, color: "#8B5CF6" },
  ];

  return (
    <div className="space-y-6">
      {/* ──────────────── Top Header Bar ──────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Workforce Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Data-driven insights into employee retention, punctuality patterns, and organizational distribution.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 bg-white rounded-xl shadow-sm border border-slate-200 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">This Quarter</option>
            <option value="365">Year to Date</option>
          </select>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-sm transition-all"
          >
            <Download size={14} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* ──────────────── KPI Summary Strip ──────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#E6F4F1] p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">Total Headcount</p>
            <span className="flex items-center text-[10px] font-bold text-teal-700 bg-teal-100/80 px-1.5 py-0.5 rounded-md">
              <ArrowUpRight size={12} /> +4.2%
            </span>
          </div>
          <p className="text-2xl font-bold text-teal-900 mt-1.5">50</p>
          <p className="text-[10px] text-teal-700 mt-1">Across 5 active departments</p>
        </div>

        <div className="bg-[#FAF0E6] p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">Attendance Rate</p>
            <span className="flex items-center text-[10px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded-md">
              <ArrowUpRight size={12} /> +1.5%
            </span>
          </div>
          <p className="text-2xl font-bold text-amber-900 mt-1.5">94.2%</p>
          <p className="text-[10px] text-amber-700 mt-1">3.1% unexcused absences</p>
        </div>

        <div className="bg-[#FBE8E8] p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider">Leave Utilization</p>
            <span className="flex items-center text-[10px] font-bold text-rose-700 bg-rose-100/80 px-1.5 py-0.5 rounded-md">
              <ArrowDownRight size={12} /> -0.8%
            </span>
          </div>
          <p className="text-2xl font-bold text-rose-900 mt-1.5">12.8%</p>
          <p className="text-[10px] text-rose-700 mt-1">Average 1.8 days / month</p>
        </div>

        <div className="bg-[#E8F1FB] p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-sky-800 uppercase tracking-wider">Average Salary</p>
            <span className="flex items-center text-[10px] font-bold text-sky-700 bg-sky-100/80 px-1.5 py-0.5 rounded-md">
              Stable
            </span>
          </div>
          <p className="text-2xl font-bold text-sky-900 mt-1.5">Rs. 82.5k</p>
          <p className="text-[10px] text-sky-700 mt-1">Annual payroll: Rs. 49.5M</p>
        </div>
      </div>

      {/* ──────────────── Main Charts Grid ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Area Trend (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Attendance & Punctuality Trends</h3>
              <p className="text-xs text-slate-400">Daily presence and on-time percentages over the period</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-teal-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                Present (94%)
              </span>
              <span className="flex items-center gap-1.5 text-amber-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Late (4%)
              </span>
            </div>
          </div>

          {/* SVG Smooth Curved Area Graph */}
          <div className="h-60 w-full relative pt-4">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#F1F5F9" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#F1F5F9" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#F1F5F9" strokeDasharray="4 4" />
              <line x1="0" y1="190" x2="500" y2="190" stroke="#E2E8F0" />

              {/* Curved Area Fill */}
              <path
                d="M 10 160 Q 70 80, 130 90 T 250 50 T 370 70 T 490 35 L 490 190 L 10 190 Z"
                fill="url(#areaGradient)"
              />

              {/* Curved Stroke */}
              <path
                d="M 10 160 Q 70 80, 130 90 T 250 50 T 370 70 T 490 35"
                fill="none"
                stroke="#0D9488"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Late Check-in baseline curve */}
              <path
                d="M 10 180 Q 70 170, 130 175 T 250 165 T 370 170 T 490 160"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />

              {/* Highlights */}
              <circle cx="250" cy="50" r="5" fill="#0D9488" stroke="#fff" strokeWidth="2.5" />
              <circle cx="490" cy="35" r="5" fill="#0D9488" stroke="#fff" strokeWidth="2.5" />
            </svg>

            {/* Bottom Timeline */}
            <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4 (Current)</span>
            </div>
          </div>
        </div>

        {/* Department Donut Distribution (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Headcount by Department</h3>
            <p className="text-xs text-slate-400">Total staff allocation across business units</p>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            {/* Donut graphic */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#E2E8F0" strokeWidth="4" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#14B8A6" strokeWidth="4" strokeDasharray="42 58" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3B82F6" strokeWidth="4" strokeDasharray="24 76" strokeDashoffset="-42" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#F59E0B" strokeWidth="4" strokeDasharray="16 84" strokeDashoffset="-66" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#EC4899" strokeWidth="4" strokeDasharray="10 90" strokeDashoffset="-82" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#8B5CF6" strokeWidth="4" strokeDasharray="8 92" strokeDashoffset="-92" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold text-slate-800">50</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Staff</span>
              </div>
            </div>

            {/* Department Breakdown List */}
            <div className="w-full space-y-2 mt-4 text-xs">
              {depts.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="font-medium text-slate-700">{d.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">{d.count} staff</span>
                    <span className="font-semibold text-slate-800 w-8 text-right">{d.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────── AI Insights Card ──────────────── */}
      <div className="bg-gradient-to-r from-teal-900 to-[#0F2420] rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300">
              <Sparkles size={16} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              AI HR Executive Summary
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            Attendance punctuality is at an all-time high of <strong className="text-emerald-300">96.2%</strong> following the implementation of flexible 15-minute grace windows. The Engineering department accounted for the lowest unscheduled leave rate (<strong className="text-teal-300">1.2%</strong>) this quarter.
          </p>
        </div>

        <button
          onClick={() => (window.location.href = "/assistant")}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-md whitespace-nowrap transition-all self-start sm:self-auto"
        >
          Ask AI HR Copilot →
        </button>
      </div>
    </div>
  );
}
