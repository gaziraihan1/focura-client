// components/TaskActivity/TaskActivityList.tsx
'use client';

import { EmptyState } from './ActivityList/EmptyState';
import { DateGroup } from './ActivityList/DateGroup';
import { groupActivitiesByDate } from '@/utils/task-activity.utils';
import type { TaskActivityListProps } from '@/types/task-activity.types';

export function TaskActivityList({ activities }: TaskActivityListProps) {
  // Empty state
  if (activities.length === 0) {
    return <EmptyState />;
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