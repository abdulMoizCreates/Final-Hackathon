"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/ui/Sidebar";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Search, Calendar, Bell, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, switchRole } = useAuth();
  const [timeStr, setTimeStr] = useState("10:24 AM");
  const [dateStr, setDateStr] = useState("Thu, 24 Oct 2026");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));
      setDateStr(now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-800">
        {/* Left Dark Sidebar */}
        <Sidebar />

        {/* Right Main Body */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar matching Image 1 */}
          <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-6 lg:px-10 py-3.5 flex items-center justify-between shadow-sm">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md hidden sm:block">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search employees, departments... (Ctrl + K)"
                className="w-full pl-10 pr-4 py-2 bg-[#F1F5F9] rounded-xl text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
            </div>

            {/* Right Group: Live Date/Time, Range Filter, Bell, Role Switcher */}
            <div className="flex items-center gap-4 ml-auto">
              {/* Live Clock & Date */}
              <div className="text-right hidden md:block">
                <p className="text-[11px] font-medium text-slate-400 leading-tight">{dateStr}</p>
                <p className="text-sm font-bold text-slate-800 leading-tight tracking-tight">{timeStr}</p>
              </div>

              {/* Date Filter Dropdown */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white shadow-sm text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
                <Calendar size={14} className="text-slate-500" />
                <span>Last 30 Days</span>
                <ChevronDown size={14} className="text-slate-400" />
              </div>

              {/* Notification Bell with Badge */}
              <div className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </div>

              {/* Role Switcher Pill (Fast Evaluation) */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                {(["Admin", "HR", "Employee"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => switchRole(r)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-semibold transition-all ${
                      role === r
                        ? "bg-white text-teal-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {r === "Employee" ? "Staff" : r}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* Main Dashboard Canvas */}
          <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-8 xl:px-10 py-6 sm:py-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
