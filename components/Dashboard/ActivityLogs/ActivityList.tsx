import { Activity } from "@/hooks/useActivity";
import { ActivityDateGroup } from "./ActivityDateGroup";

interface ActivityListProps {
  activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  const groupedActivities = activities.reduce(
    (acc, activity) => {
      const date = new Date(activity.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(activity);
      return acc;
    },
    {} as Record<string, Activity[]>,
  );

  return (
    <div className="space-y-8">
      {Object.entries(groupedActivities).map(([date, dateActivities]) => (
        <ActivityDateGroup
          key={date}
          date={date}
          activities={dateActivities}
        />
      ))}
    </div>
  );
}