import type { User, CfRank } from "../../types/user";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

type ProfileCardProps = {
  user: User;
  rankInfo: Pick<CfRank, "title">;
  onRefresh: () => void;
  isRefreshing: boolean;
  refreshError: string | null;
};

export function ProfileCard({
  user,
  rankInfo,
  onRefresh,
  isRefreshing,
  refreshError,
}: ProfileCardProps) {
  return (
    <Card>
      {user.handle ? (
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              <a
                href={`https://codeforces.com/profile/${user.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:underline dark:text-gray-100"
              >
                {user.handle}
              </a>
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {rankInfo.title}
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? "Refreshing…" : "Refresh"}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No Codeforces handle linked yet. Complete onboarding to get started.
        </p>
      )}

      {refreshError && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{refreshError}</p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:max-w-md">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Rating
          </p>
          <p className="mt-1 text-base font-medium text-gray-900 dark:text-gray-100">
            {user.rating ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Email
          </p>
          <p className="mt-1 truncate text-base font-medium text-gray-900 dark:text-gray-100">
            {user.email ?? "—"}
          </p>
        </div>
      </div>
    </Card>
  );
}
