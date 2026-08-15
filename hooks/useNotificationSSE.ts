"use client";

import { useQueryClient, QueryClient, InfiniteData } from "@tanstack/react-query";
import { useEffect, useRef, useSyncExternalStore } from "react";
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

interface SseManagerConfig {
  backendToken: string | null;
  sseToken: string | null;
  qc: QueryClient;
  preferences: NotificationPreferences;
  onNotification?: (notification: Notification) => void;
}

// Module-level singleton: the bell and the notifications page both mount
// useNotificationSSE, so they share one EventSource per session. A per-hook
// EventSource meant duplicate streams — double unread increments, double
// sounds and double browser notifications for every server event. The stream
// is kept alive while at least one subscriber is mounted and torn down (with
// timers cleared) when the last one detaches.
let activeConfig: SseManagerConfig | null = null;
let eventSource: EventSource | null = null;
let connecting = false;
let retryCount = 0;
let retryTimer: NodeJS.Timeout | null = null;
let heartbeatTimer: NodeJS.Timeout | null = null;
let currentStatus: ConnectionStatus = "disconnected";
let refCount = 0;
const statusListeners = new Set<() => void>();

function emitStatus(status: ConnectionStatus) {
  currentStatus = status;
  statusListeners.forEach((listener) => listener());
}

function clearRetryTimer() {
  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }
}

function stopHeartbeat() {
  if (heartbeatTimer) {
    clearTimeout(heartbeatTimer);
    heartbeatTimer = null;
  }
}

function startHeartbeat() {
  stopHeartbeat();
  heartbeatTimer = setTimeout(() => {
    // No message received in HEARTBEAT_TIMEOUT - connection may be stale
    if (eventSource) {
      eventSource.close();
      eventSource = null;
      emitStatus("reconnecting");
      connect();
    }
  }, HEARTBEAT_TIMEOUT);
}

// Cache update helpers
function prependNotification(notification: Notification) {
  const qc = activeConfig?.qc;
  if (!qc) return;
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
}

function incrementUnreadCount() {
  const qc = activeConfig?.qc;
  if (!qc) return;
  qc.setQueryData<UnreadCountResponse>(
    notificationKeys.unreadCount(),
    (old) => ({ count: (old?.count ?? 0) + 1 })
  );
}

function invalidateTaskQueries(notificationType: string) {
  if (TASK_NOTIFICATION_TYPES.includes(notificationType as typeof TASK_NOTIFICATION_TYPES[number])) {
    activeConfig?.qc.invalidateQueries({ queryKey: ["tasks"] });
  }
}

function invalidateProjectQueries(notificationType: string) {
  if (PROJECT_NOTIFICATION_TYPES.includes(notificationType as typeof PROJECT_NOTIFICATION_TYPES[number])) {
    activeConfig?.qc.invalidateQueries({ queryKey: ["projects"] });
  }
}

async function connect() {
  if (!activeConfig?.backendToken || connecting) return;
  // In-flight guard: connect() is fired from several paths (mount, onerror
  // backoff, heartbeat, online/visibility). Without this, overlapping calls
  // during the mint await would each open a stream and the last would clobber
  // the rest — leaving orphaned connections and duplicate notifications.
  connecting = true;

  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Close existing connection if any
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }

  emitStatus(retryCount > 0 ? "reconnecting" : "connecting");

  // Each connection needs a brand-new single-use token — a reused one is
  // rejected with 401 TOKEN_REUSED. Mint a fresh token (fallback: session).
  const streamToken =
    (await fetchFreshSseToken()) ?? activeConfig?.sseToken ?? null;
  // Detached (last subscriber gone) while awaiting — stop before opening.
  if (!activeConfig) {
    connecting = false;
    return;
  }
  if (!streamToken) {
    // No token yet (session warming up / backend unreachable) — retry with backoff
    connecting = false;
    retryCount++;
    emitStatus("reconnecting");
    clearRetryTimer();
    retryTimer = setTimeout(
      () => connect(),
      getExponentialBackoff(retryCount),
    );
    return;
  }

  const es = new EventSource(
    `${backendUrl}/api/v1/notifications/stream?token=${streamToken}`
  );
  eventSource = es;
  connecting = false;

  es.onopen = () => {
    if (!activeConfig) {
      es.close();
      return;
    }
    emitStatus("connected");
    retryCount = 0;
    startHeartbeat();
  };

  es.onmessage = (event: MessageEvent) => {
    if (!activeConfig) return;
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
      if (activeConfig.preferences.soundEnabled) {
        playNotificationSound();
      }

      // Show browser notification if enabled
      if (activeConfig.preferences.browserNotifications) {
        showBrowserNotification(notification);
      }

      // Update caches
      prependNotification(notification);
      incrementUnreadCount();
      invalidateTaskQueries(notification.type);
      invalidateProjectQueries(notification.type);

      // Notify callback
      activeConfig.onNotification?.(notification);
    } catch (err) {
      console.error("[SSE] Failed to parse message:", err);
    }
  };

  es.onerror = () => {
    stopHeartbeat();
    es.close();
    if (eventSource === es) {
      eventSource = null;
    }
    connecting = false;

    if (!activeConfig?.backendToken) {
      emitStatus("disconnected");
      return; // logged out or detached — stop retrying
    }

    // Reconnect with exponential backoff — every attempt mints a fresh
    // single-use token, so a 401 (consumed/expired) self-heals.
    const delay = getExponentialBackoff(retryCount);
    retryCount++;
    emitStatus("reconnecting");

    clearRetryTimer();
    retryTimer = setTimeout(() => {
      if (activeConfig?.backendToken) connect();
    }, delay);
  };
}

function connectIfNeeded() {
  if (!activeConfig?.backendToken || connecting || eventSource) return;
  connect();
}

function attach(config: SseManagerConfig) {
  const isNewSession =
    !activeConfig ||
    activeConfig.backendToken !== config.backendToken ||
    activeConfig.sseToken !== config.sseToken;
  activeConfig = config;
  refCount++;
  if (isNewSession) {
    retryCount = 0;
    connect();
  }
}

function detach() {
  refCount = Math.max(0, refCount - 1);
  if (refCount === 0) {
    clearRetryTimer();
    stopHeartbeat();
    eventSource?.close();
    eventSource = null;
    connecting = false;
    retryCount = 0;
    activeConfig = null;
    emitStatus("disconnected");
  }
}

export function useNotificationSSE({
  backendToken,
  sseToken,
  preferences,
  onNotification,
}: UseNotificationSSEOptions) {
  const qc = useQueryClient();
  const connectionStatus = useSyncExternalStore(
    (onStoreChange) => {
      statusListeners.add(onStoreChange);
      return () => {
        statusListeners.delete(onStoreChange);
      };
    },
    () => currentStatus
  );
  const preferencesRef = useRef(preferences);
  const onNotificationRef = useRef(onNotification);

  // Keep preferences and onNotification fresh without re-connecting.
  useEffect(() => {
    preferencesRef.current = preferences;
    if (activeConfig) {
      activeConfig.preferences = preferences;
    }
  }, [preferences]);

  useEffect(() => {
    onNotificationRef.current = onNotification;
    if (activeConfig) {
      activeConfig.onNotification = onNotification;
    }
  }, [onNotification]);

  // Register with the shared connection. It stays alive while at least one
  // subscriber (bell, notifications page) is mounted.
  useEffect(() => {
    attach({
      backendToken,
      sseToken,
      qc,
      preferences: preferencesRef.current,
      onNotification: onNotificationRef.current,
    });
    return () => {
      detach();
    };
  }, [backendToken, sseToken, qc]);

  // Offline/Online detection
  useEffect(() => {
    const handleOnline = () => {
      if (!activeConfig?.backendToken) return;
      // Reconnect when coming back online
      retryCount = 0;
      connectIfNeeded();
    };

    const handleOffline = () => {
      emitStatus("disconnected");
      stopHeartbeat();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Visibility change handling
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      if (!activeConfig?.backendToken) return;

      // Reconnect when tab becomes visible and connection is lost
      if (!eventSource) {
        retryCount = 0;
        connectIfNeeded();
      } else {
        // Refresh data when tab becomes visible
        qc.invalidateQueries({ queryKey: notificationKeys.all });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [qc]);

  return { connectionStatus };
}
