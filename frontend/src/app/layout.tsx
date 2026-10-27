import "../index.css";
import { AuthProvider } from "../context/AuthProvider";
import { Navbar } from "../components/layout/Navbar";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "../context/ThemeProvider";
import { ThemeToggle } from "../components/layout/ThemeToggle";
export const metadata = {
  title: "PracticeCF",
  description: "Practice Codeforces",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const m=localStorage.getItem("practicecf-theme");const q=window.matchMedia("(prefers-color-scheme: dark)").matches;const d=m==="dark"||(m!=="light"&&m!=="dark"&&q);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light"}catch{}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <Navbar />
              <ThemeToggle />
              {children}
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
