"use client";

import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import type { ThemeMode } from "../../context/theme-context";

const modes: { value: ThemeMode; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 left-5 z-[100]">
      {isOpen && (
        <div
          role="group"
          aria-label="Color theme"
          className="absolute bottom-full left-0 mb-2 min-w-36 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-950"
        >
          {modes.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={mode === option.value}
              onClick={() => {
                setMode(option.value);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${mode === option.value ? "bg-gray-100 font-medium text-gray-950 dark:bg-gray-800 dark:text-white" : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900"}`}
            >
              {option.label}
              {mode === option.value && <span aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        aria-label={`Theme mode: ${mode}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Change theme"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-900 shadow-lg transition hover:scale-105 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900 dark:focus-visible:outline-gray-100"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18a9 9 0 0 0 0-18Z" fill="currentColor" stroke="none" />
        </svg>
      </button>
    </div>
  );
}
