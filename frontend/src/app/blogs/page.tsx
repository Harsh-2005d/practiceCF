"use client";

import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { BlogList } from "../../components/blogs/BlogList";
import { PageLayout } from "../../components/layout/PageLayout";

export default function BlogsPage() {
  return (
    <ProtectedRoute requireAuth>
      <PageLayout>
        <div className="mb-5">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Only visible to you</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Your articles</h1>
        </div>
        <BlogList showTitle={false} />
      </PageLayout>
    </ProtectedRoute>
  );
}
