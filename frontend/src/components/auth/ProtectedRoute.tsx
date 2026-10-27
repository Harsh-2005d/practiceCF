import { useEffect } from "react";
import { useRouter } from "next/navigation";

function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);
  return null;
}

import { useAuth } from "../../hooks/useAuth";
import { PageSkeleton } from "../ui/Skeleton";
import { EmptyState } from "../ui/EmptyState";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireHandle?: boolean;
  redirectIfHasHandle?: boolean;
};

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireHandle = false,
  redirectIfHasHandle = false,
}: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, hasHandle, login } = useAuth();

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16">
        <EmptyState
          title="Sign in required"
          description="Sign in with Google to track your Codeforces solves and revision schedule."
          actionLabel="Sign in with Google"
          onAction={login}
        />
      </div>
    );
  }

  if (redirectIfHasHandle && hasHandle) {
    return <Navigate to="/" replace />;
  }

  if (requireHandle && !hasHandle) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
