// app/dashboard/notifications/page.tsx
"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { Bell, CheckCheck, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from 'date-fns';
import { useState } from "react";

export default function NotificationsPage() {
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

  const handleNotificationClick = (notification: typeof notifications[0]) => {
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6" />
          <h1 className="text-2xl font-semibold">Notifications</h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAllAsRead}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isMarkingAllAsRead ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCheck className="w-4 h-4" />
              )}
              Mark all as read
            </button>
          )}

          {notifications.some((n) => n.read) && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeletingAllRead}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-destructive/10 hover:text-destructive hover:border-destructive disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isDeletingAllRead ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Clear read
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-popover border border-border rounded-xl p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Delete Read Notifications?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              This will permanently delete all read notifications. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllRead}
                disabled={isDeletingAllRead}
                className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isDeletingAllRead && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {/* Loading Skeleton */}
        {isLoading && (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-muted animate-pulse h-24"
              />
            ))}
          </>
        )}

        {/* Empty State */}
        {!isLoading && notifications.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-lg font-medium text-muted-foreground">
              No notifications yet
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              We&apos;ll notify you when something important happens
            </p>
          </div>
        )}

        {/* Notification Items */}
        {!isLoading &&
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`group relative p-4 rounded-xl border transition-all ${
                !notification.read
                  ? "bg-accent/30 border-accent hover:bg-accent/40"
                  : "bg-card border-border hover:bg-accent/20"
              }`}
            >
              <button
                onClick={() => handleNotificationClick(notification)}
                className="w-full text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium line-clamp-1">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      {notification.sender && (
                        <>
                          <span>•</span>
                          <span>from {notification.sender.name}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </button>
            </div>
          ))}

        {/* Load More Button */}
        {!isLoading && hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full py-3 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </button>
        )}

        {/* End of List Message */}
        {!isLoading && notifications.length > 0 && !hasNextPage && (
          <p className="text-center text-sm text-muted-foreground py-4">
            You&apos;ve reached the end of your notifications
          </p>
        )}
      </div>
    </div>
  );
}