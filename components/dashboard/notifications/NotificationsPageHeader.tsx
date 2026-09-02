import { Bell, CheckCheck, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NotificationsPageHeaderProps {
  unreadCount: number;
  hasReadNotifications: boolean;
  isMarkingAllAsRead: boolean;
  isDeletingAllRead: boolean;
  onMarkAllAsRead: () => void;
  onDeleteAllRead: () => void;
}

// oxlint-disable-next-line react-doctor/prefer-explicit-variants -- loading-state flags render distinct sub-states
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
          <Button
            variant="outline"
            onClick={onMarkAllAsRead}
            disabled={isMarkingAllAsRead}
            className="flex items-center gap-2"
          >
            {isMarkingAllAsRead ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCheck className="w-4 h-4" />
            )}
            Mark all as read
          </Button>
        )}

        {hasReadNotifications && (
          <Button
            variant="outline"
            onClick={onDeleteAllRead}
            disabled={isDeletingAllRead}
            className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
          >
            {isDeletingAllRead ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Clear read
          </Button>
        )}
      </div>
    </div>
  );
}