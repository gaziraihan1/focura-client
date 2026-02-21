'use client';

import { ActivityTrendPoint } from '@/hooks/useAnalytics';
import { formatShortDate } from '@/utils/analytics.utils';

interface ActivityTrendChartProps {
  data: ActivityTrendPoint[];
}

export function ActivityTrendChart({ data }: ActivityTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Activity Trends</h2>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No activity data available
        </div>
      </div>
    );
  }

  const maxTotal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Activity Volume Trend</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Team activity over the last 30 days
        </p>
      </div>

      {/* Stacked Bar Chart */}
      <div className="relative h-48 flex items-end gap-1 mb-6">
        {data.map((point, index) => {
          const totalHeight = (point.total / maxTotal) * 100;
          const createdPercent = point.total > 0 ? (point.created / point.total) * 100 : 0;
          const updatedPercent = point.total > 0 ? (point.updated / point.total) * 100 : 0;
          const completedPercent = point.total > 0 ? (point.completed / point.total) * 100 : 0;
          const assignedPercent = point.total > 0 ? (point.assigned / point.total) * 100 : 0;

          return (
            <div
              key={index}
              className="group relative flex-1 flex flex-col justify-end"
              style={{ height: `${totalHeight}%` }}
            >
              {/* Stacked segments */}
              <div className="w-full h-full flex flex-col-reverse rounded-t overflow-hidden">
                {point.created > 0 && (
                  <div
                    className="bg-blue-500 hover:bg-blue-600 transition-colors"
                    style={{ height: `${createdPercent}%` }}
                  />
                )}
                {point.updated > 0 && (
                  <div
                    className="bg-purple-500 hover:bg-purple-600 transition-colors"
                    style={{ height: `${updatedPercent}%` }}
                  />
                )}
                {point.completed > 0 && (
                  <div
                    className="bg-green-500 hover:bg-green-600 transition-colors"
                    style={{ height: `${completedPercent}%` }}
                  />
                )}
                {point.assigned > 0 && (
                  <div
                    className="bg-orange-500 hover:bg-orange-600 transition-colors"
                    style={{ height: `${assignedPercent}%` }}
                  />
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-popover border rounded-lg shadow-lg p-3 whitespace-nowrap">
                  <p className="text-xs text-muted-foreground mb-2">
                    {formatShortDate(point.date)}
                  </p>
                  <div className="space-y-1">
                    {point.created > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-xs">Created: {point.created}</span>
                      </div>
                    )}
                    {point.updated > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span className="text-xs">Updated: {point.updated}</span>
                      </div>
                    )}
                    {point.completed > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs">Completed: {point.completed}</span>
                      </div>
                    )}
                    {point.assigned > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-xs">Assigned: {point.assigned}</span>
                      </div>
                    )}
                    <div className="pt-1 mt-1 border-t">
                      <span className="text-xs font-semibold">Total: {point.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <div>
            <p className="text-xs text-muted-foreground">Created</p>
            <p className="text-sm font-medium">
              {data.reduce((sum, d) => sum + d.created, 0)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <div>
            <p className="text-xs text-muted-foreground">Updated</p>
            <p className="text-sm font-medium">
              {data.reduce((sum, d) => sum + d.updated, 0)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <div>
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="text-sm font-medium">
              {data.reduce((sum, d) => sum + d.completed, 0)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <div>
            <p className="text-xs text-muted-foreground">Assigned</p>
            <p className="text-sm font-medium">
              {data.reduce((sum, d) => sum + d.assigned, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}