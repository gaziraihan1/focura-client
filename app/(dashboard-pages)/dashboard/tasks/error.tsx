"use client";

import { ErrorFallback } from "@/components/Shared/ErrorFallback";

export default function TasksError({
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
      title="Tasks Error"
      description="Something went wrong while loading tasks. Your data is safe — please try again."
    />
  );
}
