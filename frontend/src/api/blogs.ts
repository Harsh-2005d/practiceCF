import { api } from "./client";

export type BlogCategory = "DSA" | "PROBLEM";

export type BlogArticle = {
  id: string;
  title: string;
  category: BlogCategory;
  isPublic: boolean;
  problemId: string | null;
  authorHandle?: string | null;
  content?: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogInput = {
  title: string;
  category: BlogCategory;
  problemId: string | null;
  content: string;
  isPublic: boolean;
};

export type PublicFeedPage = {
  posts: BlogArticle[];
  nextCursor: string | null;
};

export async function getPublicFeed(cursor?: string | null): Promise<PublicFeedPage> {
  const response = await api.get<PublicFeedPage>("/api/feed", {
    params: cursor ? { cursor } : undefined,
  });
  return response.data;
}

export async function getPublicBlog(id: string): Promise<BlogArticle> {
  const response = await api.get<{ blog: BlogArticle }>(`/api/feed/${encodeURIComponent(id)}`);
  return response.data.blog;
}

export async function getBlogs(): Promise<BlogArticle[]> {
  const response = await api.get<{ blogs: BlogArticle[] }>("/api/blogs");
  return response.data.blogs;
}

export async function getBlog(id: string): Promise<BlogArticle> {
  const response = await api.get<{ blog: BlogArticle }>(`/api/blogs/${encodeURIComponent(id)}`);
  return response.data.blog;
}

export async function createBlog(input: BlogInput): Promise<BlogArticle> {
  const response = await api.post<{ blog: BlogArticle }>("/api/blogs", input);
  return response.data.blog;
}

export async function updateBlog(id: string, input: BlogInput): Promise<BlogArticle> {
  const response = await api.put<{ blog: BlogArticle }>(`/api/blogs/${encodeURIComponent(id)}`, input);
  return response.data.blog;
}

export async function deleteBlog(id: string): Promise<void> {
  await api.delete(`/api/blogs/${encodeURIComponent(id)}`);
}
