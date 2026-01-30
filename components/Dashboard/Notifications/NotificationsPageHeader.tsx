import { Bell, CheckCheck, Trash2, Loader2 } from "lucide-react";

interface NotificationsPageHeaderProps {
  unreadCount: number;
  hasReadNotifications: boolean;
  isMarkingAllAsRead: boolean;
  isDeletingAllRead: boolean;
  onMarkAllAsRead: () => void;
  onDeleteAllRead: () => void;
}

export function NotificationsPageHeader({
  unreadCount,
  hasReadNotifications,
  isMarkingAllAsRead,
  isDeletingAllRead,
  onMarkAllAsRead,
  onDeleteAllRead,
}: NotificationsPageHeaderProps) {
  return (
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

      <div className="flex items-center gap-2">
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
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

        {hasReadNotifications && (
          <button
            onClick={onDeleteAllRead}
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
  );
}