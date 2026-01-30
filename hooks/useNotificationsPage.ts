import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/useNotifications";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string | null;
  sender?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export function useNotificationsPage() {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    notifications,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    isMarkingAllAsRead,
    isDeletingAllRead,
  } = useNotifications();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleDeleteAllRead = () => {
    deleteAllRead();
    setShowDeleteConfirm(false);
  };

  const hasReadNotifications = notifications.some((n) => n.read);

  return {
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
  };
}