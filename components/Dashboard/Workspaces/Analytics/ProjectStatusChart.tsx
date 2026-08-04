'use client';

import { ProjectStatusItem } from '@/hooks/useAnalytics';

interface ProjectStatusChartProps {
  data: ProjectStatusItem[];
}

// Solid fill colours for the progress bars (project statuses only).
const STATUS_BAR_COLORS: Record<string, string> = {
  ACTIVE: 'bg-chart-1',
  PLANNING: 'bg-chart-2',
  ON_HOLD: 'bg-chart-3',
  ARCHIVED: 'bg-muted-foreground/60',
  COMPLETED: 'bg-chart-5',
};

function getBarColor(status: string): string {
  return STATUS_BAR_COLORS[status] ?? 'bg-primary/70';
}

export function ProjectStatusChart({ data }: ProjectStatusChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Project Status</h2>
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          No project status data available
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);
  const maxCount = Math.max(...data.map((item) => item.count), 1);

  return (
    <div className="bg-card border rounded-lg p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="sm:text-lg font-semibold">Project Status</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Current state of all projects
        </p>
      </div>

      <div className="space-y-4">
        {data.map((item) => {
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
          const widthPercentage = (item.count / maxCount) * 100;

          return (
            <div key={item.status}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${getBarColor(item.status)}`}
                  />
                  <span className="text-sm font-medium capitalize truncate">
                    {item.status.toLowerCase().replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-xs text-muted-foreground">{percentage}%</span>
                  <span className="text-sm font-semibold min-w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>

              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(item.status)}`}
                  style={{ width: `${widthPercentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Total Projects</span>
        <span className="text-lg font-bold">{total}</span>
      </div>
    </div>
  );
}
