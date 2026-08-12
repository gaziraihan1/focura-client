import { useActivities } from '@/hooks/useActivity';
import { ActivityItem } from './ActivityItem';
import { ActivityFilters as Filters } from '@/hooks/useActivity';
import { Loader2, AlertCircle, Clock } from 'lucide-react';

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
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm font-medium text-destructive">
          Failed to load activities. Please try again.
        </p>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
          <Clock className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  // Group activities by date
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = new Date(activity.createdAt).toLocaleDateString('en-US', {
      timeZone: 'UTC',
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
          <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          <p className="text-sm text-muted-foreground">
            {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
          </p>
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(groupedActivities).map(([date, dateActivities]) => (
          <div key={date}>
            <div className="mb-3 flex items-center gap-3">
              <h3 className="text-sm font-semibold text-foreground">{date}</h3>
              <div className="h-px flex-1 bg-border" />
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