'use client';

import type { ProjectCompletionTrend } from '@/hooks/useProjectAnalytics';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProjectCompletionTrendChartProps {
  data: ProjectCompletionTrend[];
}

export function ProjectCompletionTrendChart({ data }: ProjectCompletionTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Completion Trend</h2>
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          No completion data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.count), 1);
  const firstValue = data[0]?.count || 0;
  const lastValue = data[data.length - 1]?.count || 0;
  const trend = lastValue > firstValue ? 'up' : lastValue < firstValue ? 'down' : 'stable';
  const trendPercentage = firstValue > 0 ? Math.round(((lastValue - firstValue) / firstValue) * 100) : 0;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground';

  return (
    <div className="bg-card border rounded-xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Completion Trend</h2>
          <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
        </div>
        <div className="flex items-center gap-2">
          <TrendIcon className={`w-4 h-4 ${trendColor}`} />
          <span className={`text-sm font-medium ${trendColor}`}>
            {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{Math.abs(trendPercentage)}%
          </span>
        </div>
      </div>

      <div className="relative h-48 flex items-end gap-1">
        {data.map((point, index) => {
          const height = (point.count / maxValue) * 100;
          const isRecent = index >= data.length - 7;

          return (
            <div key={index} className="group relative flex-1">
              <div
                className={`w-full rounded-t transition-all duration-300 hover:opacity-80 ${
                  isRecent ? 'bg-primary' : 'bg-primary/40'
                }`}
                style={{ height: `${height}%` }}
              />

              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-popover border rounded-lg shadow-lg p-3 whitespace-nowrap">
                  <p className="text-xs text-muted-foreground">
                    {format(point.date, 'MMM d')}
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

      <div className="flex justify-between mt-4 text-xs text-muted-foreground">
        <span>{format(data[0]?.date, 'MMM d')}</span>
        <span>{format(data[Math.floor(data.length / 2)]?.date, 'MMM d')}</span>
        <span>{format(data[data.length - 1]?.date, 'MMM d')}</span>
      </div>
    </div>
  );
}