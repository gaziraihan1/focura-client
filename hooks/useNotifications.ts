/**
 * hooks/useNotifications.ts
 *
 * Changes from previous version
 * ──────────────────────────────
 * 1. SSE onmessage data unwrapping: the stream now sends
 *      data: {"type":"notification","data":{...notificationObject}}
 *    so we read `parsed.data` instead of treating the whole parsed object
 *    as the notification.
 *
 *    The "connected" handshake is:
 *      data: {"type":"connected","userId":"..."}
 *    which we still skip by checking parsed.type === "connected".
 *
 * Everything else (infinite query, mutations, optimistic updates, reconnect
 * logic) is identical to the working original.
 */

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
          ? `/api/notifications?cursor=${pageParam}`
          : "/api/notifications";
        const response = await api.get<{ success: boolean; data: NotificationsResponse }>(url);
        return response?.data?.data ?? EMPTY_PAGE;
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
        const response = await api.get<{ success: boolean; data: UnreadCountResponse }>(
          "/api/notifications/unread-count"
        );
        return response?.data?.data ?? { count: 0 };
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
        return { count: 0 };
      }
    },
    enabled: !!backendToken,
    retry: 1,
  });

  // ── SSE connection ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!backendToken) return;
    let cancelled = false;

    function connect() {
      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const es = new EventSource(
        `${backendUrl}/api/notifications/stream?token=${backendToken}`
      );
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        try {
          // Payload shape: { type: "connected" | "notification", data?: Notification }
          const parsed = JSON.parse(event.data) as {
            type: string;
            data?: Notification;
            userId?: string;
          };

          // Skip the initial handshake
          if (parsed.type === "connected") return;

          // All other messages carry the notification in parsed.data
          const notification = parsed.data;
          if (!notification) return;

          // Prepend to first page of the infinite query cache
          qc.setQueryData<InfiniteData<NotificationsResponse>>(
            ["notifications"],
            (old) => {
              if (!old) {
                return {
                  pages: [
                    {
                      items: [notification],
                      nextCursor: null,
                      hasMore: false,
                    },
                  ],
                  pageParams: [undefined],
                };
              }
              return {
                ...old,
                pages: old.pages.map((page, index) =>
                  index === 0
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
          console.error("Error parsing SSE notification:", err);
        }
      };

      es.onerror = () => {
        es.close();
        eventSourceRef.current = null;
        if (!cancelled) {
          setTimeout(() => {
            if (!cancelled) connect();
          }, 5_000);
        }
      };
    }

    connect();

    return () => {
      cancelled = true;
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, [backendToken, qc]);

  // ── Mutations ─────────────────────────────────────────────────────────────

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.patch(
        `/api/notifications/${notificationId}/read`
      );
      return response.data;
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
      const response = await api.patch("/api/notifications/read-all");
      return response.data;
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
      await api.delete(`/api/notifications/${notificationId}`);
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
      const response = await api.delete("/api/notifications/read/all");
      return response.data;
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
    markAsRead: (id: string) => markAsReadMutation.mutate(id),
    markAllAsRead: () => markAllAsReadMutation.mutate(),
    deleteNotification: (id: string) =>
      deleteNotificationMutation.mutate(id),
    deleteAllRead: () => deleteAllReadMutation.mutate(),
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isDeletingNotification: deleteNotificationMutation.isPending,
    isDeletingAllRead: deleteAllReadMutation.isPending,
  };
}