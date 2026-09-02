import { CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NotificationDropdownHeaderProps {
  unreadCount: number;
  isMarkingAllAsRead: boolean;
  isLoading?: boolean;
  onMarkAllAsRead: (e: React.MouseEvent) => void;
}

export function NotificationDropdownHeader({
  unreadCount,
  isMarkingAllAsRead,
  isLoading = false,
  onMarkAllAsRead,
}: NotificationDropdownHeaderProps) {
  return (
    <div className="p-4 border-b border-border flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-foreground">Notifications</h3>
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        )}
        {!isLoading && unreadCount > 0 && (
          <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {unreadCount > 0 && (
        <Button
          onClick={onMarkAllAsRead}
          disabled={isMarkingAllAsRead}
          variant="ghost"
          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
          title="Mark all as read"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Mark all read
        </Button>
      )}
    </div>
  );
}