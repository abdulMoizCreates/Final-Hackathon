"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";
import { useState } from "react";
import {
  LayoutDashboard, Users, CalendarCheck, CalendarDays, Wallet,
  Building2, UserCog, Megaphone, ScrollText, FileText,
  Menu, X, LogOut, ShieldCheck
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

const iconSize = 17;

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={iconSize} />, roles: ["Admin", "HR", "Employee"] },
  { href: "/employees", label: "Employees", icon: <Users size={iconSize} />, roles: ["Admin", "HR"] },
  { href: "/attendance", label: "Attendance", icon: <CalendarCheck size={iconSize} />, roles: ["Admin", "HR", "Employee"] },
  { href: "/leave", label: "Leave", icon: <CalendarDays size={iconSize} />, roles: ["Admin", "HR", "Employee"] },
  { href: "/payroll", label: "Payroll", icon: <Wallet size={iconSize} />, roles: ["Admin", "HR"] },
  { href: "/payslips", label: "Payslips", icon: <FileText size={iconSize} />, roles: ["Employee"] },
  { href: "/organization", label: "Organization", icon: <Building2 size={iconSize} />, roles: ["Admin", "HR"] },
  { href: "/users", label: "Users", icon: <UserCog size={iconSize} />, roles: ["Admin"] },
  { href: "/announcements", label: "Announcements", icon: <Megaphone size={iconSize} />, roles: ["Admin", "HR", "Employee"] },
  { href: "/audit-log", label: "Audit log", icon: <ScrollText size={iconSize} />, roles: ["Admin"] },
];

export default function Sidebar() {
  const { user, role, switchRole, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const filtered = navItems.filter((item) => item.roles.includes(role));

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navContent = (
    <div className="flex flex-col h-full font-sans">
      {/* Brand Header */}
      <div className="px-6 py-6 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm"
            style={{ background: "#0F4C45" }}
          >
            <div className="w-4 h-0.5 rounded bg-white relative">
              <div
                className="absolute w-2 h-2 rounded-full -top-[3px] left-1"
                style={{ background: "#F2B01E" }}
              />
            </div>
          </div>
          <div>
            <span className="text-base font-bold tracking-tight block leading-tight" style={{ color: "var(--sidebar-ink)" }}>
              HCM Lite
            </span>
            <span className="text-[10px] tracking-wider uppercase opacity-60 font-mono block" style={{ color: "var(--sidebar-ink)" }}>
              Enterprise HR
            </span>
          </div>
        </Link>
      </div>

      {/* Role Switcher Pill Bar (Functional RBAC) */}
      <div className="px-4 mb-4">
        <div className="p-1 rounded-xl shadow-soft" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between px-2 py-1 text-[10px] uppercase font-semibold tracking-wider opacity-60" style={{ color: "var(--sidebar-ink)" }}>
            <span className="flex items-center gap-1"><ShieldCheck size={12} /> Active Role</span>
            <span className="font-mono">{role}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 pt-1">
            {(["Admin", "HR", "Employee"] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => switchRole(r)}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                  role === r
                    ? "font-semibold shadow-sm"
                    : "opacity-60 hover:opacity-100"
                }`}
                style={{
                  background: role === r ? "#183731" : "transparent",
                  color: role === r ? "#FFFFFF" : "var(--sidebar-ink-2)",
                }}
              >
                {r === "Employee" ? "Staff" : r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Nav Items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {filtered.map((item) => {
          const isActive = pathname === item.href || (pathname?.startsWith(item.href + "/") && item.href !== "/dashboard");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive ? "shadow-sm font-semibold" : "hover:bg-white/5"
              }`}
              style={{
                background: isActive ? "var(--sidebar-active)" : "transparent",
                color: isActive ? "#FFFFFF" : "var(--sidebar-ink-2)",
              }}
            >
              <span className={isActive ? "text-[#38B298]" : "opacity-75"}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-3 mx-3 mb-4 rounded-xl shadow-soft" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
            style={{ background: "#183731", color: "#38B298" }}
          >
            {(user.name || user.email)?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate capitalize" style={{ color: "var(--sidebar-ink)" }}>
              {user.name || user.email?.split("@")[0]}
            </p>
            <p className="text-[10px] truncate" style={{ color: "var(--sidebar-ink-2)" }}>
              {role} Account
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: "var(--sidebar-ink-2)" }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 p-2.5 rounded-xl shadow-card md:hidden"
        style={{ background: "var(--surface)", color: "var(--ink)" }}
        aria-label="Open Navigation"
      >
        <Menu size={18} />
      </button>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden backdrop-blur-sm transition-opacity"
          style={{ background: "var(--scrim)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 transform transition-transform duration-300 md:hidden shadow-elevation ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--sidebar)" }}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-lg"
          style={{ color: "var(--sidebar-ink-2)" }}
        >
          <X size={18} />
        </button>
        {navContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className="hidden md:block w-64 shrink-0 min-h-screen sticky top-0 h-screen shadow-panel"
        style={{ background: "var(--sidebar)" }}
      >
        {navContent}
      </aside>
    </>
  );
}
