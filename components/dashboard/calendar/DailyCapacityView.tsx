"use client";

import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { ExportButton } from "@/components/dashboard/calendar/ExportButton";
import { format } from "date-fns";
import {
  useDailyCapacityView,
} from "@/hooks/useDailyCapacityView";
import { DayRow } from "./DayRow";

// ─── Component ─────────────────────────────────────────────────────────────

export function DailyCapacityView() {
  const {
    expanded,
    setExpanded,
    chartContentRef,
    loading,
    isEmpty,
    error,
    refetch,
    weekStart,
    weekEnd,
    dailyCapacity,
    dailyData,
    totalPlanned,
    totalCapacity,
    overDays,
    maxHours,
  } = useDailyCapacityView();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
            <AlertCircle className="w-4.5 h-4.5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground">This Week Daily</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Retry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isEmpty && !expanded) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <CalendarDays className="w-4.5 h-4.5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground">This Week Daily</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              No tasks planned this week. Add tasks to see daily capacity.
            </p>
          </div>
          <button
            onClick={() => setExpanded(true)}
            className="text-xs font-medium px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors shrink-0"
          >
            Show empty view
          </button>
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
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
            <CalendarDays className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="min-w-0 text-left">
            <h4 className="text-sm font-semibold text-foreground">
              This Week Daily
            </h4>
            <p className="text-xs text-muted-foreground">
              {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d")}
              {totalPlanned > 0 && ` | ${totalPlanned.toFixed(0)}h planned`}
            </p>
          </div>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          {expanded && (
            <ExportButton
              chartRef={chartContentRef}
              filename="daily-capacity"
            />
          )}
          {overDays > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              {overDays} over
            </span>
          )}
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
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <SummaryCard
              label="Week Planned"
              value={`${totalPlanned.toFixed(0)}h`}
              color="text-blue-600 dark:text-blue-400"
            />
            <SummaryCard
              label="Week Capacity"
              value={`${totalCapacity.toFixed(0)}h`}
              color="text-emerald-600 dark:text-emerald-400"
            />
            <SummaryCard
              label="Daily Avg Planned"
              value={`${(totalPlanned / 7).toFixed(1)}h`}
              color="text-blue-600 dark:text-blue-400"
            />
            <SummaryCard
              label="Daily Capacity"
              value={`${dailyCapacity}h`}
              color="text-emerald-600 dark:text-emerald-400"
            />
          </div>

          {/* Daily bars */}
          <div className="space-y-3">
            {dailyData.map((day) => (
              <DayRow key={day.dateKey} day={day} maxHours={maxHours} />
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-primary" />
              Planned hours
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-primary/15 border border-border" />
              Capacity
            </span>
            {overDays > 0 && (
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Over capacity
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
// ─── SummaryCard ────────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string;
  value: string;
  color: string;
}

function SummaryCard({ label, value, color }: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}
