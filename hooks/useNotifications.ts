import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useCallback } from "react";

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
  sender?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

interface NotificationsResponse {
  items: Notification[];
  nextCursor: string | null;
  hasMore: boolean;
}

interface UnreadCountResponse {
  count: number;
}

const EMPTY_PAGE: NotificationsResponse = {
  items: [],
  nextCursor: null,
  hasMore: false,
};

export function useNotifications() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const backendToken = session?.backendToken ?? null;
  const eventSourceRef = useRef<EventSource | null>(null);
  const currentTokenRef = useRef<string | null>(null);
  const connectRef = useRef<(() => void) | null>(null);

  // ── Paginated list ────────────────────────────────────────────────────────
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    NotificationsResponse,
    Error,
    InfiniteData<NotificationsResponse>,
    string[],
    string | undefined
  >({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam }) => {
      try {
        const url = pageParam
          ? `/api/v1/notifications?cursor=${pageParam}`
          : "/api/v1/notifications";
        const response = await api.get<NotificationsResponse>(url);
        console.log("[notifications] raw response:", response);
        return response?.data ?? EMPTY_PAGE;
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        return EMPTY_PAGE;
      }
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    initialPageParam: undefined,
    enabled: !!backendToken,
    retry: 1,
  });

  // ── Unread count ──────────────────────────────────────────────────────────

  const { data: unreadCountData } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      try {
        const response = await api.get<UnreadCountResponse>(
          "/api/v1/notifications/unread-count"
        );
        return response?.data ?? { count: 0 };
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
        return { count: 0 };
      }
    },
    enabled: !!backendToken,
    retry: 1,
  });

  // ── SSE connection ────────────────────────────────────────────────────────
  //
  // Backend stream writes one of two shapes:
  //
  //   Handshake:    data: {"type":"connected","userId":"..."}\n\n
  //   Notification: data: <NotificationPayload JSON>\n\n
  //
  // notification.stream.ts writes `payload.data` directly to the stream
  // (where payload = { type: "notification", data: NotificationPayload }).
  // So the raw SSE data IS the notification object — it has id, type, title,
  // message, read, createdAt etc. at the top level, NOT nested under .data.
  //
  // The only field that distinguishes the handshake from a real notification
  // is that the handshake has `type === "connected"` and no `id` field.

  // Helper to connect with current token
  const connect = useCallback(() => {
    if (!backendToken) return;

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // Close existing connection if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    const es = new EventSource(
      `${backendUrl}/api/v1/notifications/stream?token=${backendToken}`
    );
    eventSourceRef.current = es;
    currentTokenRef.current = backendToken;

    es.onmessage = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data as string) as
          | { type: "connected"; userId: string }
          | Notification;

        // Skip the handshake — it has type "connected" and no id
        if ("type" in parsed && parsed.type === "connected") return;

        // Everything else is a Notification object
        const notification = parsed as Notification;
        if (!notification.id) return;

        // Prepend to first page — prevents duplicates on refetch
        qc.setQueryData<InfiniteData<NotificationsResponse>>(
          ["notifications"],
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

        // Increment badge count
        qc.setQueryData<UnreadCountResponse>(
          ["notifications", "unread-count"],
          (old) => ({ count: (old?.count ?? 0) + 1 })
        );
      } catch (err) {
        console.error("[SSE] Failed to parse message:", err);
      }
    };

    es.onerror = (err: Event) => {
      // Check if error is due to token expiry (401/403)
      // EventSource doesn't expose status code, but we can detect
      // by checking if the token was refreshed
      es.close();
      eventSourceRef.current = null;

      // If token was refreshed, reconnect immediately with new token
      // Otherwise use exponential backoff
      const wasTokenRefreshed = currentTokenRef.current !== backendToken;
      
      if (!backendToken) return; // logged out
      
      if (wasTokenRefreshed) {
        console.log("[SSE] Token refreshed, reconnecting with new token");
        // Small delay to ensure session is updated
        setTimeout(() => connectRef.current?.(), 100);
      } else {
        // Regular reconnect with backoff
        setTimeout(() => {
          if (backendToken) connectRef.current?.();
        }, 5_000);
      }
    };
  }, [backendToken, qc]);

  useEffect(() => {
    connectRef.current = connect;
  });

  // Establish connection when token is available
  useEffect(() => {
    if (!backendToken) return;
    let cancelled = false;

    function connectIfNeeded() {
      if (cancelled || !backendToken) return;
      // Only connect if we don't already have a connection for this token
      if (currentTokenRef.current !== backendToken) {
        connect();
      }
    }

    connectIfNeeded();

    // Also reconnect when token changes (due to refresh)
    // We use a separate effect with backendToken as dependency to trigger reconnect
    // when the token is refreshed (NextAuth updates session.backendToken)
    
    return () => {
      cancelled = true;
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      currentTokenRef.current = null;
    };
  }, [backendToken, connect, qc]);

  // Separate effect to handle token refresh - triggers reconnect when backendToken changes
  useEffect(() => {
    if (!backendToken) return;
    
    // If we have an existing connection with a different token, reconnect
    if (eventSourceRef.current && currentTokenRef.current !== backendToken) {
      console.log("[SSE] Token changed, reconnecting...");
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      connect();
    }
  }, [backendToken, connect]);

  // ── Mutations ─────────────────────────────────────────────────────────────

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.patch(`/api/v1/notifications/${notificationId}/read`);
      return response?.data;
    },
    onSuccess: (_, notificationId) => {
      qc.setQueryData<InfiniteData<NotificationsResponse>>(
        ["notifications"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((n) =>
                n.id === notificationId
                  ? { ...n, read: true, readAt: new Date().toISOString() }
                  : n
              ),
            })),
          };
        }
      );
      qc.setQueryData<UnreadCountResponse>(
        ["notifications", "unread-count"],
        (old) => ({ count: Math.max(0, (old?.count ?? 1) - 1) })
      );
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await api.patch("/api/v1/notifications/read-all");
      return response?.data;
    },
    onSuccess: () => {
      qc.setQueryData<InfiniteData<NotificationsResponse>>(
        ["notifications"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((n) => ({
                ...n,
                read: true,
                readAt: new Date().toISOString(),
              })),
            })),
          };
        }
      );
      qc.setQueryData<UnreadCountResponse>(
        ["notifications", "unread-count"],
        { count: 0 }
      );
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await api.delete(`/api/v1/notifications/${notificationId}`);
      return notificationId;
    },
    onSuccess: (notificationId) => {
      qc.setQueryData<InfiniteData<NotificationsResponse>>(
        ["notifications"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.filter((n) => n.id !== notificationId),
            })),
          };
        }
      );
      qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  const deleteAllReadMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete("/api/v1/notifications/read/all");
      return response?.data;
    },
    onSuccess: () => {
      qc.setQueryData<InfiniteData<NotificationsResponse>>(
        ["notifications"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.filter((n) => !n.read),
            })),
          };
        }
      );
    },
  });

  // ── Derived state ─────────────────────────────────────────────────────────

  const notifications = data?.pages.flatMap((page) => page?.items ?? []) ?? [];
  const unreadCount = unreadCountData?.count ?? 0;

  return {
    notifications,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    unreadCount,
    markAsRead: (id: string) => markAsReadMutation.mutate(id),
    markAllAsRead: () => markAllAsReadMutation.mutate(),
    deleteNotification: (id: string) => deleteNotificationMutation.mutate(id),
    deleteAllRead: () => deleteAllReadMutation.mutate(),
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isDeletingNotification: deleteNotificationMutation.isPending,
    isDeletingAllRead: deleteAllReadMutation.isPending,
  };
}