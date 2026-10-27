import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  active?: boolean;
};

export function Badge({ children, active = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex min-w-5 items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${
        active
          ? "bg-white/20 text-white"
          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
      }`}
    >
      {children}
    </span>
  );
}
