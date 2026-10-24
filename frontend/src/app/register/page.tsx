"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "@/app/login/page";

// Register route reuses the unified dual-mode auth experience with mode="signup"
export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // If user explicitly visits /register, redirect or render login page with ?mode=signup
    router.replace("/login?mode=signup");
  }, [router]);

  return <LoginPage />;
}
