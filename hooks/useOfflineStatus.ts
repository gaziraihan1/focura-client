/**
 * hooks/useOfflineStatus.ts
 *
 * Hook for detecting online/offline status and managing offline queue.
 */

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  getPendingMutations,
  addPendingMutation,
  deletePendingMutation,
  type PendingMutation,
} from "@/lib/offline/offlineStorage";

interface OfflineStatus {
  isOnline: boolean;
  isOffline: boolean;
  pendingCount: number;
  syncPending: () => Promise<void>;
  queueMutation: (mutation: Omit<PendingMutation, "id" | "timestamp" | "retryCount">) => Promise<void>;
}

export function useOfflineStatus(): OfflineStatus {
  const [isOnline, setIsOnline] = useState(() => 
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [pendingCount, setPendingCount] = useState(0);
  const hasLoadedRef = useRef(false);

  // Update online status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // Load pending mutations count on mount
  useEffect(() => {
    const loadPendingCount = async () => {
      try {
        const pending = await getPendingMutations();
        setPendingCount(pending.length);
        hasLoadedRef.current = true;
      } catch (error) {
        console.error("Failed to load pending mutations:", error);
      }
    };

    loadPendingCount();
  }, []);

  // Queue a mutation for later sync
  const queueMutation = useCallback(
    async (mutation: Omit<PendingMutation, "id" | "timestamp" | "retryCount">) => {
      try {
        await addPendingMutation({
          ...mutation,
          timestamp: Date.now(),
          retryCount: 0,
        });
        setPendingCount((prev) => prev + 1);
      } catch (error) {
        console.error("Failed to queue mutation:", error);
      }
    },
    []
  );

  // Sync pending mutations when back online
  const syncPending = useCallback(async () => {
    try {
      const pending = await getPendingMutations();

      for (const mutation of pending) {
        try {
          const response = await fetch(mutation.endpoint, {
            method: mutation.method,
            headers: {
              "Content-Type": "application/json",
            },
            body: mutation.data ? JSON.stringify(mutation.data) : undefined,
          });

          if (response.ok) {
            await deletePendingMutation(mutation.id!);
            setPendingCount((prev) => Math.max(0, prev - 1));
          } else {
            console.error(`Failed to sync mutation: ${response.statusText}`);
          }
        } catch (error) {
          console.error("Failed to sync mutation:", error);
        }
      }
    } catch (error) {
      console.error("Failed to sync pending mutations:", error);
    }
  }, []);

  // Auto-sync when coming back online (skip initial load)
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    if (isOnline && pendingCount > 0) {
      // Use setTimeout to avoid calling setState synchronously in effect
      const timeoutId = setTimeout(() => {
        syncPending();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [isOnline, pendingCount, syncPending]);

  return {
    isOnline,
    isOffline: !isOnline,
    pendingCount,
    syncPending,
    queueMutation,
  };
}
