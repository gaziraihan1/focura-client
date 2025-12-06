"use client";

import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationBell() {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    isMarkingAllAsRead,
  } = useNotifications();

  const recentNotifications = notifications.slice(0, 5);
  const badge = unreadCount > 9 ? "9+" : unreadCount > 0 ? unreadCount : null;

  const handleNotificationClick = (notification: typeof notifications[0]) => {
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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Icon Button */}
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className="relative p-2 rounded-lg hover:bg-accent transition"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-foreground" />

        {badge && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow">
            {badge}
          </span>
        )}
      </button>

      {/* Overlay */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowDropdown(false)}
        />
      )}

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-popover border border-border rounded-xl shadow-lg z-40 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAllAsRead}
                className="text-xs text-primary hover:text-primary/80 disabled:opacity-50 flex items-center gap-1 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Content */}
          <div className="max-h-[450px] overflow-y-auto">
            {/* Loading Skeleton */}
            {isLoading && (
              <>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 border-b border-border animate-pulse"
                  >
                    <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-muted rounded w-full mb-2"></div>
                    <div className="h-2 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </>
            )}

            {/* No Notifications */}
            {!isLoading && notifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                <p className="text-sm font-medium text-muted-foreground">
                  No notifications yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  We&apos;ll notify you when something happens
                </p>
              </div>
            )}

            {/* Notification Items */}
            {!isLoading &&
              recentNotifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left p-4 border-b border-border transition-colors ${
                    !notification.read
                      ? "bg-accent/30 hover:bg-accent/40"
                      : "hover:bg-accent/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 text-center border-t border-border">
              <Link
                href="/dashboard/notifications"
                className="text-sm text-primary hover:underline font-medium"
                onClick={() => setShowDropdown(false)}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}