'use client';

import { ProjectTimeSummary } from '@/hooks/useProjectAnalytics';
import { Clock, Users } from 'lucide-react';

interface ProjectTimeSummaryCardProps {
  data: ProjectTimeSummary | null;
  days: number;
}

export function ProjectTimeSummaryCard({ data, days }: ProjectTimeSummaryCardProps) {
  if (!data) {
    return (
      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Time Summary</h2>
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          No time tracking data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Time Summary</h2>
          <p className="text-sm text-muted-foreground mt-1">Last {days} days</p>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Clock className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Hours</p>
          <p className="text-2xl font-bold text-foreground">{data.totalHours.toFixed(1)}h</p>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Avg Hours/Member</p>
          <p className="text-2xl font-bold text-foreground">{data.avgHoursPerMember.toFixed(1)}h</p>
        </div>
      </div>

      {data.topContributors.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Users className="w-4 h-4" />
            Top Contributors by Hours
          </h3>
          <div className="space-y-2">
            {data.topContributors.slice(0, 5).map((contributor, index) => (
              <div
                key={contributor.userId}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {contributor.userName || contributor.userEmail}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold text-foreground">
                    {contributor.hours.toFixed(1)}h
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}