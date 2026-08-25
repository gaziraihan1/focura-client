"use client";

import { NotificationsPageHeader } from "@/components/dashboard/notifications/NotificationsPageHeader";
import { NotificationsContent } from "@/components/dashboard/notifications/NotificationsContent";
import { DeleteNotificationsDialog } from "@/components/dashboard/notifications/DeleteNotificationsDialog";
import { useNotificationsPage } from "@/hooks/useNotificationsPage";

export function NotificationsPageContent() {
  const {
    notifications,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    unreadCount,
    hasReadNotifications,
    isMarkingAllAsRead,
    isDeletingAllRead,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleNotificationClick,
    handleMarkAllAsRead,
    handleDeleteAllRead,
    deleteNotification,
  } = useNotificationsPage();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <NotificationsPageHeader
        unreadCount={unreadCount}
        hasReadNotifications={hasReadNotifications}
        isMarkingAllAsRead={isMarkingAllAsRead}
        isDeletingAllRead={isDeletingAllRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDeleteAllRead={() => setShowDeleteConfirm(true)}
      />

      <NotificationsContent
        notifications={notifications}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onNotificationClick={handleNotificationClick}
        onNotificationDelete={deleteNotification}
        onLoadMore={fetchNextPage}
      />

      <DeleteNotificationsDialog
        isOpen={showDeleteConfirm}
        isPending={isDeletingAllRead}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAllRead}
      />
    </div>
  );
}
