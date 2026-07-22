import { Bell } from "lucide-react";
import { EmptyState as SharedEmptyState } from "@/components/Shared/EmptyState";

export function NotificationEmptyState() {
  return (
    <SharedEmptyState
      icon={Bell}
      title="No notifications yet"
      description="We'll notify you when something happens"
    />
  );
}
