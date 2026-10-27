"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createBlog, deleteBlog, getBlog, updateBlog, type BlogCategory, type BlogInput } from "../../api/blogs";
import { useAuth } from "../../hooks/useAuth";
import { queryKeys } from "../../lib/queryClient";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { PageLayout } from "../layout/PageLayout";
import { Skeleton } from "../ui/Skeleton";

const MAX_TITLE_LENGTH = 160;
const MAX_CONTENT_LENGTH = 50_000;

type BlogEditorProps = { blogId?: string };

const markdownStyles = "min-h-72 max-w-full overflow-x-auto break-words rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-200 [&_a]:text-blue-700 [&_a]:underline dark:[&_a]:text-blue-300 [&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_code]:rounded [&_code]:bg-gray-200 [&_code]:px-1 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-200 [&_pre]:p-3 dark:[&_code]:bg-gray-700 dark:[&_pre]:bg-gray-700 [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:mb-3 [&_table]:my-3 [&_table]:border-collapse [&_td]:border [&_td]:border-gray-300 [&_td]:px-2 [&_th]:border [&_th]:border-gray-300 [&_th]:px-2 dark:[&_td]:border-gray-600 dark:[&_th]:border-gray-600";

export function BlogEditor({ blogId }: BlogEditorProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.userId ?? "";
  const isEditingArticle = Boolean(blogId);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<BlogCategory>("DSA");
  const [isPublic, setIsPublic] = useState(false);
  const [problemId, setProblemId] = useState("");
  const [content, setContent] = useState("");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const articleQuery = useQuery({
    queryKey: queryKeys.blog(userId, blogId ?? ""),
    queryFn: () => getBlog(blogId!),
    enabled: Boolean(userId && blogId),
  });

  useEffect(() => {
    if (!articleQuery.data) return;
    setTitle(articleQuery.data.title);
    setCategory(articleQuery.data.category);
    setIsPublic(articleQuery.data.isPublic);
    setProblemId(articleQuery.data.problemId ?? "");
    setContent(articleQuery.data.content ?? "");
  }, [articleQuery.data]);

  const saveMutation = useMutation({
    mutationFn: (input: BlogInput) =>
      blogId ? updateBlog(blogId, input) : createBlog(input),
    onSuccess: async (article) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.blogs(userId) });
      await queryClient.invalidateQueries({ queryKey: ["public-feed"] });
      queryClient.removeQueries({ queryKey: ["public-article", article.id] });
      queryClient.setQueryData(queryKeys.blog(userId, article.id), article);
      if (!blogId) router.push(`/blogs/${article.id}`);
      else setSaveMessage("Article saved.");
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteBlog(blogId!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.blogs(userId) });
      await queryClient.invalidateQueries({ queryKey: ["public-feed"] });
      queryClient.removeQueries({ queryKey: ["public-article", blogId!] });
      queryClient.removeQueries({ queryKey: queryKeys.blog(userId, blogId!) });
      router.push("/blogs");
    },
  });

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveMessage("");
    saveMutation.reset();
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !content.trim() || saveMutation.isPending) return;
    saveMutation.mutate({
      title: trimmedTitle,
      category,
      problemId: category === "PROBLEM" ? problemId.trim() : null,
      content,
      isPublic,
    });
  };

  if (isEditingArticle && articleQuery.isLoading) {
    return <PageLayout><Skeleton className="h-[36rem] w-full" /></PageLayout>;
  }
  if (isEditingArticle && (articleQuery.isError || !articleQuery.data)) {
    return <PageLayout><Card><p className="text-sm text-red-600 dark:text-red-400">Could not load this private article.</p><Link href="/blogs" className="mt-3 inline-block text-sm font-medium text-blue-700 underline dark:text-blue-300">Back to your articles</Link></Card></PageLayout>;
  }

  const problemIdIsValid = category !== "PROBLEM" || /^[1-9]\d*-[A-Za-z0-9]+$/.test(problemId.trim());
  const canSave = Boolean(title.trim() && content.trim() && problemIdIsValid && title.trim().length <= MAX_TITLE_LENGTH && content.length <= MAX_CONTENT_LENGTH);

  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">{isPublic ? "Public article" : "Private article"}</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{isEditingArticle ? "Edit article" : "Write an article"}</h1>
          </div>
          <Link href="/blogs" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Your articles</Link>
        </div>

        <Card>
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label htmlFor="blog-title" className="mb-1.5 block text-sm font-medium">Title</label>
              <input id="blog-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={MAX_TITLE_LENGTH} required placeholder="Give your article a title" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-950 dark:focus:ring-gray-700" />
              <p className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">{title.length}/{MAX_TITLE_LENGTH}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="blog-category" className="mb-1.5 block text-sm font-medium">Article type</label>
                <select id="blog-category" value={category} onChange={(event) => setCategory(event.target.value as BlogCategory)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-950">
                  <option value="DSA">DSA topic</option>
                  <option value="PROBLEM">Codeforces problem</option>
                </select>
              </div>
              {category === "PROBLEM" && (
                <div>
                  <label htmlFor="blog-problem-id" className="mb-1.5 block text-sm font-medium">Problem ID</label>
                  <input id="blog-problem-id" value={problemId} onChange={(event) => setProblemId(event.target.value)} required placeholder="e.g. 1234-A" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-950 dark:focus:ring-gray-700" />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Saved as article metadata.</p>
                </div>
              )}
            </div>

            <fieldset>
              <legend className="mb-1.5 block text-sm font-medium">Visibility</legend>
              <div className="inline-flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600" role="group" aria-label="Article visibility">
                <button type="button" aria-pressed={!isPublic} onClick={() => setIsPublic(false)} className={`px-3 py-2 text-sm font-medium ${!isPublic ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`}>Private</button>
                <button type="button" aria-pressed={isPublic} onClick={() => setIsPublic(true)} className={`border-l border-gray-300 px-3 py-2 text-sm font-medium dark:border-gray-600 ${isPublic ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`}>Public</button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{isPublic ? "Anyone can read this article in the public feed." : "Only you can read this article."}</p>
            </fieldset>

            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <label htmlFor="blog-content" className="text-sm font-medium">Article</label>
                <div className="inline-flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600" role="group" aria-label="Markdown mode">
                  <button type="button" aria-pressed={!isPreviewing} onClick={() => setIsPreviewing(false)} className={`px-3 py-1.5 text-xs font-medium ${!isPreviewing ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`}>Write</button>
                  <button type="button" aria-pressed={isPreviewing} onClick={() => setIsPreviewing(true)} className={`border-l border-gray-300 px-3 py-1.5 text-xs font-medium dark:border-gray-600 ${isPreviewing ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`}>Preview</button>
                </div>
              </div>
              {!isPreviewing ? (
                <textarea id="blog-content" value={content} onChange={(event) => setContent(event.target.value)} maxLength={MAX_CONTENT_LENGTH} rows={18} required spellCheck className="w-full resize-y rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-950 dark:focus:ring-gray-700" placeholder="Write your article in Markdown…" />
              ) : (
                <div className={markdownStyles} aria-label="Markdown preview">
                  {content.trim() ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown> : <p className="text-gray-500 dark:text-gray-400">Nothing to preview yet.</p>}
                </div>
              )}
              <p className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">{content.length.toLocaleString()}/{MAX_CONTENT_LENGTH.toLocaleString()} characters</p>
            </div>

            {saveMutation.isError && <p role="alert" className="text-sm text-red-600 dark:text-red-400">Could not save the article. Your draft is still here; please try again.</p>}
            {deleteMutation.isError && <p role="alert" className="text-sm text-red-600 dark:text-red-400">Could not delete the article. Please try again.</p>}
            {saveMessage && <p role="status" className="text-sm text-green-700 dark:text-green-400">{saveMessage}</p>}

            <div className="flex flex-wrap gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
              <Button type="submit" disabled={!canSave || saveMutation.isPending}>{saveMutation.isPending ? "Saving…" : isEditingArticle ? "Save changes" : isPublic ? "Publish article" : "Save private article"}</Button>
              <Link href={isEditingArticle ? "/blogs" : "/"} className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800">Cancel</Link>
              {isEditingArticle && <Button type="button" variant="danger" className="ml-auto" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate()}>{deleteMutation.isPending ? "Deleting…" : "Delete article"}</Button>}
            </div>
          </form>
        </Card>
      </div>
    </PageLayout>
  );
}
