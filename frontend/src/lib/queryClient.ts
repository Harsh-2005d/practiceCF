import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

export const queryKeys = {
  revision: ["revision"] as const,
  histogram: ["histogram"] as const,
  problemNote: (userId: string, problemId: string) =>
    ["problem-note", userId, problemId] as const,
  blogs: (userId: string) => ["blogs", userId] as const,
  blog: (userId: string, blogId: string) => ["blog", userId, blogId] as const,
  publicFeed: ["public-feed"] as const,
  publicBlog: (blogId: string) => ["public-article", blogId] as const,
};
