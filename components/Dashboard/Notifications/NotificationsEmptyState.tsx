import { Bell } from "lucide-react";

export function NotificationsEmptyState() {
  return (
    <div className="text-center py-16">
      <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
      <p className="text-lg font-medium text-muted-foreground">
        No notifications yet
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        We&apos;ll notify you when something important happens
      </p>
    </div>
  );
}