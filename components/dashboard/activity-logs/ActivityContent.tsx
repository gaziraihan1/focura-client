import { Activity } from "@/hooks/useActivity";
import { Clock } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ActivityLoadingState } from "./ActivityLoadingState";
import { ActivityErrorState } from "./ActivityErrorState";
import { ActivityList } from "./ActivityList";

interface ActivityContentProps {
  activities: Activity[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function ActivityContent({
  activities,
  isLoading,
  error,
}: ActivityContentProps) {
  if (isLoading) {
    return <ActivityLoadingState />;
  }

  if (error) {
    return <ActivityErrorState />;
  }

  if (!activities || activities.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No activities found"
        description="Activity will appear here as changes are made"
      />
    );
  }

  return <ActivityList activities={activities} />;
}