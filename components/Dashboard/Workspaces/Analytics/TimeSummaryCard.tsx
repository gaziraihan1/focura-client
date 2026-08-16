'use client';

import { TimeSummary } from '@/hooks/useAnalytics';
import { formatHours } from '@/utils/analytics.utils';
import { Clock, Users, Folder } from 'lucide-react';

interface TimeSummaryCardProps {
  data: TimeSummary;
  days?: number;
}

export function TimeSummaryCard({ data, days = 7 }: TimeSummaryCardProps) {
  const totalHours = Math.max(data.totalHours, 0);

  return (
    <div className="bg-card border rounded-lg p-4 sm:p-6 w-full min-w-0">
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div className="min-w-0">
          <h2 className="sm:text-lg font-semibold">Time Tracking Summary</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Last {days} days
          </p>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
          <Clock className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        <div className="p-3 sm:p-4 rounded-lg border bg-primary/5 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary shrink-0" />
            <p className="text-xs text-muted-foreground truncate">Total Hours</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold">
            {formatHours(data.totalHours)}
          </p>
        </div>

        <div className="p-3 sm:p-4 rounded-lg border bg-secondary/5 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground truncate">Avg per Member</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold">
            {formatHours(data.avgHoursPerMember)}
          </p>
        </div>
      </div>

      {/* Project Breakdown */}
      {data.projectBreakdown.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Folder className="w-4 h-4 shrink-0" />
            Top Projects by Hours
          </h3>
          <div className="space-y-3">
            {data.projectBreakdown.slice(0, 5).map((project, index) => {
              const share = totalHours > 0 ? Math.round((project.hours / totalHours) * 100) : 0;

              return (
                <div key={project.projectId} className="group">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-xs font-medium text-muted-foreground shrink-0">
                        #{index + 1}
                      </span>
                      <p className="text-sm truncate">{project.projectName}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-semibold">
                        {formatHours(project.hours)}
                      </span>
                      <span className="text-xs text-muted-foreground">{share}%</span>
                    </div>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/50 group-hover:bg-primary transition-colors"
                      style={{ width: `${share}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Member Breakdown */}
      {data.memberBreakdown && data.memberBreakdown.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 shrink-0" />
            Time by Member
          </h3>
          <div className="rounded-lg border divide-y divide-border">
            {data.memberBreakdown.map((member) => {
              const share = totalHours > 0 ? Math.round((member.hours / totalHours) * 100) : 0;
              const initial = (member.userName ?? member.userEmail ?? "?").charAt(0).toUpperCase();
              return (
                <div key={member.userId} className="flex items-center gap-3 p-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {member.userName ?? member.userEmail}
                    </p>
                    <div className="mt-1 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-primary/40" style={{ width: `${share}%` }} />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-semibold tabular-nums">{formatHours(member.hours)}</span>
                    <span className="text-xs text-muted-foreground ml-1.5">{share}%</span>
                  </div>
                </div>
              );
            })}
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