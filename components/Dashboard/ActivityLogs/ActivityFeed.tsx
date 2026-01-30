import React from 'react';
import { useActivities } from '@/hooks/useActivity';
import { ActivityItem } from './ActivityItem';
import { ActivityFilters as Filters } from '@/hooks/useActivity';
import { Loader2 } from 'lucide-react';

interface ActivityFeedProps {
  filters?: Filters;
  workspaceId?: string;
  showHeader?: boolean;
  limit?: number;
  emptyMessage?: string;
}

export function ActivityFeed({
  filters,
  workspaceId,
  showHeader = true,
  limit = 50,
  emptyMessage = 'No activities yet',
}: ActivityFeedProps) {
  const mergedFilters = {
    ...filters,
    workspaceId: workspaceId || filters?.workspaceId,
    limit,
  };

  const { data: activities, isLoading, error } = useActivities(mergedFilters);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-4 text-center">
        <p className="text-sm text-red-600 dark:text-red-400">
          Failed to load activities. Please try again.
        </p>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
          <svg
            className="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  // Group activities by date
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = new Date(activity.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, typeof activities>);

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
          </p>
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(groupedActivities).map(([date, dateActivities]) => (
          <div key={date}>
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{date}</h3>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            </div>
            
            <div className="space-y-2">
              {dateActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}