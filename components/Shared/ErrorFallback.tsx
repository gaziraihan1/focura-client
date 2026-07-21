"use client";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
}

export function ErrorFallback({
  error,
  reset,
  title = "Something went wrong",
  description,
}: ErrorFallbackProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-xl bg-card border border-border p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />

        <h2 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h2>

        <p className="text-muted-foreground mb-6">
          {description || error.message || "An unexpected error occurred."}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition font-medium"
          >
            Try Again
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition font-medium"
          >
            Go Back
          </button>
        </div>

        {(error.message || error.stack) && (
          <details className="mt-6 text-left">
            <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition">
              Error details
            </summary>
            <pre className="mt-2 p-3 rounded-lg bg-muted text-xs text-muted-foreground overflow-auto max-h-40">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        {error.digest && (
          <p className="mt-4 text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
