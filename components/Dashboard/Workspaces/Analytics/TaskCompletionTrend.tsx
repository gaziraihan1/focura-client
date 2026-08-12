'use client';

import { TrendingUp } from 'lucide-react';
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
import { TrendDataPoint } from '@/hooks/useAnalytics';
import { formatShortDate } from '@/utils/analytics.utils';

interface TaskCompletionTrendProps {
  data: TrendDataPoint[];
}

interface TrendDatum {
  date: Date;
  label: string;
  count: number;
}

function CompletionTooltip({
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
      <p className="font-semibold">
        {value} {value === 1 ? 'task' : 'tasks'}
      </p>
    </div>
  );
}

export function TaskCompletionTrend({ data }: TaskCompletionTrendProps) {
  if (data.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <h2 className="sm:text-lg font-semibold mb-1">Task Completion Trend</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6">Last 30 days</p>
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          No data available
        </div>
      </div>
    );
  }

  const chartData: TrendDatum[] = data.map((point) => ({
    date: point.date,
    label: formatShortDate(point.date),
    count: point.count,
  }));

  const firstValue = chartData[0]?.count || 0;
  const lastValue = chartData[chartData.length - 1]?.count || 0;
  const trend = lastValue > firstValue ? 'up' : lastValue < firstValue ? 'down' : 'stable';
  const trendPercentage =
    firstValue > 0 ? Math.round(((lastValue - firstValue) / firstValue) * 100) : 0;

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="sm:text-lg font-semibold">Task Completion Trend</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Last 30 days</p>
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
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="taskCompletionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
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
            <Tooltip content={<CompletionTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#taskCompletionGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-4 text-xs text-muted-foreground">
        <span>{formatShortDate(chartData[0]?.date)}</span>
        <span>{formatShortDate(chartData[Math.floor(chartData.length / 2)]?.date)}</span>
        <span>{formatShortDate(chartData[chartData.length - 1]?.date)}</span>
      </div>
    </div>
  );
}
