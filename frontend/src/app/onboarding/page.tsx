"use client";

import OnboardingPage from "../../views/Onboarding";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";

export default function OnboardingRoute() {
  return (
    <ProtectedRoute requireAuth redirectIfHasHandle>
      <OnboardingPage />
    </ProtectedRoute>
  );
}
