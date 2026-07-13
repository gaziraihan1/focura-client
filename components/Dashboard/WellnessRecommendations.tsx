'use client';

import { Lightbulb, X, Brain, Flame, Clock, Zap, AlertTriangle, Coffee } from 'lucide-react';
import { useRecommendations } from '@/hooks/useBurnoutTrends';

const TYPE_ICONS: Record<string, React.ElementType> = {
  WORKLOAD_ALERT: AlertTriangle,
  BURNOUT_PREVENTION: Flame,
  ENERGY_INSIGHT: Brain,
  FOCUS_SUGGESTION: Zap,
  CAPACITY_TIP: Lightbulb,
  SCHEDULE_ADVICE: Clock,
  BREAK_REMINDER: Coffee,
};

const TYPE_COLORS: Record<string, string> = {
  WORKLOAD_ALERT: 'text-red-600 dark:text-red-400 bg-red-500/10',
  BURNOUT_PREVENTION: 'text-orange-600 dark:text-orange-400 bg-orange-500/10',
  ENERGY_INSIGHT: 'text-green-600 dark:text-green-400 bg-green-500/10',
  FOCUS_SUGGESTION: 'text-purple-600 dark:text-purple-400 bg-purple-500/10',
  CAPACITY_TIP: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
  SCHEDULE_ADVICE: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10',
  BREAK_REMINDER: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
};

export function WellnessRecommendations() {
  const { data: recommendations, loading, dismiss } = useRecommendations();

  if (loading || recommendations.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Brain className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-sm font-semibold tracking-tight">Wellness Insights</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {recommendations.length} suggestion{recommendations.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-2">
        {recommendations.slice(0, 4).map((rec) => {
          const Icon = TYPE_ICONS[rec.type] || Lightbulb;
          const colorClass = TYPE_COLORS[rec.type] || 'text-muted-foreground bg-muted';

          return (
            <div
              key={rec.id}
              className="group flex items-start gap-3 p-3 rounded-xl hover:bg-accent/30 transition-colors"
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-5 text-foreground">{rec.message}</p>
              </div>
              <button
                onClick={() => dismiss(rec.id)}
                className="shrink-0 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-accent transition-all"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
