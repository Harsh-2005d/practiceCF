"use client";

import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

export function Navbar() {
  const { isAuthenticated, isLoading, login, logout } = useAuth();

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-bold text-gray-900 dark:text-gray-100"
        >
          PracticeCF
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            Feed
          </Link>

          {isAuthenticated && (
            <Link
              href="/revise"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Revision
            </Link>
          )}

          {isAuthenticated && (
            <Link
              href="/blogs"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Articles
            </Link>
          )}

          {isAuthenticated && (
            <Link
              href="/profile"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Profile
            </Link>
          )}

          {!isLoading &&
            (!isAuthenticated ? (
              <Button onClick={login}>Sign in with Google</Button>
            ) : (
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            ))}
        </div>
      </div>
    </nav>
  );
}
