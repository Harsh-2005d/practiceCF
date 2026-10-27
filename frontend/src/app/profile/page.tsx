"use client";

import ProfilePage from "../../views/Profile";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";

export default function ProfileRoute() {
  return (
    <ProtectedRoute requireAuth>
      <ProfilePage />
    </ProtectedRoute>
  );
}
