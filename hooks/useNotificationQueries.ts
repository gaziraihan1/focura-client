import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import {
  NotificationsResponse,
  UnreadCountResponse,
  EMPTY_PAGE,
} from "@/types/notification.types";
import { notificationKeys } from "./notificationKeys";

export function useNotificationList(backendToken: string | null) {
  return useInfiniteQuery<
    NotificationsResponse,
    Error,
    { pages: NotificationsResponse[]; pageParams: (string | undefined)[] },
    string[],
    string | undefined
  >({
    queryKey: notificationKeys.list(),
    queryFn: async ({ pageParam }) => {
      try {
        const url = pageParam
          ? `/api/v1/notifications?cursor=${pageParam}`
          : "/api/v1/notifications";
        const response = await api.get<NotificationsResponse>(url);
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
}

export function useUnreadCount(backendToken: string | null) {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
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
}
