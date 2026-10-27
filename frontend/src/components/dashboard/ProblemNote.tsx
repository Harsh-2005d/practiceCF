"use client";

import { useId, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { deleteProblemNote, getProblemNote, saveProblemNote } from "../../api/notes";
import { useAuth } from "../../hooks/useAuth";
import { queryKeys } from "../../lib/queryClient";
import { Button } from "../ui/Button";

const MAX_NOTE_LENGTH = 10_000;

type ProblemNoteProps = {
  contestId: number;
  index: string;
  problemName: string;
};

export function ProblemNote({ contestId, index, problemName }: ProblemNoteProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const panelId = `note-panel-${useId().replaceAll(":", "")}`;
  const userId = user?.userId ?? "";
  const problemId = `${contestId}-${index}`;
  const queryKey = queryKeys.problemNote(userId, problemId);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [isPreviewing, setIsPreviewing] = useState(false);

  const noteQuery = useQuery({
    queryKey,
    queryFn: () => getProblemNote(problemId),
    enabled: Boolean(userId && isExpanded),
    staleTime: 5 * 60_000,
  });

  const saveMutation = useMutation({
    mutationFn: (content: string) => saveProblemNote(problemId, content),
    onSuccess: (note) => {
      queryClient.setQueryData(queryKey, note);
      setDraft(note.content);
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProblemNote(problemId),
    onSuccess: () => {
      queryClient.setQueryData(queryKey, null);
      setDraft("");
      setIsEditing(false);
    },
  });

  const beginEditing = () => {
    saveMutation.reset();
    deleteMutation.reset();
    setDraft(noteQuery.data?.content ?? "");
    setIsPreviewing(false);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft(noteQuery.data?.content ?? "");
    setIsEditing(false);
    saveMutation.reset();
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (draft.trim().length > 0 && draft.length <= MAX_NOTE_LENGTH && !saveMutation.isPending) {
      saveMutation.mutate(draft);
    }
  };

  return (
    <section className="contents">
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        aria-label={`${isExpanded ? "Close" : "Open"} private note for ${problemName}`}
        onClick={() => setIsExpanded((expanded) => !expanded)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:outline-gray-100"
      >
        <span aria-hidden="true" className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      <div
        id={panelId}
        hidden={!isExpanded}
        className="mt-2 w-full min-w-0 basis-full rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
      >
          {noteQuery.isLoading && (
            <p role="status" className="text-sm text-gray-500 dark:text-gray-400">
              Loading note…
            </p>
          )}

          {noteQuery.isError && (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <p role="alert" className="text-red-600 dark:text-red-400">
                Could not load this note.
              </p>
              <button
                type="button"
                onClick={() => void noteQuery.refetch()}
                className="font-medium text-gray-700 underline dark:text-gray-200"
              >
                Try again
              </button>
            </div>
          )}

          {noteQuery.isSuccess && !isEditing && (
            <>
              {saveMutation.isSuccess && (
                <p role="status" className="mb-2 text-sm text-green-700 dark:text-green-400">
                  Note saved.
                </p>
              )}
              {noteQuery.data ? (
                <div className="max-w-full overflow-x-auto break-words text-sm leading-6 text-gray-700 dark:text-gray-200 [&_a]:text-blue-700 [&_a]:underline dark:[&_a]:text-blue-300 [&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:mb-2 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-100 [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:my-3 [&_table]:border-collapse [&_td]:border [&_td]:border-gray-300 [&_td]:px-2 [&_th]:border [&_th]:border-gray-300 [&_th]:px-2 dark:[&_code]:bg-gray-800 dark:[&_pre]:bg-gray-800 dark:[&_td]:border-gray-600 dark:[&_th]:border-gray-600">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ href, children, ...props }) => (
                        <a
                          {...props}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {noteQuery.data.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No note saved for this problem yet.
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" variant="secondary" className="px-3 py-1.5" onClick={beginEditing}>
                  {noteQuery.data ? "Edit note" : "Add note"}
                </Button>
                {noteQuery.data && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="px-3 py-1.5 text-red-600 dark:text-red-400"
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate()}
                  >
                    {deleteMutation.isPending ? "Deleting…" : "Delete note"}
                  </Button>
                )}
              </div>
              {deleteMutation.isError && (
                <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Could not delete this note. Please try again.
                </p>
              )}
              {deleteMutation.isSuccess && (
                <p role="status" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Note deleted.
                </p>
              )}
            </>
          )}

          {isEditing && (
            <form onSubmit={handleSave}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor={`${panelId}-editor`}
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Markdown note for {problemName}
                </label>
                <div className="inline-flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600" role="group" aria-label="Markdown mode">
                  <button
                    type="button"
                    aria-pressed={!isPreviewing}
                    onClick={() => setIsPreviewing(false)}
                    className={`px-3 py-1 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900 dark:focus-visible:outline-gray-100 ${!isPreviewing ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    aria-pressed={isPreviewing}
                    onClick={() => setIsPreviewing(true)}
                    className={`border-l border-gray-300 px-3 py-1 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900 dark:border-gray-600 dark:focus-visible:outline-gray-100 ${isPreviewing ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`}
                  >
                    Preview
                  </button>
                </div>
              </div>
              <div>
                {!isPreviewing && (
                  <textarea
                    id={`${panelId}-editor`}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    maxLength={MAX_NOTE_LENGTH}
                    rows={12}
                    spellCheck
                    className="w-full resize-y rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-gray-700"
                    aria-describedby={`${panelId}-length`}
                  />
                )}
                {isPreviewing && (
                  <div
                    aria-label="Markdown preview"
                    className="min-h-72 max-w-full overflow-x-auto break-words rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm leading-6 text-gray-700 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-200 [&_a]:text-blue-700 [&_a]:underline dark:[&_a]:text-blue-300 [&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_code]:rounded [&_code]:bg-gray-200 [&_code]:px-1 [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-gray-200 [&_pre]:p-2 dark:[&_code]:bg-gray-700 dark:[&_pre]:bg-gray-700 [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:mb-2 [&_table]:my-2 [&_table]:border-collapse [&_td]:border [&_td]:border-gray-300 [&_td]:px-2 [&_th]:border [&_th]:border-gray-300 [&_th]:px-2 dark:[&_td]:border-gray-600 dark:[&_th]:border-gray-600"
                  >
                    {draft.trim() ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft}</ReactMarkdown>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">Your Markdown preview will appear here.</p>
                    )}
                  </div>
                )}
              </div>
              <p id={`${panelId}-length`} className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">
                {draft.length.toLocaleString()} / {MAX_NOTE_LENGTH.toLocaleString()} characters
              </p>

              {saveMutation.isError && (
                <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Could not save this note. Your draft is still here; please try again.
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="submit" disabled={saveMutation.isPending || draft.trim().length === 0 || draft.length > MAX_NOTE_LENGTH}>
                  {saveMutation.isPending ? "Saving…" : "Save note"}
                </Button>
                <Button type="button" variant="secondary" onClick={cancelEditing} disabled={saveMutation.isPending}>
                  Cancel
                </Button>
                {noteQuery.data && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-600 dark:text-red-400"
                    disabled={deleteMutation.isPending || saveMutation.isPending}
                    onClick={() => deleteMutation.mutate()}
                  >
                    {deleteMutation.isPending ? "Deleting…" : "Delete note"}
                  </Button>
                )}
              </div>
              {deleteMutation.isError && (
                <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Could not delete this note. Your draft is still here.
                </p>
              )}
              {saveMutation.isSuccess && (
                <p role="status" className="mt-2 text-sm text-green-700 dark:text-green-400">
                  Note saved.
                </p>
              )}
            </form>
          )}
      </div>
    </section>
  );
}
