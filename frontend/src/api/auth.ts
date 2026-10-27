import { api } from "./client";
import type { User } from "../types/user";

export async function getMe(): Promise<User> {
  const res = await api.get<User>("/api/auth/me");
  return res.data;
}

export async function logout(): Promise<void> {
  await api.get("/api/auth/logout");
}

export function loginWithGoogle(): void {
  window.location.href = new URL(
    "/api/auth/google",
    process.env.NEXT_PUBLIC_BASE_URL
  ).toString();
}
