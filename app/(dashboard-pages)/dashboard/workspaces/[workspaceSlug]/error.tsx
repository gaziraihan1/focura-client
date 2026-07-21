"use client";

import { ErrorFallback } from "@/components/Shared/ErrorFallback";

export default function WorkspaceError({
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
      title="Workspace Error"
      description="Something went wrong while loading this workspace. Your data is safe — please try again."
    />
  );
}
