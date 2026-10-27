"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getMe, loginWithGoogle, logout as logoutApi } from "../api/auth";
import type { User } from "../types/user";
import { AuthContext, type AuthContextValue } from "./auth-context";
import { queryClient } from "../lib/queryClient";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const previousUserId = useRef<string | undefined>(undefined);

  useEffect(() => {
    const currentUserId = user?.userId;
    if (previousUserId.current && previousUserId.current !== currentUserId) {
      void queryClient.cancelQueries({
        queryKey: ["problem-note", previousUserId.current],
      });
      queryClient.removeQueries({ queryKey: ["problem-note", previousUserId.current] });
      void queryClient.cancelQueries({ queryKey: ["blogs", previousUserId.current] });
      void queryClient.cancelQueries({ queryKey: ["blog", previousUserId.current] });
      queryClient.removeQueries({ queryKey: ["blogs", previousUserId.current] });
      queryClient.removeQueries({ queryKey: ["blog", previousUserId.current] });
    }
    previousUserId.current = currentUserId;
  }, [user?.userId]);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const data = await getMe();
      setUser(data);
      return data;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      void queryClient.cancelQueries({ queryKey: ["problem-note"] });
      queryClient.removeQueries({ queryKey: ["problem-note"] });
      void queryClient.cancelQueries({ queryKey: ["blogs"] });
      void queryClient.cancelQueries({ queryKey: ["blog"] });
      queryClient.removeQueries({ queryKey: ["blogs"] });
      queryClient.removeQueries({ queryKey: ["blog"] });
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      window.location.replace("/");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      hasHandle: Boolean(user?.handle),
      login: loginWithGoogle,
      logout,
      refreshUser,
    }),
    [user, isLoading, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
