"use client";

import { ErrorFallback } from "@/components/Shared/ErrorFallback";

export default function PublicError({
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
      title="Page Error"
      description="Something went wrong while loading this page. Please try again."
    />
  );
}
