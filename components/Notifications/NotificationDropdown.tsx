import { NotificationDropdownHeader } from "./NotificationDropdownHeader";
import { NotificationLoadingState } from "./NotificationLoadingState";
import { NotificationEmptyState } from "./NotificationEmptyState";
import { NotificationListItem } from "./NotificationListItem";
import { NotificationDropdownFooter } from "./NotificationDropdownFooter";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string | null;
  createdAt: string;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  recentNotifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isMarkingAllAsRead: boolean;
  formatTimeAgo: (dateString: string) => string;
  onNotificationClick: (notification: Notification) => void;
  onMarkAllAsRead: (e: React.MouseEvent) => void;
  onClose: () => void;
}

export function NotificationDropdown({
  notifications,
  recentNotifications,
  unreadCount,
  isLoading,
  isMarkingAllAsRead,
  formatTimeAgo,
  onNotificationClick,
  onMarkAllAsRead,
  onClose,
}: NotificationDropdownProps) {
  return (
    <div className="absolute right-0 mt-2 w-96 bg-popover border border-border rounded-xl shadow-lg z-40 overflow-hidden">
      <NotificationDropdownHeader
        unreadCount={unreadCount}
        isMarkingAllAsRead={isMarkingAllAsRead}
        onMarkAllAsRead={onMarkAllAsRead}
      />

      <div className="max-h-[450px] overflow-y-auto">
        {isLoading && <NotificationLoadingState />}

        {!isLoading && notifications.length === 0 && (
          <NotificationEmptyState />
        )}

        {!isLoading &&
          recentNotifications.map((notification) => (
            <NotificationListItem
              key={notification.id}
              notification={notification}
              formatTimeAgo={formatTimeAgo}
              onClick={() => onNotificationClick(notification)}
            />
          ))}
      </div>

      {notifications.length > 0 && (
        <NotificationDropdownFooter onClose={onClose} />
      )}
    </div>
  );
}