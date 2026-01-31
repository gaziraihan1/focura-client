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
    handleToggleDropdown,
    handleCloseDropdown,
    handleNotificationClick,
    handleMarkAllAsRead,
    formatTimeAgo,
  } = useNotificationBell();

  return (
    <div className="relative">
      <NotificationBellButton badge={badge} onClick={handleToggleDropdown} />

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