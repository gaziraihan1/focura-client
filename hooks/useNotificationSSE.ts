"use client";

import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { useEffect, useRef, useCallback, useState } from "react";
import {
  Notification,
  NotificationsResponse,
  UnreadCountResponse,
  ConnectionStatus,
  NotificationPreferences,
  TASK_NOTIFICATION_TYPES,
  PROJECT_NOTIFICATION_TYPES,
} from "@/types/notification.types";
import { notificationKeys } from "./notificationKeys";
import { playNotificationSound, showBrowserNotification } from "./useNotificationPreferences";
import axiosInstance from "@/lib/axios";

const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 30000;
const HEARTBEAT_TIMEOUT = 60000;

function getExponentialBackoff(attempt: number): number {
  const baseDelay = Math.min(
    INITIAL_RETRY_DELAY * Math.pow(2, attempt),
    MAX_RETRY_DELAY
  );
  const jitter = Math.random() * 0.3 * baseDelay;
  return Math.floor(baseDelay + jitter);
}

/**
 * Mint a fresh single-use SSE token from the backend. Every stream connection
 * must use a brand-new token (each one opens exactly one connection), so this
 * runs before each (re)connect instead of reusing the session token — a reused
 * token is rejected with 401 TOKEN_REUSED.
 */
async function fetchFreshSseToken(): Promise<string | null> {
  try {
    const res = await axiosInstance.get<{ success: boolean; sseToken: string }>(
      "/api/v1/notifications/sse-token",
    );
    const token = res.data?.sseToken;
    return typeof token === "string" && token.length > 0 ? token : null;
  } catch {
    return null;
  }
}

interface UseNotificationSSEOptions {
  backendToken: string | null;
  /** Session-provided single-use token — fallback when minting fails. */
  sseToken: string | null;
  preferences: NotificationPreferences;
  onNotification?: (notification: Notification) => void;
}

export function useNotificationSSE({
  backendToken,
  sseToken,
  preferences,
  onNotification,
}: UseNotificationSSEOptions) {
  const qc = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);
  const connectRef = useRef<(() => void) | null>(null);
  const connectingRef = useRef(false);
  const retryCountRef = useRef(0);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const preferencesRef = useRef(preferences);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");

  // Keep preferences ref in sync
  useEffect(() => {
    preferencesRef.current = preferences;
  }, [preferences]);

  // Heartbeat management
  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimerRef.current) {
      clearTimeout(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
  }, []);

  const startHeartbeat = useCallback(() => {
    stopHeartbeat();
    heartbeatTimerRef.current = setTimeout(() => {
      // No message received in HEARTBEAT_TIMEOUT - connection may be stale
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        setConnectionStatus("reconnecting");
        connectRef.current?.();
      }
    }, HEARTBEAT_TIMEOUT);
  }, [stopHeartbeat]);

  // Cache update helpers
  const prependNotification = useCallback(
    (notification: Notification) => {
      qc.setQueryData<InfiniteData<NotificationsResponse>>(
        notificationKeys.list(),
        (old) => {
          if (!old) {
            return {
              pages: [
                { items: [notification], nextCursor: null, hasMore: false },
              ],
              pageParams: [undefined],
            };
          }
          // Guard: don't prepend if it already exists (e.g. reconnect replay)
          const alreadyExists = old.pages.some((p) =>
            p.items.some((n) => n.id === notification.id)
          );
          if (alreadyExists) return old;

          return {
            ...old,
            pages: old.pages.map((page, i) =>
              i === 0
                ? { ...page, items: [notification, ...page.items] }
                : page
            ),
          };
        }
      );
    },
    [qc]
  );

  const incrementUnreadCount = useCallback(() => {
    qc.setQueryData<UnreadCountResponse>(
      notificationKeys.unreadCount(),
      (old) => ({ count: (old?.count ?? 0) + 1 })
    );
  }, [qc]);

  const invalidateTaskQueries = useCallback(
    (notificationType: string) => {
      if (TASK_NOTIFICATION_TYPES.includes(notificationType as typeof TASK_NOTIFICATION_TYPES[number])) {
        qc.invalidateQueries({ queryKey: ["tasks"] });
      }
    },
    [qc]
  );

  const invalidateProjectQueries = useCallback(
    (notificationType: string) => {
      if (PROJECT_NOTIFICATION_TYPES.includes(notificationType as typeof PROJECT_NOTIFICATION_TYPES[number])) {
        qc.invalidateQueries({ queryKey: ["projects"] });
      }
    },
    [qc]
  );

  // SSE connection
  const connect = useCallback(async () => {
    if (!backendToken) return;
    // In-flight guard: connect() is fired from several paths (mount, onerror
    // backoff, heartbeat, online/visibility). Without this, overlapping calls
    // during the mint await would each open a stream and the last would clobber
    // the rest — leaving orphaned connections and duplicate notifications.
    if (connectingRef.current) return;
    connectingRef.current = true;

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // Close existing connection if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setConnectionStatus(
      retryCountRef.current > 0 ? "reconnecting" : "connecting"
    );

    // Each connection needs a brand-new single-use token — a reused one is
    // rejected with 401 TOKEN_REUSED. Mint a fresh token (fallback: session).
    const streamToken = (await fetchFreshSseToken()) ?? sseToken;
    if (!streamToken) {
      // No token yet (session warming up / backend unreachable) — retry with backoff
      connectingRef.current = false;
      retryCountRef.current++;
      setConnectionStatus("reconnecting");
      retryTimerRef.current = setTimeout(
        () => connectRef.current?.(),
        getExponentialBackoff(retryCountRef.current),
      );
      return;
    }

    // The EventSource is closed by the token effect's cleanup below
    // (eventSourceRef.current?.close()), so the resource is released on unmount.
    // react-doctor-disable-next-line react-doctor/effect-needs-cleanup
    const es = new EventSource(
      `${backendUrl}/api/v1/notifications/stream?token=${streamToken}`
    );
    eventSourceRef.current = es;
    connectingRef.current = false;

    es.onopen = () => {
      setConnectionStatus("connected");
      retryCountRef.current = 0;
      startHeartbeat();
    };

    es.onmessage = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data as string) as
          | { type: "connected"; userId: string }
          | Notification;

        // Reset heartbeat timer on any message
        startHeartbeat();

        // Skip the handshake — it has type "connected" and no id
        if ("type" in parsed && parsed.type === "connected") return;

        // Everything else is a Notification object
        const notification = parsed as Notification;
        if (!notification.id) return;

        // Play sound for new notifications if enabled
        if (preferencesRef.current.soundEnabled) {
          playNotificationSound();
        }

        // Show browser notification if enabled
        if (preferencesRef.current.browserNotifications) {
          showBrowserNotification(notification);
        }

        // Update caches
        prependNotification(notification);
        incrementUnreadCount();
        invalidateTaskQueries(notification.type);
        invalidateProjectQueries(notification.type);

        // Notify callback
        onNotification?.(notification);
      } catch (err) {
        console.error("[SSE] Failed to parse message:", err);
      }
    };

    es.onerror = () => {
      stopHeartbeat();
      es.close();
      eventSourceRef.current = null;
      connectingRef.current = false;

      if (!backendToken) {
        setConnectionStatus("disconnected");
        return; // logged out
      }

      // Reconnect with exponential backoff — every attempt mints a fresh
      // single-use token, so a 401 (consumed/expired) self-heals.
      const delay = getExponentialBackoff(retryCountRef.current);
      retryCountRef.current++;
      setConnectionStatus("reconnecting");

      retryTimerRef.current = setTimeout(() => {
        if (backendToken) connectRef.current?.();
      }, delay);
    };
  }, [
    backendToken,
    sseToken,
    prependNotification,
    incrementUnreadCount,
    invalidateTaskQueries,
    invalidateProjectQueries,
    startHeartbeat,
    stopHeartbeat,
    onNotification,
  ]);

  // Keep connectRef in sync
  useEffect(() => {
    connectRef.current = connect;
  });

  // Establish connection when credentials are available
  useEffect(() => {
    if (!backendToken) return;
    let cancelled = false;

    function connectIfNeeded() {
      if (cancelled || !backendToken) return;
      // Only connect if we don't already have a connection
      if (!eventSourceRef.current) {
        connect();
      }
    }

    connectIfNeeded();

    return () => {
      cancelled = true;
      stopHeartbeat();
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      retryCountRef.current = 0;
    };
  }, [backendToken, connect, stopHeartbeat]);


  // Offline/Online detection
  useEffect(() => {
    const handleOnline = () => {
      if (!backendToken) return;
      // Reconnect when coming back online
      if (!eventSourceRef.current) {
        retryCountRef.current = 0;
        connect();
      }
    };

    const handleOffline = () => {
      setConnectionStatus("disconnected");
      stopHeartbeat();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [backendToken, connect, stopHeartbeat]);

  // Visibility change handling
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      if (!backendToken) return;

      // Reconnect when tab becomes visible and connection is lost
      if (!eventSourceRef.current) {
        retryCountRef.current = 0;
        connect();
      } else {
        // Refresh data when tab becomes visible
        qc.invalidateQueries({ queryKey: notificationKeys.all });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [backendToken, connect, qc]);

  return { connectionStatus };
}
