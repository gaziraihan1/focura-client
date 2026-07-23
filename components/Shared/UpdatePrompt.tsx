/**
 * components/Shared/UpdatePrompt.tsx
 *
 * Prompts the user to update when a new version is available.
 */

"use client";

import { useServiceWorker } from "@/hooks/useServiceWorker";
import { RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface UpdatePromptProps {
  className?: string;
}

export function UpdatePrompt({ className }: UpdatePromptProps) {
  const { isWaiting, update } = useServiceWorker();
  const [dismissed, setDismissed] = useState(false);

  if (!isWaiting || dismissed) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-3 shadow-lg",
        className
      )}
    >
      <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      <div className="flex-1">
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          New version available
        </p>
        <p className="text-xs text-blue-500/80">
          Refresh to get the latest updates
        </p>
      </div>
      <button
        onClick={update}
        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
      >
        Update
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="rounded-full p-1 hover:bg-blue-500/20"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
