"use client";

import { ErrorFallback } from "@/components/Shared/ErrorFallback";

export default function DashboardError({
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
      title="Dashboard Error"
      description="Something went wrong while loading the dashboard. Your data is safe — please try again."
    />
  );
}
