interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationListItemProps {
  notification: Notification;
  formatTimeAgo: (dateString: string) => string;
  onClick: () => void;
}

export function NotificationListItem({
  notification,
  formatTimeAgo,
  onClick,
}: NotificationListItemProps) {
  return (
    <button
      onClick={onClick}
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
  );
}