"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/ui/Sidebar";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Search, Calendar, Bell, ChevronDown, Check, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, switchRole } = useAuth();
  const router = useRouter();
  const [timeStr, setTimeStr] = useState("10:24 AM");
  const [dateStr, setDateStr] = useState("Thu, 24 Oct 2026");
  
  // Interactive Controls State
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Leave Request Submitted", desc: "Sara Ahmed requested 1 day Casual Leave", time: "10m ago" },
    { id: 2, title: "Attendance Notice", desc: "3 late arrivals recorded within grace window", time: "45m ago" },
    { id: 3, title: "Payroll Ready", desc: "October payroll draft is ready for review", time: "2h ago" },
  ]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/employees?search=${encodeURIComponent(searchQuery)}`);
  };

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
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md hidden sm:block">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search employees, departments... (Press Enter)"
                className="w-full pl-10 pr-4 py-2 bg-[#F1F5F9] rounded-xl text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
            </form>

            {/* Right Group: Live Date/Time, Range Filter, Bell, Role Switcher */}
            <div className="flex items-center gap-4 ml-auto">
              {/* Live Clock & Date */}
              <div className="text-right hidden md:block">
                <p className="text-[11px] font-medium text-slate-400 leading-tight">{dateStr}</p>
                <p className="text-sm font-bold text-slate-800 leading-tight tracking-tight">{timeStr}</p>
              </div>

              {/* Date Filter Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setDateMenuOpen(!dateMenuOpen);
                    setNotifOpen(false);
                  }}
                  className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white shadow-sm text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <Calendar size={14} className="text-slate-500" />
                  <span>{dateRange}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {dateMenuOpen && (
                  <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in zoom-in-95">
                    {["Today", "Last 7 Days", "Last 30 Days", "This Quarter", "Year to Date"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setDateRange(opt);
                          setDateMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                          dateRange === opt ? "bg-teal-50 text-teal-800 font-bold" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notification Bell with Badge */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                    setDateMenuOpen(false);
                  }}
                  className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                  aria-label="View notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-800">Notifications ({unreadCount})</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => setUnreadCount(0)}
                          className="text-[11px] text-teal-700 font-semibold hover:underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className="py-2.5 space-y-0.5">
                          <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                          <p className="text-[11px] text-slate-500">{n.desc}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Role Switcher Pill (Fast Evaluation) */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                {(["Admin", "HR", "Employee"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => switchRole(r)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-semibold transition-all cursor-pointer ${
                      role === r
                        ? "bg-white text-teal-800 shadow-sm font-bold"
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
