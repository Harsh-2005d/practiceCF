import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { refreshUserRating, getHistogram } from "../api/stats";
import { queryKeys } from "../lib/queryClient";
import { getCfRank } from "../utils/cfRank";
import { ProfileCard } from "../components/profile/ProfileCard";
import { SolveHistogram } from "../components/profile/SolveHistogram";
import { PageLayout } from "../components/layout/PageLayout";
import { Skeleton } from "../components/ui/Skeleton";
import { BlogList } from "../components/blogs/BlogList";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const { data: histogram = [], isLoading: histogramLoading } = useQuery({
    queryKey: queryKeys.histogram,
    queryFn: getHistogram,
    enabled: Boolean(user?.handle),
  });

  const refreshMutation = useMutation({
    mutationFn: refreshUserRating,
    onSuccess: async () => {
      setRefreshError(null);
      await refreshUser();
      await queryClient.invalidateQueries({ queryKey: queryKeys.histogram });
      await queryClient.invalidateQueries({ queryKey: queryKeys.revision });
    },
    onError: () => {
      setRefreshError("Failed to refresh rating. Codeforces may be unavailable.");
    },
  });

  if (!user) return null;

  const rankInfo = getCfRank(user.rating);

  return (
    <PageLayout>
      <div className="space-y-6">
        <ProfileCard
          user={user}
          rankInfo={rankInfo}
          onRefresh={() => refreshMutation.mutate()}
          isRefreshing={refreshMutation.isPending}
          refreshError={refreshError}
        />

        {user.handle && (
          <>
            {histogramLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <SolveHistogram data={histogram} />
            )}
          </>
        )}

        <BlogList />
      </div>
    </PageLayout>
  );
}
