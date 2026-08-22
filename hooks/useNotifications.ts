import { useCallback, useMemo } from "react";
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
  const sseToken = session?.sseToken ?? null;

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
  const {
    mutate: markAsReadMutate,
    isPending: isMarkingAsRead,
  } = useMarkAsRead();
  const {
    mutate: markAllAsReadMutate,
    isPending: isMarkingAllAsRead,
  } = useMarkAllAsRead();
  const {
    mutate: deleteNotificationMutate,
    isPending: isDeletingNotification,
  } = useDeleteNotification();
  const {
    mutate: deleteAllReadMutate,
    isPending: isDeletingAllRead,
  } = useDeleteAllRead();

  // SSE connection
  const { connectionStatus } = useNotificationSSE({ backendToken, sseToken, preferences });

  // Derived state — memoized so consumers (navbar dropdown etc.) get
  // referentially stable values across unrelated re-renders.
  const notifications = useMemo(
    () => data?.pages.flatMap((page) => page?.items ?? []) ?? [],
    [data]
  );
  const unreadCount = unreadCountData?.count ?? 0;

  const markAsRead = useCallback(
    (id: string) => markAsReadMutate(id),
    [markAsReadMutate]
  );
  const markAllAsRead = useCallback(
    () => markAllAsReadMutate(),
    [markAllAsReadMutate]
  );
  const deleteNotification = useCallback(
    (id: string) => deleteNotificationMutate(id),
    [deleteNotificationMutate]
  );
  const deleteAllRead = useCallback(
    () => deleteAllReadMutate(),
    [deleteAllReadMutate]
  );

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
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    isMarkingAsRead,
    isMarkingAllAsRead,
    isDeletingNotification,
    isDeletingAllRead,
  };
}
