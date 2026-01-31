import { Bell } from "lucide-react";

export function NotificationEmptyState() {
  return (
    <div className="text-center py-12">
      <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
      <p className="text-sm font-medium text-muted-foreground">
        No notifications yet
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        We&apos;ll notify you when something happens
      </p>
    </div>
  );
}