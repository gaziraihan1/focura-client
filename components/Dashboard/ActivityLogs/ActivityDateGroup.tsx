import { ActivityItem } from "@/components/Dashboard/ActivityLogs/ActivityItem";
import { Activity } from "@/hooks/useActivity";

interface ActivityDateGroupProps {
  date: string;
  activities: Activity[];
}

export function ActivityDateGroup({ date, activities }: ActivityDateGroupProps) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {date}
        </h3>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <span className="text-xs text-gray-500 dark:text-gray-400">
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