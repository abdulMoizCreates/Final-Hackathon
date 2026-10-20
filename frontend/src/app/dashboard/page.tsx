"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <p className="text-lg">
            Welcome, <span className="font-semibold">{user?.email}</span>
          </p>
          <p className="mt-2 text-sm text-gray-500">User ID: {user?.id}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-6 py-2 text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </ProtectedRoute>
  );
}
