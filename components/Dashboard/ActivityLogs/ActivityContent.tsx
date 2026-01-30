import { Activity } from "@/hooks/useActivity";
import { ActivityLoadingState } from "./ActivityLoadingState";
import { ActivityErrorState } from "./ActivityErrorState";
import { ActivityEmptyState } from "./ActivityEmptyState";
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
    return <ActivityEmptyState />;
  }

  return <ActivityList activities={activities} />;
}