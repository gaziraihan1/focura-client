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
      <div className="flex items-center gap-2 mb-3">
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {date}
        </h4>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* Activities */}
      <div className="space-y-3">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}