import { ActivityItem } from "@/components/dashboard/activity-logs/ActivityItem";
import { Activity } from "@/hooks/useActivity";

interface ActivityDateGroupProps {
  date: string;
  activities: Activity[];
}

export function ActivityDateGroup({ date, activities }: ActivityDateGroupProps) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <h3 className="text-sm font-semibold text-foreground">{date}</h3>
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">
          {activities.length}{" "}
          {activities.length === 1 ? "activity" : "activities"}
        </span>
      </div>

      <div className="space-y-2">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}