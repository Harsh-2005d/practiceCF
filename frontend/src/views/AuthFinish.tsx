import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export default function AuthFinish() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  useEffect(() => {
    refreshUser().then((user) => {
      if (!user) {
        router.replace("/");
        return;
      }
      router.replace(user.handle ? "/" : "/onboarding");
    });
  }, [router, refreshUser]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <p className="text-sm text-gray-500 dark:text-gray-400">Signing you in…</p>
    </div>
  );
}
