import { useMemo } from "react";
import { Activity } from "@/hooks/useActivity";
import { ActivityDateGroup } from "./ActivityDateGroup";

const groupDateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function groupByDay(activities: Activity[]): Record<string, Activity[]> {
  return activities.reduce(
    (acc, activity) => {
      const date = groupDateFormatter.format(new Date(activity.createdAt));

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(activity);
      return acc;
    },
    {} as Record<string, Activity[]>,
  );
}

interface ActivityListProps {
  activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  const groupedActivities = useMemo(() => groupByDay(activities), [activities]);

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