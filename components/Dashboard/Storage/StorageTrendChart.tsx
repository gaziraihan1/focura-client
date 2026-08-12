'use client';

import { m as motion } from 'framer-motion';
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
import { StorageTrend } from '@/hooks/useStorage';
import { formatStorageSize } from '@/hooks/useStoragePage';

interface StorageTrendChartProps {
  trend: StorageTrend[];
}

interface TrendDatum {
  date: Date;
  label: string;
  usageMB: number;
}

function TrendTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length || payload[0].value == null) return null;
  return (
    <div className="rounded-lg border border-border bg-popover/90 backdrop-blur-md px-3 py-2 text-xs shadow-lg">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="font-semibold">{formatStorageSize(payload[0].value)}</p>
    </div>
  );
}

const compactSize = (value: number) =>
  value >= 1024 ? `${(value / 1024).toFixed(1)}GB` : `${Math.round(value)}MB`;

export function StorageTrendChart({ trend }: StorageTrendChartProps) {
  const list = trend ?? [];

  const chartData: TrendDatum[] = list.map((point) => ({
    date: point.date,
    label: new Date(point.date).toLocaleDateString('en-US', {
      timeZone: 'UTC',
      month: 'short',
      day: 'numeric',
    }),
    usageMB: point.usageMB,
  }));

  const firstValue = chartData[0]?.usageMB || 0;
  const lastValue = chartData[chartData.length - 1]?.usageMB || 0;
  const trendDirection = lastValue > firstValue ? 'up' : lastValue < firstValue ? 'down' : 'stable';
  const trendPercentage = firstValue > 0 ? Math.round(((lastValue - firstValue) / firstValue) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border rounded-lg p-6"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="sm:text-lg font-semibold">Storage Trend</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Last 30 days</p>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp
            className={`w-4 h-4 ${
              trendDirection === 'up'
                ? 'text-amber-500'
                : trendDirection === 'down'
                ? 'text-green-500'
                : 'text-muted-foreground'
            }`}
          />
          <span
            className={`text-sm font-medium ${
              trendDirection === 'up'
                ? 'text-amber-500'
                : trendDirection === 'down'
                ? 'text-green-500'
                : 'text-muted-foreground'
            }`}
          >
            {trendDirection === 'up' ? '+' : trendDirection === 'down' ? '-' : ''}
            {Math.abs(trendPercentage)}%
          </span>
        </div>
      </div>

      {chartData.length === 0 ? (
        <p className="text-sm text-muted-foreground">No trend data available yet.</p>
      ) : (
        <>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="storageTrendGradient" x1="0" y1="0" x2="0" y2="1">
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
                  tickFormatter={compactSize}
                />
                <Tooltip content={<TrendTooltip />} />
                <Area
                  type="monotone"
                  dataKey="usageMB"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#storageTrendGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Current</p>
              <p className="text-lg font-semibold mt-1">{formatStorageSize(lastValue)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">30 Days Ago</p>
              <p className="text-lg font-semibold mt-1">{formatStorageSize(firstValue)}</p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}