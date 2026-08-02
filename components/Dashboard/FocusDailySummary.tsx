"use client";

import { Timer, Loader2, Target } from "lucide-react";
import { useFocusSessionDailySummary } from "@/hooks/useFocusSession";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  POMODORO: "Pomodoro",
  SHORT_BREAK: "Short break",
  LONG_BREAK: "Long break",
  DEEP_WORK: "Deep work",
  CUSTOM: "Custom",
};

export function FocusDailySummary() {
  const { data: summary, isLoading } = useFocusSessionDailySummary();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="h-2 w-36 rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const total = summary.totalMinutes;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  const timeLabel = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
          <Timer className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">
              {summary.totalSessions} session{summary.totalSessions !== 1 ? "s" : ""} today
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {timeLabel} of focused time
          </p>
        </div>
      </div>

      {summary.byType.length > 0 && (
        <div className="mt-3 space-y-1.5 border-t border-border pt-3">
          {summary.byType.map((t) => {
            const label = TYPE_LABELS[t.type] ?? t.type;
            const pct = total > 0 ? (t.minutes / total) * 100 : 0;
            return (
              <div key={t.type} className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground w-24 shrink-0">{label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-purple-500/70 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-12 text-right shrink-0">
                  {t.minutes}m
                </span>
              </div>
            );
          })}
        </div>
      )}

      {summary.totalSessions === 0 && (
        <p className={cn("mt-3 text-xs text-muted-foreground")}>
          No focus sessions yet today — start one to begin tracking.
        </p>
      )}
    </div>
  );
}
