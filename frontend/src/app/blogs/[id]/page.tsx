"use client";

import { useParams } from "next/navigation";
import { ProtectedRoute } from "../../../components/auth/ProtectedRoute";
import { BlogEditor } from "../../../components/blogs/BlogEditor";

export default function EditBlogPage() {
  const params = useParams<{ id: string }>();
  return (
    <ProtectedRoute requireAuth>
      <BlogEditor blogId={params.id} />
    </ProtectedRoute>
  );
}
