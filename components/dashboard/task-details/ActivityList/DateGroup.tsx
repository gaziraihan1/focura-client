// components/TaskActivity/DateGroup.tsx
import { ActivityItem } from './ActivityItem';
import type { Activity } from '@/types/task-activity.types';

interface DateGroupProps {
  date: string;
  activities: Activity[];
}

export function DateGroup({ date, activities }: DateGroupProps) {
  return (
    <div>
      {/* Date Header */}
      <div className="flex items-center gap-3 mb-3">
        <h4 className="text-sm font-semibold text-foreground">
          {date}
        </h4>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Activities */}
      <div className="space-y-2">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}