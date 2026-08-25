"use client";

import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  Loader2,
  CalendarRange,
} from "lucide-react";
import { ExportButton } from "@/components/dashboard/calendar/ExportButton";
import { cn } from "@/lib/utils";
import {
  useWeeklyComparison,
} from "@/hooks/useWeeklyComparison";
import { WeekBar } from "./WeekBar";
import { ComparisonCard } from "./ComparisonCard";

// ─── Component ─────────────────────────────────────────────────────────────

export function WeeklyComparison() {
  const {
    expanded,
    setExpanded,
    chartContentRef,
    loading,
    isEmpty,
    ratios,
    currentWeek,
    currentRatio,
    avgRatio,
    difference,
    totalOver,
  } = useWeeklyComparison();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <CalendarRange className="w-4.5 h-4.5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground">Weekly Comparison</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Not enough data to compare. Track tasks across weeks to see trends.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 p-4">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left transition-colors hover:bg-accent/30"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
            <CalendarRange className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="min-w-0 text-left">
            <h4 className="text-sm font-semibold text-foreground">
              Weekly Comparison
            </h4>
            <p className="text-xs text-muted-foreground">
              This week vs 8-week average
            </p>
          </div>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          {expanded && (
            <ExportButton
              chartRef={chartContentRef}
              filename="weekly-comparison"
            />
          )}
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full border",
              currentRatio > avgRatio
                ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
            )}
          >
            {difference > 0 ? "+" : ""}
            {(difference * 100).toFixed(0)}%
          </span>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse chart" : "Expand chart"}
            className="rounded-lg p-1 transition-colors hover:bg-accent"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {expanded && (
        <div ref={chartContentRef} className="px-4 pb-6">
          {/* Main comparison card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* This Week */}
            <ComparisonCard
              label="This Week"
              ratio={currentRatio}
              overCapacity={currentWeek?.overCapacity ?? false}
              emphasis
            />

            {/* 8-Week Average */}
            <ComparisonCard
              label="8-Week Average"
              ratio={avgRatio}
              overCapacity={false}
              emphasis={false}
            />

            {/* Difference */}
            <div className="rounded-xl border border-border bg-background p-4 flex flex-col items-center justify-center">
              <p className="text-xs text-muted-foreground mb-1">
                vs Average
              </p>
              <div className="flex items-center gap-2">
                {difference > 0.05 ? (
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                ) : difference < -0.05 ? (
                  <TrendingDown className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Minus className="w-5 h-5 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "text-2xl font-bold",
                    difference > 0.05
                      ? "text-amber-600 dark:text-amber-400"
                      : difference < -0.05
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-foreground",
                  )}
                >
                  {difference > 0 ? "+" : ""}
                  {(difference * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {difference > 0.05
                  ? "Higher than average"
                  : difference < -0.05
                    ? "Lower than average"
                    : "On par with average"}
              </p>
            </div>
          </div>

          {/* Weekly ratio bars */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground mb-3">
              Weekly utilization (planned ÷ capacity)
            </p>
            {ratios.map((week) => (
              <WeekBar key={week.weekStart} week={week} />
            ))}
          </div>

          {/* Summary */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-primary" />
              This week
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-muted-foreground/30" />
              Previous weeks
            </span>
            {currentRatio > 1 && (
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Over capacity
              </span>
            )}
            <span className="text-muted-foreground">
              {totalOver} of {ratios.length} weeks over capacity
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
