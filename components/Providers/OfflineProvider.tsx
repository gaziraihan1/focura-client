/**
 * components/Providers/OfflineProvider.tsx
 *
 * Provider for offline functionality.
 * Registers service worker and provides offline status context.
 */

"use client";

import { useEffect, type ReactNode } from "react";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { useOfflineStatus } from "@/hooks/useOfflineStatus";
import { OfflineIndicator } from "@/components/Shared/OfflineIndicator";
import { UpdatePrompt } from "@/components/Shared/UpdatePrompt";

interface OfflineProviderProps {
  children: ReactNode;
}

export function OfflineProvider({ children }: OfflineProviderProps) {
  const { isRegistered } = useServiceWorker();
  const { isOffline } = useOfflineStatus();

  // Log offline status changes
  useEffect(() => {
    if (isOffline) {
      console.log("📡 You are offline. Changes will be synced when reconnected.");
    } else if (isRegistered) {
      console.log("✅ You are online.");
    }
  }, [isOffline, isRegistered]);

  return (
    <>
      {children}
      <OfflineIndicator />
      <UpdatePrompt />
    </>
  );
}
