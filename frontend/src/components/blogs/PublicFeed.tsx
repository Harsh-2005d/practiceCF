"use client";

import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPublicFeed } from "../../api/blogs";
import { queryKeys } from "../../lib/queryClient";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { EmptyState } from "../ui/EmptyState";
import { PageLayout } from "../layout/PageLayout";
import { Skeleton } from "../ui/Skeleton";

export function PublicFeed() {
  const feedQuery = useInfiniteQuery({
    queryKey: queryKeys.publicFeed,
    queryFn: ({ pageParam }) => getPublicFeed(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
  const posts = feedQuery.data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">DSA ideas and problem write-ups</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950 dark:text-white">Community feed</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Public articles from PracticeCF writers, newest first.</p>
            </div>
            <Link href="/blogs/new" aria-label="Write an article" title="Write an article" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:outline-gray-100">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
              </svg>
            </Link>
          </div>
        </header>

        {feedQuery.isLoading ? (
          <div className="space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-48 w-full" /></div>
        ) : feedQuery.isError ? (
          <EmptyState title="Could not load the feed" description="The feed is temporarily unavailable." actionLabel="Try again" onAction={() => void feedQuery.refetch()} />
        ) : posts.length === 0 ? (
          <Card><EmptyState title="No public articles yet" description="When someone publishes an article, it will appear here." /></Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="p-5 transition-shadow hover:shadow-md sm:p-6">
                <article>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{post.authorHandle || "PracticeCF user"}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</time>
                    <span aria-hidden="true">·</span>
                    <span>{post.category === "PROBLEM" ? "Problem discussion" : "DSA"}</span>
                    {post.problemId && <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-gray-700 dark:bg-gray-800 dark:text-gray-300">{post.problemId}</span>}
                  </div>
                  <h2 className="mt-2 text-xl font-semibold text-gray-950 dark:text-white">
                    <Link href={`/feed/${post.id}`} className="hover:underline">{post.title}</Link>
                  </h2>
                  <p className="mt-2 line-clamp-4 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700 dark:text-gray-300">{post.content?.trim()}</p>
                  <Link href={`/feed/${post.id}`} className="mt-3 inline-flex text-sm font-semibold text-gray-900 hover:underline dark:text-gray-100">Read article →</Link>
                </article>
              </Card>
            ))}
            {feedQuery.hasNextPage && (
              <div className="flex justify-center pt-2">
                <Button variant="secondary" onClick={() => void feedQuery.fetchNextPage()} disabled={feedQuery.isFetchingNextPage}>
                  {feedQuery.isFetchingNextPage ? "Loading…" : "Load more"}
                </Button>
              </div>
            )}
            {feedQuery.isFetchNextPageError && <p role="alert" className="text-center text-sm text-red-600 dark:text-red-400">Could not load more articles. Try again.</p>}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
