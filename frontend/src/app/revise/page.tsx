"use client";

import Dashboard from "../../views/Dashboard";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";

export default function RevisionPage() {
  return (
    <ProtectedRoute requireAuth requireHandle>
      <Dashboard />
    </ProtectedRoute>
  );
}
