'use client';

import { useState } from 'react';
import { Loader2, Activity, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TaskActivityList } from '@/components/dashboard/task-details/TaskActivityList';
import { useWorkspaceActivities } from '@/hooks/useActivity';
import WorkspaceInformation from './WorkspaceInformation';
import WorkspaceStorageInfo from './WorkspaceStorageInfo';

interface WorkspaceOverviewTabProps {
  workspaceId: string;
  owner: {
    name: string | null;
    email?: string;
  };
  createdAt: string;
  isPublic: boolean;
  maxStorage: number;
}

export function WorkspaceOverviewTab({
  workspaceId,
  owner,
  createdAt,
  isPublic,
  maxStorage,
}: WorkspaceOverviewTabProps) {
  const [limit, setLimit] = useState(5);
  const { data: activities = [], isLoading: activitiesLoading } = useWorkspaceActivities(
    workspaceId,
    { limit: limit + 1 }
  );

  const hasMore = activities.length > limit;
  const visibleActivities = activities.slice(0, limit);
  const isEmpty = activities.length === 0 && !activitiesLoading;

  return (
    <div className="space-y-5">
      {/* Activity feed */}
      <div className="p-5 rounded-2xl bg-card border border-border">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
          </div>
          {hasMore && (
            <Button
              variant="ghost"
              onClick={() => setLimit((prev) => prev + 5)}
              className="text-xs text-primary hover:underline hover:bg-transparent font-medium"
            >
              View more
            </Button>
          )}
        </div>

        {activitiesLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : isEmpty ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Activity size={20} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No activity yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Activity will appear here as your team works
            </p>
          </div>
        ) : (
          <TaskActivityList activities={visibleActivities} />
        )}

        {limit > 5 && (
          <div className="flex justify-center pt-4 border-t border-border/50 mt-4">
            <Button
              variant="ghost"
              onClick={() => setLimit(5)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-transparent transition font-medium"
            >
              <ChevronUp size={14} />
              Show less
            </Button>
          </div>
        )}
      </div>

      {/* Info and Storage grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <WorkspaceInformation
          name={owner.name}
          email={owner.email}
          createdAt={createdAt}
          isPublic={isPublic}
        />
        <WorkspaceStorageInfo
          maxStorage={maxStorage}
          workspaceId={workspaceId}
        />
      </div>
    </div>
  );
}