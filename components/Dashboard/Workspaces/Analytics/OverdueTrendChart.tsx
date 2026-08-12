'use client';

import { AlertCircle } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
// oxlint-disable-next-line react-doctor/prefer-dynamic-import -- recharts only ships when this chart mounts
} from 'recharts';
import { OverdueTrendPoint } from '@/hooks/useAnalytics';
import { formatShortDate } from '@/utils/analytics.utils';

interface OverdueTrendChartProps {
  data: OverdueTrendPoint[];
}

interface TrendDatum {
  weekStart: Date | string;
  label: string;
  count: number;
}

function OverdueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length || payload[0].value == null) return null;
  const value = Number(payload[0].value);
  return (
    <div className="rounded-lg border border-border bg-popover/90 backdrop-blur-md px-3 py-2 text-xs shadow-lg">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="font-semibold text-red-600 dark:text-red-400">
        {value} {value === 1 ? 'task' : 'tasks'} overdue
      </p>
    </div>
  );
}

export function OverdueTrendChart({ data }: OverdueTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <h2 className="sm:text-lg font-semibold mb-1">Overdue Trend</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6">
          Weekly overdue task counts
        </p>
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          No overdue data available
        </div>
      </div>
    );
  }

  const chartData: TrendDatum[] = data.map((point) => ({
    weekStart: point.weekStart,
    label: formatShortDate(point.weekStart),
    count: point.count,
  }));

  const totalOverdue = chartData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-card border rounded-lg p-6 w-full min-w-0 overflow-hidden">
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div className="min-w-0">
          <h2 className="sm:text-lg font-semibold">Overdue Trend</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Weekly overdue task counts
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-destructive/10 text-destructive shrink-0">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-xs font-medium whitespace-nowrap">
            {totalOverdue} overdue
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
            <defs>
              <linearGradient id="overdueTrendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-destructive)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-destructive)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-border)' }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-border)' }}
              allowDecimals={false}
            />
            <Tooltip content={<OverdueTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--color-destructive)"
              strokeWidth={2}
              fill="url(#overdueTrendGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-4 text-xs text-muted-foreground">
        <span>{formatShortDate(chartData[0]?.weekStart)}</span>
        <span>{formatShortDate(chartData[chartData.length - 1]?.weekStart)}</span>
      </div>
    </div>
  );
}