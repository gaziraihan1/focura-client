'use client';

import { TimeSummary } from '@/hooks/useAnalytics';
import { formatHours } from '@/utils/analytics.utils';
import { Clock, Users, Folder } from 'lucide-react';

interface TimeSummaryCardProps {
  data: TimeSummary;
  days?: number;
}

export function TimeSummaryCard({ data, days = 7 }: TimeSummaryCardProps) {
  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Time Tracking Summary</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Last {days} days
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg border bg-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">Total Hours</p>
          </div>
          <p className="text-2xl font-bold">{formatHours(data.totalHours)}</p>
        </div>

        <div className="p-4 rounded-lg border bg-secondary/5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Avg per Member</p>
          </div>
          <p className="text-2xl font-bold">{formatHours(data.avgHoursPerMember)}</p>
        </div>
      </div>

      {/* Project Breakdown */}
      {data.projectBreakdown.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Folder className="w-4 h-4" />
            Top Projects by Hours
          </h3>
          <div className="space-y-2">
            {data.projectBreakdown.slice(0, 5).map((project, index) => (
              <div
                key={project.projectId}
                className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-xs font-medium text-muted-foreground shrink-0">
                    #{index + 1}
                  </span>
                  <p className="text-sm truncate">{project.projectName}</p>
                </div>
                <span className="text-sm font-semibold ml-4 shrink-0">
                  {formatHours(project.hours)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.projectBreakdown.length === 0 && (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-sm text-muted-foreground">No time entries yet</p>
        </div>
      )}
    </div>
  );
}