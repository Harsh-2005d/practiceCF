import type { ReactNode } from "react";

type PageLayoutProps = {
  children: ReactNode;
};

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white dark:bg-black">
      <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
    </main>
  );
}
