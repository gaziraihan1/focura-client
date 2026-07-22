"use client";

import { ErrorFallback } from "@/components/Shared/ErrorFallback";

export default function CalendarError({
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
      title="Calendar Error"
      description="Something went wrong while loading the calendar. Your data is safe — please try again."
    />
  );
}
