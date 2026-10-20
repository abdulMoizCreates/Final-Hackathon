"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold">Hackathon Starter</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Next.js + Express authentication starter kit
      </p>
      <div className="flex gap-4">
        {user ? (
          <Link
            href="/dashboard"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg border border-gray-300 px-6 py-3 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
