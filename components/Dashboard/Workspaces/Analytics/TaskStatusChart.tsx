'use client';

import { statusChartData } from '@/constant/analytics.constant';
import { TaskStatusItem } from '@/hooks/useAnalytics';

interface TaskStatusChartProps {
  data: TaskStatusItem[];
}

export function TaskStatusChart({ data }: TaskStatusChartProps) {
  const {conicGradient, colors, total} = statusChartData({data})

  return (
    <div className="bg-card border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-6">Task Status Distribution</h2>

      {/* Donut Chart */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `conic-gradient(from 0deg, ${conicGradient})`,
            }}
          />
          <div className="absolute inset-8 bg-card rounded-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold">{total}</p>
              <p className="text-xs text-muted-foreground">Total Tasks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={item.status} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm capitalize">
                {item.status.toLowerCase().replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{item.count}</span>
              <span className="text-xs text-muted-foreground">
                ({item.percentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}