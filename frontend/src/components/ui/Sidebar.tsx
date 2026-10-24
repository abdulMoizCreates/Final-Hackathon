"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Clock,
  Briefcase,
  BadgeDollarSign,
  BarChart2,
  Sparkles,
  Megaphone,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X
} from "lucide-react";

export default function Sidebar() {
  const { user, role, switchRole, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  if (!user) return null;

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/employees", label: "Employees", icon: <Users size={18} /> },
    { href: "/attendance", label: "Attendance", icon: <Clock size={18} /> },
    { href: "/leave", label: "Leave", icon: <Briefcase size={18} /> },
    { href: "/payroll", label: "Payroll", icon: <BadgeDollarSign size={18} /> },
    { href: "/analytics", label: "Analytics", icon: <BarChart2 size={18} /> },
    { href: "/assistant", label: "AI Assistant", icon: <Sparkles size={18} /> },
    { href: "/announcements", label: "Announcements", icon: <Megaphone size={18} /> },
    { href: "/organization", label: "Settings", icon: <Settings size={18} /> },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#0B181A] text-slate-200 font-sans select-none">
      {/* Brand Header */}
      <div className="px-6 py-6 flex items-center gap-3">
        {/* Hexagonal Teal Logo from Mockup */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12L21 7M12 12V22M12 12L3 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <span className="text-base font-bold text-white tracking-tight block leading-tight">HCM Lite</span>
          <span className="text-[11px] font-medium text-teal-400 block tracking-wide">AI-Powered HR</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname?.startsWith(item.href + "/") && item.href !== "/dashboard");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#114444] text-white shadow-sm shadow-teal-950 font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={isActive ? "text-teal-300" : "text-slate-400"}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Enterprise Status Badge */}
      <div className="mx-3.5 mb-3 p-3.5 rounded-xl bg-[#102528] border border-teal-900/30">
        <p className="text-xs font-semibold text-white">Enterprise Cloud</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-emerald-400 font-medium">All Systems Operational</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">HCM Lite v2.4 Enterprise</p>
      </div>

      {/* User Profile Bar */}
      <div className="px-3 pb-4 border-t border-slate-800/80 pt-3">
        <div className="relative">
          <div
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white text-xs font-bold ring-2 ring-emerald-500/30 shrink-0">
              {user.name ? user.name[0]?.toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold text-white truncate">{user.name || "Ahmed Khan"}</p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <span>{role}</span>
                <ChevronDown size={12} className="opacity-70" />
              </p>
            </div>
          </div>

          {/* Quick Role Switcher Dropdown */}
          {roleMenuOpen && (
            <div className="absolute bottom-12 left-0 right-0 bg-[#0E2023] border border-slate-700/60 rounded-xl p-1.5 shadow-2xl z-50 space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 px-2 py-1 font-semibold">Switch Role</p>
              {(["Admin", "HR", "Employee"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    role === r ? "bg-teal-900/60 text-teal-300 font-bold" : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {r === "Employee" ? "Employee (Staff)" : r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-1.5 flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-white shadow-md md:hidden text-slate-800 cursor-pointer"
        aria-label="Open Navigation"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-sm cursor-pointer"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 transform transition-transform duration-300 md:hidden shadow-2xl ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white cursor-pointer"
        >
          <X size={20} />
        </button>
        {navContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 min-h-screen sticky top-0 h-screen shadow-xl z-30">
        {navContent}
      </aside>
    </>
  );
}
