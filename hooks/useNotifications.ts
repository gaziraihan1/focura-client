import { useSession } from "next-auth/react";

import { useNotificationPreferencesState } from "./useNotificationPreferences";
import { useNotificationList, useUnreadCount } from "./useNotificationQueries";
import {
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
  useDeleteAllRead,
} from "./useNotificationMutations";
import { useNotificationSSE } from "./useNotificationSSE";

// Re-export types for backward compatibility
export type {
  Notification,
  NotificationsResponse,
  UnreadCountResponse,
  ConnectionStatus,
  NotificationPreferences,
} from "@/types/notification.types";

export { notificationKeys } from "./notificationKeys";

export function useNotifications() {
  const { data: session } = useSession();
  const backendToken = session?.backendToken ?? null;

  // Preferences
  const {
    preferences,
    updatePreferences,
    enableBrowserNotifications,
  } = useNotificationPreferencesState();

  // Queries
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotificationList(backendToken);

  const { data: unreadCountData } = useUnreadCount(backendToken);

  // Mutations
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteNotificationMutation = useDeleteNotification();
  const deleteAllReadMutation = useDeleteAllRead();

  // SSE connection
  const { connectionStatus } = useNotificationSSE({ backendToken, preferences });

  // Derived state
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
    connectionStatus,
    preferences,
    updatePreferences,
    enableBrowserNotifications,
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
