// components/TaskActivity/TaskActivityList.tsx
'use client';

import { Clock } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { DateGroup } from './ActivityList/DateGroup';
import { groupActivitiesByDate } from '@/utils/task-activity.utils';
import type { TaskActivityListProps } from '@/types/task-activity.types';

export function TaskActivityList({ activities }: TaskActivityListProps) {
  // Empty state
  if (activities.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No activity yet"
        description="Activity will appear here as changes are made"
      />
    );
  }

  // Group activities by date
  const groupedActivities = groupActivitiesByDate(activities);

  return (
    <div className="space-y-6">
      {Object.entries(groupedActivities).map(([date, dateActivities]) => (
        <DateGroup key={date} date={date} activities={dateActivities} />
      ))}
    </div>
  );
}