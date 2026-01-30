import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NotificationItemProps {
  notification: {
    id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    actionUrl?: string | null;
    sender?: {
      id: string;
      name: string;
      email: string;
    } | null;
  };
  onClick: () => void;
  onDelete: () => void;
}

export function NotificationItem({
  notification,
  onClick,
  onDelete,
}: NotificationItemProps) {
  return (
    <div
      className={`group relative p-4 rounded-xl border transition-all ${
        !notification.read
          ? "bg-accent/30 border-accent hover:bg-accent/40"
          : "bg-card border-border hover:bg-accent/20"
      }`}
    >
      <button onClick={onClick} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium line-clamp-1">{notification.title}</p>
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

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all"
            title="Delete notification"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </button>
    </div>
  );
}