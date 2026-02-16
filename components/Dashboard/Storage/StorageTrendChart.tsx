'use client';

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { StorageTrend } from '@/hooks/useStorage';
import { formatStorageSize } from '@/hooks/useStoragePage';

interface StorageTrendChartProps {
  trend: StorageTrend[];
}

export function StorageTrendChart({ trend }: StorageTrendChartProps) {
  // Calculate max value for scaling
  const maxValue = Math.max(...trend.map((t) => t.usageMB), 1);

  // Get trend direction
  const firstValue = trend[0]?.usageMB || 0;
  const lastValue = trend[trend.length - 1]?.usageMB || 0;
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
          <h2 className="text-lg font-semibold">Storage Trend</h2>
          <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
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

      {/* Chart */}
      <div className="relative h-48 flex items-end gap-1">
        {trend.map((point, index) => {
          const height = (point.usageMB / maxValue) * 100;
          const isRecent = index >= trend.length - 7;

          return (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.5, delay: index * 0.02 }}
              className="group relative flex-1"
            >
              <div
                className={`w-full rounded-t transition-colors ${
                  isRecent ? 'bg-primary' : 'bg-primary/40'
                } hover:bg-primary`}
              />

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-popover border rounded-lg shadow-lg p-3 whitespace-nowrap">
                  <p className="text-xs text-muted-foreground">
                    {new Date(point.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm font-semibold mt-1">{formatStorageSize(point.usageMB)}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-4 text-xs text-muted-foreground">
        <span>
          {new Date(trend[0]?.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
        <span>
          {new Date(trend[Math.floor(trend.length / 2)]?.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
        <span>
          {new Date(trend[trend.length - 1]?.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>

      {/* Summary */}
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
    </motion.div>
  );
}