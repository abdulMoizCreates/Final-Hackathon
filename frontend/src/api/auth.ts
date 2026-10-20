import api from "@/lib/api";

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface MeResponse {
  user: User;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }).then((r) => r.data),

  register: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/register", { email, password }).then((r) => r.data),

  logout: () => api.post("/auth/logout").then((r) => r.data),

  me: () => api.get<MeResponse>("/auth/me").then((r) => r.data),

  refresh: (refreshToken: string) =>
    api.post<{ accessToken: string }>("/auth/refresh", { refreshToken }).then((r) => r.data),
};
