"use client";

import { ErrorFallback } from "@/components/Shared/ErrorFallback";

export default function AuthError({
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
      title="Authentication Error"
      description="Something went wrong during authentication. Please try again."
    />
  );
}
