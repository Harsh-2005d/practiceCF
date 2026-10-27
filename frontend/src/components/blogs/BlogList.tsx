"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "../../api/blogs";
import { useAuth } from "../../hooks/useAuth";
import { queryKeys } from "../../lib/queryClient";
import { Card, CardTitle } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";

type BlogListProps = { showTitle?: boolean };

export function BlogList({ showTitle = true }: BlogListProps) {
  const { user } = useAuth();
  const userId = user?.userId ?? "";
  const blogsQuery = useQuery({
    queryKey: queryKeys.blogs(userId),
    queryFn: getBlogs,
    enabled: Boolean(userId),
  });
  const blogs = blogsQuery.data ?? [];

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        {showTitle ? <CardTitle className="mb-0">Your articles</CardTitle> : <div />}
        <Link href="/blogs/new" aria-label="Write a new article" title="Write a new article" className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white transition-colors hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white dark:focus-visible:outline-gray-100">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
          </svg>
        </Link>
      </div>

      {blogsQuery.isLoading ? (
        <div className="space-y-3"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div>
      ) : blogsQuery.isError ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">Could not load your articles.</p>
      ) : blogs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 px-5 py-8 text-center dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-gray-100">No articles yet</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Write about a DSA topic or share an approach to a Codeforces problem.</p>
          <Link href="/blogs/new" className="mt-4 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white">Write your first article</Link>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {blogs.map((blog) => (
            <li key={blog.id}>
              <Link href={`/blogs/${blog.id}`} className="group flex flex-wrap items-center justify-between gap-3 py-4 first:pt-1 last:pb-1">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-gray-900 group-hover:text-blue-700 dark:text-gray-100 dark:group-hover:text-blue-300">{blog.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{blog.category === "PROBLEM" ? "Codeforces problem" : "DSA topic"}</span>
                    {blog.problemId && <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono dark:bg-gray-800">{blog.problemId}</span>}
                    <span className={`rounded px-1.5 py-0.5 ${blog.isPublic ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}>{blog.isPublic ? "Public" : "Private"}</span>
                  </div>
                </div>
                <time dateTime={blog.updatedAt} className="shrink-0 text-xs text-gray-500 dark:text-gray-400">Updated {new Date(blog.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
