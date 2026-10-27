"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeContext, type ThemeMode } from "./theme-context";

const THEME_STORAGE_KEY = "practicecf-theme";

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    try {
      const savedMode = localStorage.getItem(THEME_STORAGE_KEY);
      if (isThemeMode(savedMode)) setModeState(savedMode);
    } catch {
      // Keep the system default if storage is unavailable.
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const useDarkTheme = mode === "dark" || (mode === "system" && media.matches);
      document.documentElement.classList.toggle("dark", useDarkTheme);
      document.documentElement.style.colorScheme = useDarkTheme ? "dark" : "light";
    };

    applyTheme();
    if (mode === "system") {
      media.addEventListener("change", applyTheme);
      return () => media.removeEventListener("change", applyTheme);
    }
  }, [mode]);

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    } catch {
      // The selected theme still applies for this session.
    }
  }, []);

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
