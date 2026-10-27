import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRevisionSolves } from "../api/revise";
import { queryKeys } from "../lib/queryClient";
import type { DashboardData, TimeFilter } from "../types/solve";
import { FilterTabs } from "../components/dashboard/FilterTabs";
import { SolveList } from "../components/dashboard/SolveList";
import { Card, CardTitle } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { PageLayout } from "../components/layout/PageLayout";

const FILTER_LABELS: Record<TimeFilter, string> = {
  yesterday: "Yesterday",
  sevenDaysAgo: "7 Days Ago",
  thirtyDaysAgo: "30 Days Ago",
};

function toDashboardData(res: Awaited<ReturnType<typeof getRevisionSolves>>): DashboardData {
  return {
    yesterday: res.previousDay,
    sevenDaysAgo: res.previousWeek,
    thirtyDaysAgo: res.previousMonth,
  };
}

export default function Dashboard() {
  const [filter, setFilter] = useState<TimeFilter>("yesterday");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.revision,
    queryFn: async () => toDashboardData(await getRevisionSolves()),
  });

  const solves = data?.[filter] ?? [];

  const tabs = (["yesterday", "sevenDaysAgo", "thirtyDaysAgo"] as TimeFilter[]).map(
    (key) => ({
      key,
      label: FILTER_LABELS[key],
      count: data?.[key]?.length ?? 0,
    })
  );

  return (
    <PageLayout>
      <FilterTabs
        tabs={tabs}
        activeKey={filter}
        onChange={(key) => setFilter(key as TimeFilter)}
      />

      <Card className="mt-6">
        <CardTitle>{FILTER_LABELS[filter]}</CardTitle>

        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {isError && (
          <EmptyState
            title="Could not load revision data"
            description="Your solves may still be syncing, or the server is temporarily unavailable."
            actionLabel="Try again"
            onAction={() => refetch()}
          />
        )}

        {!isLoading && !isError && <SolveList solves={solves} />}
      </Card>
    </PageLayout>
  );
}
