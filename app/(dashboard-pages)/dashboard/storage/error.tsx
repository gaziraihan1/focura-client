"use client";

import { ErrorFallback } from "@/components/Shared/ErrorFallback";

export default function StorageError({
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
      title="Storage Error"
      description="Something went wrong while loading storage. Your data is safe — please try again."
    />
  );
}
