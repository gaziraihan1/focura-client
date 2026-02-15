import {
  TrendingUp,
  Flame,
  Zap,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';
import { InsightCard } from './InsightCard';
import { getBurnoutColor } from '@/utils/calendar.utils';
import type { CalendarInsights } from '@/types/calendar.types';

interface CalendarInsightsBarProps {
  insights: CalendarInsights | null;
}

export function CalendarInsightsBar({ insights }: CalendarInsightsBarProps) {
  if (!insights) return null;

  const hasAlerts =
    insights.commitmentGap > 10 ||
    insights.burnoutRisk === 'HIGH' ||
    insights.burnoutRisk === 'CRITICAL' ||
    insights.focusDays === 0;

  return (
    <div className="border-b border-border bg-card">
      <div className="max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InsightCard
            icon={TrendingUp}
            iconColor={
              insights.commitmentGap > 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-green-600 dark:text-green-400'
            }
            iconBgColor={
              insights.commitmentGap > 0 ? 'bg-red-500/10' : 'bg-green-500/10'
            }
            label="Commitment Gap"
            value={`${insights.commitmentGap > 0 ? '+' : ''}${insights.commitmentGap.toFixed(1)}h`}
            subtitle={
              <>
                {insights.totalPlannedHours.toFixed(0)}h /{' '}
                {insights.totalCapacityHours.toFixed(0)}h capacity
              </>
            }
          />

          <InsightCard
            icon={Flame}
            iconColor="text-orange-600 dark:text-orange-400"
            iconBgColor="bg-orange-500/10"
            label="Burnout Risk"
            value={insights.burnoutRisk.toLowerCase()}
            valueColor={`capitalize ${getBurnoutColor(insights.burnoutRisk)}`}
            subtitle={`${insights.overloadedDays} overloaded days`}
          />

          <InsightCard
            icon={Zap}
            iconColor="text-purple-600 dark:text-purple-400"
            iconBgColor="bg-purple-500/10"
            label="Focus Days"
            value={insights.focusDays}
            subtitle="Deep work scheduled"
          />

          {insights.timeAllocation ? (
            <InsightCard
              icon={BarChart3}
              iconColor="text-blue-600 dark:text-blue-400"
              iconBgColor="bg-blue-500/10"
              label="Deep Work"
              value={`${insights.timeAllocation.deepWork.toFixed(0)}%`}
              progressBar={{
                percentage: insights.timeAllocation.deepWork,
                color: 'bg-gradient-to-r from-blue-500 to-blue-600',
              }}
            />
          ) : (
            <InsightCard
              icon={BarChart3}
              iconColor="text-blue-600 dark:text-blue-400"
              iconBgColor="bg-blue-500/10"
              label="Time Tracking"
              value="Not Available"
              valueColor="text-lg font-medium text-muted-foreground"
              subtitle="Track tasks by category to see breakdown"
            />
          )}
        </div>

        {hasAlerts && (
          <div className="mt-4 flex flex-wrap gap-2">
            {insights.commitmentGap > 10 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-sm">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-red-900 dark:text-red-100 font-medium">
                  Overcommitted by {insights.commitmentGap.toFixed(0)} hours
                  this month
                </span>
              </div>
            )}
            {(insights.burnoutRisk === 'HIGH' ||
              insights.burnoutRisk === 'CRITICAL') && (
              <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 border border-orange-500/20 rounded-lg text-sm">
                <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-orange-900 dark:text-orange-100 font-medium">
                  {insights.burnoutRisk === 'CRITICAL' ? 'Critical' : 'High'}{' '}
                  burnout risk - consider reducing workload
                </span>
              </div>
            )}
            {insights.focusDays === 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-sm">
                <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-purple-900 dark:text-purple-100 font-medium">
                  No focus days scheduled this month
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}