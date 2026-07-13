'use client';

import { useState } from 'react';
import { TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { useBurnoutTrends } from '@/hooks/useBurnoutTrends';

const RISK_COLORS: Record<string, string> = {
  LOW: 'bg-green-500',
  MODERATE: 'bg-yellow-500',
  HIGH: 'bg-orange-500',
  CRITICAL: 'bg-red-500',
};

const RISK_BG: Record<string, string> = {
  LOW: 'bg-green-500/10 border-green-500/20',
  MODERATE: 'bg-yellow-500/10 border-yellow-500/20',
  HIGH: 'bg-orange-500/10 border-orange-500/20',
  CRITICAL: 'bg-red-500/10 border-red-500/20',
};

const RISK_TEXT: Record<string, string> = {
  LOW: 'text-green-600 dark:text-green-400',
  MODERATE: 'text-yellow-600 dark:text-yellow-400',
  HIGH: 'text-orange-600 dark:text-orange-400',
  CRITICAL: 'text-red-600 dark:text-red-400',
};

export function BurnoutTrendsChart() {
  const { data, loading } = useBurnoutTrends(12);
  const [expanded, setExpanded] = useState(false);

  if (loading || data.length === 0) return null;

  const latest = data[data.length - 1];
  const maxLoad = Math.max(...data.map(d => d.avgDailyLoad), 1);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
            <TrendingUp className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-semibold">Burnout Trends</h4>
            <p className="text-xs text-muted-foreground">
              {data.length} week{data.length !== 1 ? 's' : ''} of data
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${RISK_BG[latest.riskLevel] || 'bg-muted'} ${RISK_TEXT[latest.riskLevel] || ''}`}>
            {latest.riskLevel}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Mini Bar Chart */}
          <div className="flex items-end gap-1 h-24">
            {data.map((trend, i) => {
              const height = (trend.avgDailyLoad / maxLoad) * 100;
              const color = RISK_COLORS[trend.riskLevel] || 'bg-muted';
              return (
                <div
                  key={trend.weekStart}
                  className="flex-1 flex flex-col items-center gap-1 group relative"
                >
                  <div
                    className={`w-full rounded-t ${color} transition-all min-h-1`}
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover border border-border rounded-lg px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <p className="font-medium">{trend.riskLevel}</p>
                    <p className="text-muted-foreground">Load: {trend.avgDailyLoad.toFixed(2)}</p>
                    <p className="text-muted-foreground">Heavy days: {trend.consecutiveHeavyDays}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" /> Low
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-500" /> Moderate
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500" /> High
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Critical
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
