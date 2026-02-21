'use client';

import { MostActiveDay as MostActiveDayType } from '@/hooks/useAnalytics';
import { Calendar, TrendingUp, Activity } from 'lucide-react';

interface MostActiveDayProps {
  data: MostActiveDayType;
}

export function MostActiveDay({ data }: MostActiveDayProps) {
  const activityLabels: Record<string, string> = {
    CREATED: 'Creating',
    UPDATED: 'Updating',
    COMPLETED: 'Completing',
    ASSIGNED: 'Assigning',
    COMMENTED: 'Commenting',
    UPLOADED: 'Uploading',
  };

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Peak Activity Day
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Last 30 days analysis
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="p-4 bg-primary/10 rounded-lg">
          <Calendar className="w-8 h-8 text-primary" />
        </div>

        <div className="flex-1">
          <p className="text-2xl font-bold">{data.day || 'No data'}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {data.count} {data.count === 1 ? 'activity' : 'activities'}
          </p>
          {data.mostCommonAction && data.mostCommonAction !== 'NONE' && (
            <div className="flex items-center gap-1.5 mt-2">
              <Activity className="w-3 h-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Most common: {activityLabels[data.mostCommonAction] || data.mostCommonAction}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}