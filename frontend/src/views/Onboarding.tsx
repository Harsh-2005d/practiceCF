import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setHandle } from "../api/handle";
import { useAuth } from "../hooks/useAuth";
import { queryKeys } from "../lib/queryClient";
import { Button } from "../components/ui/Button";
import { Card, CardTitle } from "../components/ui/Card";
import { PageLayout } from "../components/layout/PageLayout";

export default function OnboardingPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [handle, setHandleInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const linkHandle = useMutation({
    mutationFn: setHandle,
    onSuccess: async () => {
      setError(null);
      await refreshUser();
      await queryClient.invalidateQueries({ queryKey: queryKeys.revision });
      await queryClient.invalidateQueries({ queryKey: queryKeys.histogram });
      router.replace("/");
    },
    onError: (err: unknown) => {
      const message =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "error" in err.response.data
          ? String(err.response.data.error)
          : "Failed to link handle. Check that it exists on Codeforces.";
      setError(message);
    },
  });

  return (
    <PageLayout>
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome to PracticeCF
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Link your Codeforces handle to import solved problems and start
            spaced-revision review.
          </p>
        </div>

        <Card>
          <CardTitle>How it works</CardTitle>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-400">
            <li>We sync your accepted submissions from Codeforces.</li>
            <li>Each day, problems from 1, 7, and 30 days ago appear for review.</li>
            <li>Revisiting problems helps you retain patterns long-term.</li>
          </ol>
        </Card>

        <Card>
          <CardTitle>Link your Codeforces handle</CardTitle>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            This is a one-time setup. We will import your last 30 days of solves.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandleInput(e.target.value.trim())}
              placeholder="e.g. tourist"
              className="h-11 flex-1 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-300"
            />
            <Button
              onClick={() => linkHandle.mutate(handle)}
              disabled={!handle.trim() || linkHandle.isPending}
            >
              {linkHandle.isPending ? "Importing…" : "Link handle"}
            </Button>
          </div>

          {linkHandle.isPending && (
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Importing your last 30 days of solves…
            </p>
          )}

          {error && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
