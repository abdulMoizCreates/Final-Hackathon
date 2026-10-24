"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/ui/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 xl:px-10 py-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

