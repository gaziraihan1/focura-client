"use client";

import { ErrorFallback } from "@/components/Shared/ErrorFallback";

export default function ProjectsError({
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
      title="Projects Error"
      description="Something went wrong while loading projects. Your data is safe — please try again."
    />
  );
}
