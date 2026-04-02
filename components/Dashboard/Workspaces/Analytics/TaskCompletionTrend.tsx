'use client';

import { TrendDataPoint } from '@/hooks/useAnalytics';
import { formatShortDate } from '@/utils/analytics.utils';
import { TrendingUp } from 'lucide-react';

interface TaskCompletionTrendProps {
  data: TrendDataPoint[];
}

export function TaskCompletionTrend({ data }: TaskCompletionTrendProps) {
  if (data.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Completion Trend</h2>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.count), 1);
  const firstValue = data[0]?.count || 0;
  const lastValue = data[data.length - 1]?.count || 0;
  const trend = lastValue > firstValue ? 'up' : lastValue < firstValue ? 'down' : 'stable';
  const trendPercentage = firstValue > 0 
    ? Math.round(((lastValue - firstValue) / firstValue) * 100)
    : 0;

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Task Completion Trend</h2>
          <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp
            className={`w-4 h-4 ${
              trend === 'up'
                ? 'text-green-500'
                : trend === 'down'
                ? 'text-red-500'
                : 'text-muted-foreground'
            }`}
          />
          <span
            className={`text-sm font-medium ${
              trend === 'up'
                ? 'text-green-500'
                : trend === 'down'
                ? 'text-red-500'
                : 'text-muted-foreground'
            }`}
          >
            {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
            {Math.abs(trendPercentage)}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-48 flex items-end gap-1">
        {data.map((point, index) => {
          const height = (point.count / maxValue) * 100;
          const isRecent = index >= data.length - 7;

          return (
            <div
              key={index}
              className="group relative flex-1"
            >
              <div
                className={`w-full rounded-t transition-all duration-300 hover:opacity-80 ${
                  isRecent ? 'bg-primary' : 'bg-primary/40'
                }`}
                style={{ height: `${height}%` }}
              />

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-popover border rounded-lg shadow-lg p-3 whitespace-nowrap">
                  <p className="text-xs text-muted-foreground">
                    {formatShortDate(point.date)}
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    {point.count} {point.count === 1 ? 'task' : 'tasks'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-4 text-xs text-muted-foreground">
        <span>{formatShortDate(data[0]?.date)}</span>
        <span>{formatShortDate(data[Math.floor(data.length / 2)]?.date)}</span>
        <span>{formatShortDate(data[data.length - 1]?.date)}</span>
      </div>
    </div>
  );
}