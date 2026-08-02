'use client';

import { useState } from 'react';
import { Lightbulb, X, Brain, Flame, Clock, Zap, AlertTriangle, Coffee, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useRecommendations } from '@/hooks/useBurnoutTrends';
import type { WellnessRecommendation } from '@/types/calendar.types';

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

// ─── Priority helpers ────────────────────────────────────────────────────────

function getPriorityTier(priority: number): {
  label: string;
  chip: string;
  accent: string;
} {
  if (priority >= 80) {
    return {
      label: 'High',
      chip: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400',
      accent: 'border-l-red-500',
    };
  }
  if (priority >= 50) {
    return {
      label: 'Medium',
      chip: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
      accent: 'border-l-amber-500',
    };
  }
  return {
    label: 'Low',
    chip: 'bg-muted border-border text-muted-foreground',
    accent: 'border-l-muted-foreground/40',
  };
}

function sortByPriority(recs: WellnessRecommendation[]): WellnessRecommendation[] {
  return [...recs].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}

// ─── Component ───────────────────────────────────────────────────────────────

export function WellnessRecommendations() {
  const { data: recommendations, loading, dismiss, dismissAll } = useRecommendations();
  const [showDismissed, setShowDismissed] = useState(false);
  // Track locally-dismissed recs so the dismissed section works even if the
  // backend doesn't return dismissed items on subsequent fetches.
  const [dismissedRecs, setDismissedRecs] = useState<WellnessRecommendation[]>([]);

  if (loading || recommendations.length === 0) return null;

  const active = recommendations.filter(
    (r) => r.dismissed !== true && !dismissedRecs.some((d) => d.id === r.id)
  );
  // Dedupe by id in case the backend returns dismissed items the user also
  // dismissed locally.
  const dismissed = Array.from(
    new Map(
      [...dismissedRecs, ...recommendations.filter((r) => r.dismissed === true)].map(
        (r) => [r.id, r]
      )
    ).values()
  );

  const handleDismiss = (rec: WellnessRecommendation) => {
    setDismissedRecs((prev) => [...prev, rec]);
    dismiss(rec.id);
  };

  const handleDismissAll = () => {
    setDismissedRecs((prev) => [...prev, ...active]);
    dismissAll();
  };

  const sortedActive = sortByPriority(active).slice(0, 4);
  const sortedDismissed = sortByPriority(dismissed);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Brain className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-sm font-semibold tracking-tight">Wellness Insights</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {active.length} suggestion{active.length !== 1 ? 's' : ''}
        </span>
        {active.length > 0 && (
          <button
            onClick={handleDismissAll}
            className="flex items-center gap-1 ml-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss all suggestions"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Dismiss all
          </button>
        )}
      </div>

      <div className="space-y-2">
        {sortedActive.map((rec) => {
          const Icon = TYPE_ICONS[rec.type] || Lightbulb;
          const colorClass = TYPE_COLORS[rec.type] || 'text-muted-foreground bg-muted';
          const tier = getPriorityTier(rec.priority ?? 0);

          return (
            <div
              key={rec.id}
              className={`group flex items-start gap-3 p-3 rounded-xl border-l-2 ${tier.accent} hover:bg-accent/30 transition-colors`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${tier.chip}`}>
                    {tier.label} priority
                  </span>
                </div>
                <p className="text-sm leading-5 text-foreground">{rec.message}</p>
              </div>
              <button
                onClick={() => handleDismiss(rec)}
                className="shrink-0 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-accent transition-all"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Dismissed toggle */}
      {dismissed.length > 0 && (
        <div className="mt-4 border-t border-border pt-3">
          <button
            onClick={() => setShowDismissed(!showDismissed)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            aria-expanded={showDismissed}
          >
            {showDismissed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showDismissed ? 'Hide dismissed' : `Show dismissed (${dismissed.length})`}
          </button>

          {showDismissed && (
            <div className="mt-2 space-y-2">
              {sortedDismissed.map((rec) => {
                const Icon = TYPE_ICONS[rec.type] || Lightbulb;
                const colorClass = TYPE_COLORS[rec.type] || 'text-muted-foreground bg-muted';
                const tier = getPriorityTier(rec.priority ?? 0);

                return (
                  <div
                    key={rec.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border-l-2 ${tier.accent} bg-muted/30 opacity-70`}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${tier.chip}`}>
                          {tier.label} priority
                        </span>
                      </div>
                      <p className="text-sm leading-5 text-muted-foreground line-through decoration-muted-foreground/40">
                        {rec.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
