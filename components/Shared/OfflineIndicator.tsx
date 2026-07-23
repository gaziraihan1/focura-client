/**
 * components/Shared/OfflineIndicator.tsx
 *
 * Visual indicator showing online/offline status and pending sync count.
 */

"use client";

import { useOfflineStatus } from "@/hooks/useOfflineStatus";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfflineIndicatorProps {
  className?: string;
}

export function OfflineIndicator({ className }: OfflineIndicatorProps) {
  const { isOnline, isOffline, pendingCount, syncPending } = useOfflineStatus();

  if (isOnline && pendingCount === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-2 shadow-lg transition-all",
        isOffline
          ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400"
          : "bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400",
        className
      )}
    >
      {isOffline ? (
        <>
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">Offline</span>
          {pendingCount > 0 && (
            <span className="ml-1 rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs">
              {pendingCount} pending
            </span>
          )}
        </>
      ) : (
        <>
          <Wifi className="h-4 w-4" />
          <span className="text-sm font-medium">Online</span>
          {pendingCount > 0 && (
            <>
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs">
                {pendingCount} syncing
              </span>
              <button
                onClick={syncPending}
                className="ml-1 rounded-full p-1 hover:bg-blue-500/20"
                aria-label="Sync now"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
