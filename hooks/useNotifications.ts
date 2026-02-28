// frontend/src/hooks/useNotifications.ts
//
// SSE connects to /api/notifications/stream?token=<accessToken>
// Backend verifies the token and extracts userId server-side.
// The client never decides which userId's notifications it receives.

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


const EMPTY_PAGE: NotificationsResponse = { items: [], nextCursor: null, hasMore: false };

export function useNotifications() {
  const queryClient       = useQueryClient();
  const { data: session } = useSession();
  const eventSourceRef    = useRef<EventSource | null>(null);

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
        return response?.data ?? EMPTY_PAGE;
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        return EMPTY_PAGE;
      }
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    initialPageParam: undefined,
    enabled:          !!session,
    retry:            1,
  });

  const { data: unreadCountData } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      try {
        const response = await api.get<UnreadCountResponse>(
          "/api/notifications/unread-count"
        );
        return response?.data ?? { count: 0 };
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
        return { count: 0 };
      }
    },
    enabled: !!session,
    retry:   1,
  });

  const backendToken = session?.backendToken ?? null;

  useEffect(() => {
    if (!backendToken) return;
    let cancelled = false;

    function connect() {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const es = new EventSource(
        `${backendUrl}/api/notifications/stream?token=${backendToken}`
      );
      eventSourceRef.current = es;

      es.onopen = () => {
        console.log("✅ SSE connected");
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "connected") return;

          const notification = data as Notification;

          queryClient.setQueryData<InfiniteData<NotificationsResponse>>(
            ["notifications"],
            (old) => {
              if (!old) {
                return {
                  pages:      [{ items: [notification], nextCursor: null, hasMore: false }],
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

          queryClient.setQueryData<UnreadCountResponse>(
            ["notifications", "unread-count"],
            (old) => ({ count: (old?.count ?? 0) + 1 })
          );
        } catch (err) {
          console.error("❌ Error parsing SSE notification:", err);
        }
      };

      es.onerror = () => {
        es.close();
        eventSourceRef.current = null;
        if (!cancelled) {
          setTimeout(() => { if (!cancelled) connect(); }, 5000);
        }
      };
    }

    connect();

    return () => {
      cancelled = true;
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, [backendToken, queryClient]);


  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.patch(`/api/notifications/${notificationId}/read`);
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
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
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


  const notifications = data?.pages.flatMap((page) => page?.items ?? []) ?? [];
  const unreadCount   = unreadCountData?.count ?? 0;

  return {
    notifications,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    unreadCount,
    markAsRead:             (id: string) => markAsReadMutation.mutate(id),
    markAllAsRead:          () => markAllAsReadMutation.mutate(),
    deleteNotification:     (id: string) => deleteNotificationMutation.mutate(id),
    deleteAllRead:          () => deleteAllReadMutation.mutate(),
    isMarkingAsRead:        markAsReadMutation.isPending,
    isMarkingAllAsRead:     markAllAsReadMutation.isPending,
    isDeletingNotification: deleteNotificationMutation.isPending,
    isDeletingAllRead:      deleteAllReadMutation.isPending,
  };
}