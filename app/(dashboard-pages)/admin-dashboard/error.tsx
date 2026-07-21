"use client";

import { ErrorFallback } from "@/components/Shared/ErrorFallback";

export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorFallback
      error={error}
      reset={reset}
      title="Admin Error"
      description="Something went wrong in the admin dashboard. Please try again."
    />
  );
}
