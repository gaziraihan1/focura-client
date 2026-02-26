// hooks/useNotifications.ts
// FIXES:
//   1. SSE no longer uses token in URL (stream is public, just needs userId)
//   2. "no existing notification data" — setQueryData now uses the correct
//      infinite query key format ["notifications"] with initialPageParam
//   3. SSE connection is stable — doesn't reconnect on every render
//   4. Removed refetchInterval (SSE handles real-time updates)

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

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

// Stable empty page — used as fallback when cache is not yet populated
const EMPTY_PAGE: NotificationsResponse = { items: [], nextCursor: null, hasMore: false };

export function useNotifications() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Notifications infinite query ────────────────────────────────────────
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
          ? `/api/notifications?cursor=${pageParam}`
          : "/api/notifications";
        const response = await api.get<NotificationsResponse>(url);
        return response.data ?? EMPTY_PAGE;
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        return EMPTY_PAGE;
      }
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    initialPageParam: undefined,
    enabled: !!session,
    retry: 1,
    // No refetchInterval — SSE handles real-time updates
  });

  // ─── Unread count query ───────────────────────────────────────────────────
  const { data: unreadCountData } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      try {
        const response = await api.get<UnreadCountResponse>(
          "/api/notifications/unread-count"
        );
        return response.data ?? { count: 0 };
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
        return { count: 0 };
      }
    },
    enabled: !!session,
    retry: 1,
  });

  // ─── SSE connection ───────────────────────────────────────────────────────
  // Depends only on userId — no token needed, stream is public
  const userId = session?.user?.id ?? null;

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    function connect() {
      if (cancelled) return;

      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const es = new EventSource(
        `${backendUrl}/api/notifications/stream/${userId}`
      );
      eventSourceRef.current = es;

      es.onopen = () => {
        console.log("✅ SSE connected for user:", userId);
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Skip the initial connection confirmation message
          if (data.type === "connected") return;

          const notification = data as Notification;

          // Prepend new notification to the first page of the infinite query.
          // We MUST check if the cache exists first and initialise it if not.
          queryClient.setQueryData<InfiniteData<NotificationsResponse>>(
            ["notifications"],
            (old) => {
              if (!old) {
                // Cache not populated yet — create a minimal structure
                return {
                  pages:     [{ items: [notification], nextCursor: null, hasMore: false }],
                  pageParams: [undefined],
                };
              }

              return {
                ...old,
                pages: old.pages.map((page, index) => {
                  if (index === 0) {
                    return { ...page, items: [notification, ...page.items] };
                  }
                  return page;
                }),
              };
            }
          );

          // Bump unread count by 1 without a refetch
          queryClient.setQueryData<UnreadCountResponse>(
            ["notifications", "unread-count"],
            (old) => ({ count: (old?.count ?? 0) + 1 })
          );
        } catch (err) {
          console.error("❌ Error parsing SSE notification:", err);
        }
      };

      es.onerror = () => {
        console.warn("⚠️ SSE connection lost — reconnecting in 5s...");
        es.close();
        eventSourceRef.current = null;
        if (!cancelled) {
          retryTimer.current = setTimeout(() => {
            if (!cancelled) connect();
          }, 5000);
        }
      };
    }

    connect();

    return () => {
      cancelled = true;
      if (retryTimer.current) clearTimeout(retryTimer.current);
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, [userId, queryClient]);

  // ─── Mutations ────────────────────────────────────────────────────────────

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.patch(
        `/api/notifications/${notificationId}/read`
      );
      return response.data;
    },
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData<InfiniteData<NotificationsResponse>>(
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
      // Decrement unread count by 1
      queryClient.setQueryData<UnreadCountResponse>(
        ["notifications", "unread-count"],
        (old) => ({ count: Math.max(0, (old?.count ?? 1) - 1) })
      );
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await api.patch("/api/notifications/read-all");
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData<InfiniteData<NotificationsResponse>>(
        ["notifications"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((n) => ({
                ...n,
                read:   true,
                readAt: new Date().toISOString(),
              })),
            })),
          };
        }
      );
      queryClient.setQueryData<UnreadCountResponse>(
        ["notifications", "unread-count"],
        { count: 0 }
      );
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await api.delete(`/api/notifications/${notificationId}`);
      return notificationId;
    },
    onSuccess: (notificationId) => {
      queryClient.setQueryData<InfiniteData<NotificationsResponse>>(
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
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });

  const deleteAllReadMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete("/api/notifications/read/all");
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData<InfiniteData<NotificationsResponse>>(
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

  // ─── Derived values ───────────────────────────────────────────────────────

  const notifications =
    data?.pages.flatMap((page) => page?.items ?? []) ?? [];
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
    markAsRead:              (id: string) => markAsReadMutation.mutate(id),
    markAllAsRead:           () => markAllAsReadMutation.mutate(),
    deleteNotification:      (id: string) => deleteNotificationMutation.mutate(id),
    deleteAllRead:           () => deleteAllReadMutation.mutate(),
    isMarkingAsRead:         markAsReadMutation.isPending,
    isMarkingAllAsRead:      markAllAsReadMutation.isPending,
    isDeletingNotification:  deleteNotificationMutation.isPending,
    isDeletingAllRead:       deleteAllReadMutation.isPending,
  };
}