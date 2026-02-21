'use client';

import { WorkloadMember } from '@/hooks/useAnalytics';
import { getInitials, getWorkloadColor } from '@/utils/analytics.utils';
import { Users, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

interface WorkloadChartProps {
  data: WorkloadMember[];
}

export function WorkloadChart({ data }: WorkloadChartProps) {
  const maxTasks = Math.max(...data.map((m) => m.assignedTasks), 1);
  
  const overloaded = data.filter((m) => m.status === 'overloaded').length;
  const high = data.filter((m) => m.status === 'high').length;
  const normal = data.filter((m) => m.status === 'normal').length;

  const statusIcons = {
    normal: <CheckCircle2 className="w-4 h-4" />,
    high: <AlertCircle className="w-4 h-4" />,
    overloaded: <AlertTriangle className="w-4 h-4" />,
  };

  const statusLabels = {
    normal: 'Normal',
    high: 'High Load',
    overloaded: 'Overloaded',
  };

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Workload Distribution</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Current task assignments per team member
        </p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 rounded-lg border bg-green-500/5 border-green-500/20">
          <p className="text-xs text-muted-foreground mb-1">Normal</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {normal}
          </p>
        </div>
        <div className="p-3 rounded-lg border bg-yellow-500/5 border-yellow-500/20">
          <p className="text-xs text-muted-foreground mb-1">High Load</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {high}
          </p>
        </div>
        <div className="p-3 rounded-lg border bg-red-500/5 border-red-500/20">
          <p className="text-xs text-muted-foreground mb-1">Overloaded</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {overloaded}
          </p>
        </div>
      </div>

      {/* Member List */}
      <div className="space-y-3">
        {data.map((member) => {
          const widthPercentage = (member.assignedTasks / maxTasks) * 100;

          return (
            <div
              key={member.userId}
              className="p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium text-primary">
                      {getInitials(member.userName)}
                    </span>
                  </div>

                  {/* Name */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {member.userName || 'Unknown User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.userEmail}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${getWorkloadColor(
                      member.status
                    )}`}
                  >
                    {statusIcons[member.status]}
                    <span>{statusLabels[member.status]}</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {member.assignedTasks}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    member.status === 'overloaded'
                      ? 'bg-red-500'
                      : member.status === 'high'
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${widthPercentage}%` }}
                />
              </div>
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No team members yet</p>
          </div>
        )}
      </div>

      {/* Threshold Legend */}
      <div className="mt-6 pt-6 border-t">
        <p className="text-xs text-muted-foreground mb-3">Workload Thresholds:</p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <span className="text-green-600 dark:text-green-400 font-medium">Normal:</span>
            <span className="text-muted-foreground ml-1">&lt; 10 tasks</span>
          </div>
          <div>
            <span className="text-yellow-600 dark:text-yellow-400 font-medium">High:</span>
            <span className="text-muted-foreground ml-1">10-14 tasks</span>
          </div>
          <div>
            <span className="text-red-600 dark:text-red-400 font-medium">Overloaded:</span>
            <span className="text-muted-foreground ml-1">≥ 15 tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
}