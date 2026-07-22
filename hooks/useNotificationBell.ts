import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotifications, ConnectionStatus } from "@/hooks/useNotifications";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string | null;
  createdAt: string;
}

interface NotificationPreferences {
  browserNotifications: boolean;
  soundEnabled: boolean;
}

export function useNotificationBell() {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const {
    notifications,
    unreadCount,
    isLoading,
    connectionStatus,
    preferences,
    markAsRead,
    markAllAsRead,
    isMarkingAllAsRead,
    updatePreferences,
    enableBrowserNotifications,
  } = useNotifications();

  const recentNotifications = notifications.slice(0, 5);
  const badge = unreadCount > 9 ? "9+" : unreadCount > 0 ? unreadCount : null;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    setShowDropdown(false);

    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllAsRead();
  };

  const handleToggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleCloseDropdown = () => {
    setShowDropdown(false);
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getConnectionStatusLabel = (status: ConnectionStatus): string => {
    switch (status) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "reconnecting":
        return "Reconnecting...";
      case "disconnected":
        return "Disconnected";
    }
  };

  const isConnected = connectionStatus === "connected";

  return {
    showDropdown,
    notifications,
    recentNotifications,
    unreadCount,
    badge,
    isLoading,
    isMarkingAllAsRead,
    connectionStatus,
    isConnected,
    connectionStatusLabel: getConnectionStatusLabel(connectionStatus),
    preferences,
    handleToggleDropdown,
    handleCloseDropdown,
    handleNotificationClick,
    handleMarkAllAsRead,
    formatTimeAgo,
    updatePreferences,
    enableBrowserNotifications,
  };
}
