import { Clock } from "lucide-react";
import { EmptyState as SharedEmptyState } from "@/components/Shared/EmptyState";

export function ActivityEmptyState() {
  return (
    <SharedEmptyState
      icon={Clock}
      title="No activities found"
      description="Activity will appear here as changes are made"
    />
  );
}
