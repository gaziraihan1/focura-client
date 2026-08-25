"use client";

import { useRef, useEffect } from "react";
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

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleCloseDropdown();
      }
    };

    // Use mousedown to catch the event before it's absorbed by the dropdown
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown, handleCloseDropdown]);

  return (
    <div ref={containerRef} className="relative">
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
