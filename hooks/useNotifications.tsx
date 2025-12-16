import { useInfiniteQuery, useMutation, useQuery, useQueryClient, InfiniteData } from "@tanstack/react-query";
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

export function useNotifications() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const eventSourceRef = useRef<EventSource | null>(null);

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
        
        if (!response.data) {
          console.warn('No data returned from notifications API');
          return { items: [], nextCursor: null, hasMore: false };
        }
        
        return response.data;
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        return { items: [], nextCursor: null, hasMore: false };
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor ?? undefined;
    },
    initialPageParam: undefined,
    enabled: !!session,
    refetchInterval: 30000,
    retry: 1,
  });

  const { data: unreadCountData } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      try {
        const response = await api.get<UnreadCountResponse>("/api/notifications/unread-count");
        
        if (!response.data) {
          console.warn('No data returned from unread count API');
          return { count: 0 };
        }
        
        return response.data;
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
        return { count: 0 };
      }
    },
    enabled: !!session,
    refetchInterval: 30000,
    retry: 1,
  });

  useEffect(() => {
    if (!session?.user) {
      console.log("⚠️ No session, skipping SSE connection");
      return;
    }

    const userId = (session.user as any).id;
    const token = (session as any)?.backendToken;

    if (!userId || !token) {
      console.warn("❌ Missing userId or backendToken for SSE");
      return;
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const sseUrl = `${backendUrl}/api/notifications/stream/${userId}?token=${token}`;
    

    const eventSource = new EventSource(sseUrl);

    eventSource.onopen = () => {
      console.log("✅ SSE connection opened");
    };

    eventSource.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);

        if (notification.connected) {
          console.log("✅ SSE connected successfully:", notification);
          return;
        }

        console.log("📬 New notification received:", notification);

        queryClient.setQueryData(["notifications"], (old: any) => {
          if (!old) {
            console.warn("No existing notification data");
            return old;
          }

          return {
            ...old,
            pages: old.pages.map(
              (page: NotificationsResponse, index: number) => {
                if (index === 0) {
                  return {
                    ...page,
                    items: [notification, ...page.items],
                  };
                }
                return page;
              }
            ),
          };
        });

        queryClient.invalidateQueries({
          queryKey: ["notifications", "unread-count"],
        });

        console.log("📬 Notification added to cache:", notification.title);
      } catch (error) {
        console.error("❌ Error parsing SSE notification:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("❌ SSE connection error:", error);
      
      if (eventSource.readyState === 2) {
        console.log("SSE connection closed, will retry automatically");
      }
      
    };

    eventSourceRef.current = eventSource;

    return () => {
      console.log("🔴 Closing SSE connection");
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, [session, queryClient]);

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.patch(`/api/notifications/${notificationId}/read`);
      return response.data;
    },
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData(["notifications"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: NotificationsResponse) => ({
            ...page,
            items: page.items.map((notification) =>
              notification.id === notificationId
                ? { ...notification, read: true, readAt: new Date().toISOString() }
                : notification
            ),
          })),
        };
      });

      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await api.patch("/api/notifications/read-all");
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["notifications"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: NotificationsResponse) => ({
            ...page,
            items: page.items.map((notification) => ({
              ...notification,
              read: true,
              readAt: new Date().toISOString(),
            })),
          })),
        };
      });

      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await api.delete(`/api/notifications/${notificationId}`);
      return notificationId;
    },
    onSuccess: (notificationId) => {
      queryClient.setQueryData(["notifications"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: NotificationsResponse) => ({
            ...page,
            items: page.items.filter((notification) => notification.id !== notificationId),
          })),
        };
      });

      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  const deleteAllReadMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete("/api/notifications/read/all");
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["notifications"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: NotificationsResponse) => ({
            ...page,
            items: page.items.filter((notification) => !notification.read),
          })),
        };
      });

      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

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