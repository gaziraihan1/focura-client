import { CheckCheck } from "lucide-react";

interface NotificationDropdownHeaderProps {
  unreadCount: number;
  isMarkingAllAsRead: boolean;
  onMarkAllAsRead: (e: React.MouseEvent) => void;
}

export function NotificationDropdownHeader({
  unreadCount,
  isMarkingAllAsRead,
  onMarkAllAsRead,
}: NotificationDropdownHeaderProps) {
  return (
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
          onClick={onMarkAllAsRead}
          disabled={isMarkingAllAsRead}
          className="text-xs text-primary hover:text-primary/80 disabled:opacity-50 flex items-center gap-1 transition-colors"
          title="Mark all as read"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Mark all read
        </button>
      )}
    </div>
  );
}