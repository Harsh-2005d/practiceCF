"use client";

import { ProtectedRoute } from "../../../components/auth/ProtectedRoute";
import { BlogEditor } from "../../../components/blogs/BlogEditor";

export default function NewBlogPage() {
  return (
    <ProtectedRoute requireAuth>
      <BlogEditor />
    </ProtectedRoute>
  );
}
