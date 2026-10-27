"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPublicBlog } from "../../api/blogs";
import { queryKeys } from "../../lib/queryClient";
import { Card } from "../ui/Card";
import { PageLayout } from "../layout/PageLayout";
import { Skeleton } from "../ui/Skeleton";

const markdownStyles = "mt-6 max-w-full overflow-x-auto break-words text-base leading-7 text-gray-800 dark:text-gray-200 [&_a]:text-blue-700 [&_a]:underline dark:[&_a]:text-blue-300 [&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-100 [&_pre]:p-4 dark:[&_code]:bg-gray-800 dark:[&_pre]:bg-gray-800 [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-semibold [&_li]:ml-6 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:mb-4 [&_table]:my-4 [&_table]:border-collapse [&_td]:border [&_td]:border-gray-300 [&_td]:px-2 [&_th]:border [&_th]:border-gray-300 [&_th]:px-2 dark:[&_td]:border-gray-700 dark:[&_th]:border-gray-700";

export function PublicArticle({ articleId }: { articleId: string }) {
  const articleQuery = useQuery({
    queryKey: queryKeys.publicBlog(articleId),
    queryFn: () => getPublicBlog(articleId),
    enabled: Boolean(articleId),
  });
  const article = articleQuery.data;
  const problemParts = article?.problemId?.split("-");

  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-4 inline-flex text-sm font-medium text-gray-600 hover:text-gray-950 dark:text-gray-300 dark:hover:text-white">← Back to feed</Link>
        {articleQuery.isLoading ? (
          <Skeleton className="h-[36rem] w-full" />
        ) : articleQuery.isError || !article ? (
          <Card><h1 className="text-lg font-semibold">Article unavailable</h1><p className="mt-2 text-sm text-gray-600 dark:text-gray-400">It may have been removed or made private.</p></Card>
        ) : (
          <Card className="p-6 sm:p-10">
            <article>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-800 dark:text-gray-200">{article.authorHandle || "PracticeCF user"}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={article.createdAt}>{new Date(article.createdAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</time>
                <span aria-hidden="true">·</span>
                <span>{article.category === "PROBLEM" ? "Problem discussion" : "DSA"}</span>
                {article.problemId && problemParts?.length === 2 && (
                  <a href={`https://codeforces.com/problemset/problem/${problemParts[0]}/${problemParts[1]}`} target="_blank" rel="noopener noreferrer" className="rounded bg-gray-100 px-2 py-0.5 font-mono text-gray-700 hover:underline dark:bg-gray-800 dark:text-gray-300">{article.problemId}</a>
                )}
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 dark:text-white">{article.title}</h1>
              <div className={markdownStyles}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ href, children, ...props }) => (
                      <a {...props} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
                    ),
                  }}
                >
                  {article.content ?? ""}
                </ReactMarkdown>
              </div>
            </article>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
