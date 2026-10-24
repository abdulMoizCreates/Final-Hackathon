"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/ui/Sidebar";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Shield, Sparkles } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, switchRole } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen font-sans" style={{ background: "var(--canvas)" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Quick-Bar */}
          <header className="sticky top-0 z-30 px-6 lg:px-10 py-3.5 flex items-center justify-between shadow-soft backdrop-blur-md" style={{ background: "rgba(255, 255, 255, 0.85)" }}>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                <Shield size={13} /> Role Scope: {role}
              </span>
              <span className="text-xs text-gray-500 hidden md:inline">
                {role === "Admin" && "Full administrative control & audit authority"}
                {role === "HR" && "Employee management & operations view"}
                {role === "Employee" && "Personal self-service workspace"}
              </span>
            </div>

            {/* Live Role Switcher (functional testing during evaluations) */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-gray-400 hidden sm:inline">Switch Role:</span>
              <div className="flex items-center p-0.5 rounded-lg shadow-soft" style={{ background: "var(--sunken)" }}>
                {(["Admin", "HR", "Employee"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => switchRole(r)}
                    className={`px-2.5 py-1 text-[11px] rounded-md font-medium transition-all ${
                      role === r
                        ? "shadow-sm font-semibold"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    style={{
                      background: role === r ? "var(--surface)" : "transparent",
                      color: role === r ? "var(--ink)" : "var(--ink-3)",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 max-w-[1250px] w-full mx-auto px-4 sm:px-8 xl:px-10 py-6 sm:py-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
