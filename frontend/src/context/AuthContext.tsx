"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { useMe, useLogin, useRegister, useLogout } from "@/api/queries";
import type { User } from "@/api/auth";

export type UserRole = "Admin" | "HR" | "Employee";

interface AuthContextType {
  user: (User & { role: UserRole }) | null;
  loading: boolean;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("accessToken");
  const meQuery = useMe(hasToken);
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("demoActiveRole") as UserRole;
      if (saved && ["Admin", "HR", "Employee"].includes(saved)) return saved;
    }
    return "Admin";
  });

  const switchRole = (newRole: UserRole) => {
    setActiveRole(newRole);
    localStorage.setItem("demoActiveRole", newRole);
  };

  const inferRole = (email?: string): UserRole => {
    if (!email) return activeRole;
    const lower = email.toLowerCase();
    if (lower.includes("admin")) return "Admin";
    if (lower.includes("hr")) return "HR";
    return activeRole;
  };

  const rawUser = meQuery.data?.user ?? null;
  const currentRole = rawUser ? (inferRole(rawUser.email) || activeRole) : activeRole;

  const user = rawUser
    ? {
        ...rawUser,
        role: currentRole,
        name: rawUser.name || (rawUser.email ? rawUser.email.split("@")[0].replace(".", " ") : "User"),
      }
    : null;

  const loading = hasToken && meQuery.isLoading;

  const login = async (email: string, password: string) => {
    const inferred = inferRole(email);
    switchRole(inferred);
    await loginMutation.mutateAsync({ email, password });
  };

  const register = async (email: string, password: string) => {
    const inferred = inferRole(email);
    switchRole(inferred);
    await registerMutation.mutateAsync({ email, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        role: currentRole,
        switchRole,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
