"use client";

import { NotificationBellButton } from "./NotificationBellButton";
import { NotificationDropdown } from "./NotificationDropdown";
import { useNotificationBell } from "@/hooks/useNotificationBell";

export default function NotificationBell() {
  const {
    showDropdown,
    notifications,
    recentNotifications,
    unreadCount,
    badge,
    isLoading,
    isMarkingAllAsRead,
    connectionStatus,
    isConnected,
    connectionStatusLabel,
    handleToggleDropdown,
    handleCloseDropdown,
    handleNotificationClick,
    handleMarkAllAsRead,
    formatTimeAgo,
  } = useNotificationBell();

  return (
    <div className="relative">
      <NotificationBellButton badge={badge} onClick={handleToggleDropdown} />

      {/* Connection status indicator */}
      {!isConnected && connectionStatus !== "connecting" && (
        <span
          className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-500"
          aria-label={connectionStatusLabel}
          title={connectionStatusLabel}
        />
      )}

      {showDropdown && (
        <div className="fixed inset-0 z-30" onClick={handleCloseDropdown} />
      )}

      {showDropdown && (
        <NotificationDropdown
          notifications={notifications}
          recentNotifications={recentNotifications}
          unreadCount={unreadCount}
          isLoading={isLoading}
          isMarkingAllAsRead={isMarkingAllAsRead}
          formatTimeAgo={formatTimeAgo}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClose={handleCloseDropdown}
        />
      )}
    </div>
  );
}
