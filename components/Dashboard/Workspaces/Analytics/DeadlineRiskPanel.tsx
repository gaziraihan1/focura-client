'use client';

import { DeadlineRisk } from '@/hooks/useAnalytics';
import { getRelativeTime } from '@/utils/analytics.utils';
import { AlertTriangle, Clock, Flame } from 'lucide-react';

interface DeadlineRiskPanelProps {
  data: DeadlineRisk;
}

export function DeadlineRiskPanel({ data }: DeadlineRiskPanelProps) {
  const riskIcon = {
    low: <Clock className="w-5 h-5" />,
    medium: <AlertTriangle className="w-5 h-5" />,
    high: <Flame className="w-5 h-5" />,
  };

  const riskLabel = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
  };

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Deadline Risk Analysis</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tasks approaching deadlines
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
          data.riskLevel === 'high'
            ? 'bg-red-500/10 text-red-600 dark:text-red-400'
            : data.riskLevel === 'medium'
            ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
            : 'bg-green-500/10 text-green-600 dark:text-green-400'
        }`}>
          {riskIcon[data.riskLevel]}
          <span className="text-sm font-medium">{riskLabel[data.riskLevel]}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg border bg-red-500/5 border-red-500/20">
          <p className="text-sm text-muted-foreground mb-1">Due in 3 Days</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {data.dueIn3Days.length}
          </p>
        </div>

        <div className="p-4 rounded-lg border bg-yellow-500/5 border-yellow-500/20">
          <p className="text-sm text-muted-foreground mb-1">Due in 7 Days</p>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {data.dueIn7DaysCount}
          </p>
        </div>

        <div className="p-4 rounded-lg border bg-orange-500/5 border-orange-500/20">
          <p className="text-sm text-muted-foreground mb-1">High Priority</p>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {data.highPriorityNearDeadline.length}
          </p>
        </div>
      </div>

      {data.dueIn3Days.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Urgent Tasks (3 Days)
          </h3>
          <div className="space-y-2">
            {data.dueIn3Days.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  {task.assignedTo && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Assigned to: {task.assignedTo}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end ml-4 shrink-0">
                  <span className={`text-xs px-2 py-1 rounded ${
                    task.priority === 'URGENT'
                      ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                      : task.priority === 'HIGH'
                      ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {task.priority}
                  </span>
                  {task.dueDate && (
                    <span className="text-xs text-muted-foreground mt-1">
                      {getRelativeTime(task.dueDate)}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {data.dueIn3Days.length > 5 && (
              <p className="text-xs text-muted-foreground text-center py-2">
                +{data.dueIn3Days.length - 5} more urgent tasks
              </p>
            )}
          </div>
        </div>
      )}

      {data.dueIn3Days.length === 0 && data.highPriorityNearDeadline.length === 0 && (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No urgent deadlines - you&apos;re on track!
          </p>
        </div>
      )}
    </div>
  );
}