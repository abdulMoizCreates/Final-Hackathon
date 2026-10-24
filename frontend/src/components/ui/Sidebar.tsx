"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  LayoutDashboard, Users, CalendarCheck, CalendarDays, Wallet,
  Building2, UserCog, Megaphone, ScrollText, FileText, Bot,
  Menu, X, LogOut, User,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
  badge?: string;
}

const iconSize = 18;

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
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = user?.role ?? "Employee";

  if (!user) return null;

  const filtered = navItems.filter((item) => item.roles.includes(role));

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
            <div className="w-4 h-0.5 rounded bg-white relative">
              <div className="absolute w-2 h-2 rounded-full -top-[3px] left-1" style={{ background: "var(--highlight)" }} />
            </div>
          </div>
          <span className="text-lg font-semibold" style={{ color: "var(--sidebar-ink)" }}>
            HCM Lite
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {filtered.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
              style={{
                background: isActive ? "var(--sidebar-active)" : "transparent",
                color: isActive ? "var(--sidebar-ink)" : "var(--sidebar-ink-2)",
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="px-3 pb-4 mt-auto" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3 px-3 py-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
            style={{ background: "var(--sidebar-active)", color: "var(--sidebar-ink)" }}
          >
            {(user.name || user.email)?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate" style={{ color: "var(--sidebar-ink)" }}>
              {user.name || user.email}
            </p>
            <p className="text-xs" style={{ color: "var(--sidebar-ink-2)" }}>
              {role}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{ color: "var(--sidebar-ink-2)" }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg md:hidden"
        style={{ background: "var(--surface)", color: "var(--ink)" }}
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "var(--scrim)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 transform transition-transform md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--sidebar)" }}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4"
          style={{ color: "var(--sidebar-ink-2)" }}
        >
          <X size={20} />
        </button>
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden md:block w-64 shrink-0 min-h-screen"
        style={{ background: "var(--sidebar)" }}
      >
        {navContent}
      </aside>
    </>
  );
}
