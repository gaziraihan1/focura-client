'use client';

import { OverdueTrendPoint } from '@/hooks/useAnalytics';
import { formatShortDate } from '@/utils/analytics.utils';
import { AlertCircle } from 'lucide-react';

interface OverdueTrendChartProps {
  data: OverdueTrendPoint[];
}

export function OverdueTrendChart({ data }: OverdueTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <h2 className="sm:text-lg font-semibold mb-4">Overdue Trend</h2>
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          No overdue data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-card border rounded-lg p-4 sm:p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="sm:text-lg font-semibold">Overdue Trend</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Weekly overdue task counts
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-destructive/10 text-destructive shrink-0 ml-4">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs font-medium">
            {data.reduce((sum, d) => sum + d.count, 0)} overdue
          </span>
        </div>
      </div>

      <div className="relative h-48 flex items-end gap-1">
        {data.map((point, index) => {
          const height = (point.count / maxValue) * 100;

          return (
            <div
              key={`${String(point.weekStart)}-${index}`}
              className="group relative flex-1"
            >
              <div
                className="w-full rounded-t bg-destructive/70 transition-all duration-300 hover:bg-destructive group-hover:opacity-90"
                style={{ height: `${height}%` }}
              />

              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-popover border rounded-lg shadow-lg p-3 whitespace-nowrap">
                  <p className="text-xs text-muted-foreground">
                    {formatShortDate(point.weekStart)}
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    {point.count} {point.count === 1 ? 'task' : 'tasks'} overdue
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-4 text-xs text-muted-foreground">
        <span>{formatShortDate(data[0]?.weekStart)}</span>
        <span>{formatShortDate(data[data.length - 1]?.weekStart)}</span>
      </div>
    </div>
  );
}
