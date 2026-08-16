"use client";

import { useMemo } from "react";
import { BarChart3, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useBurnoutTrends } from "@/hooks/useBurnoutTrends";
import type { BurnoutTrend } from "@/types/calendar.types";
import { formatHours } from "@/utils/analytics.utils";

// ─── Helpers ───────────────────────────────────────────────────────────────

const RISK_TEXT: Record<string, string> = {
  LOW: "text-green-600 dark:text-green-400",
  MODERATE: "text-yellow-600 dark:text-yellow-400",
  HIGH: "text-orange-600 dark:text-orange-400",
  CRITICAL: "text-red-600 dark:text-red-400",
};

const RISK_BG: Record<string, string> = {
  LOW: "bg-green-500/10 border-green-500/20",
  MODERATE: "bg-yellow-500/10 border-yellow-500/20",
  HIGH: "bg-orange-500/10 border-orange-500/20",
  CRITICAL: "bg-red-500/10 border-red-500/20",
};

const RISK_DOT: Record<string, string> = {
  LOW: "bg-green-500",
  MODERATE: "bg-yellow-500",
  HIGH: "bg-orange-500",
  CRITICAL: "bg-red-500",
};

function formatWeek(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** Bar width % for the load cell — load 1.5 = full bar (the CRITICAL threshold). */
function loadBar(load: number): number {
  return Math.min(100, Math.max(0, (load / 1.5) * 100));
}

function energyBar(energy: number | null): number {
  return energy === null ? 0 : Math.min(100, (energy / 10) * 100);
}

/** Focus hours as a fraction of a 40h work week. */
function focusBar(minutes: number): number {
  return Math.min(100, (minutes / 60 / 40) * 100);
}

// ─── Row ───────────────────────────────────────────────────────────────────

function WeekRow({ week }: { week: BurnoutTrend }) {
  const riskClass = RISK_TEXT[week.riskLevel] ?? "text-muted-foreground";
  const riskBg = RISK_BG[week.riskLevel] ?? "bg-muted";

  return (
    <tr className="hover:bg-accent/30 transition-colors">
      {/* Week */}
      <td className="px-4 py-3 font-medium whitespace-nowrap">
        {formatWeek(week.weekStart)}
      </td>

      {/* Risk */}
      <td className="px-3 py-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${riskBg} ${riskClass}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${RISK_DOT[week.riskLevel] ?? "bg-muted"}`} />
          {week.riskLevel}
        </span>
      </td>

      {/* Load */}
      <td className="px-3 py-3 min-w-28">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-orange-500/70"
              style={{ width: `${loadBar(week.avgDailyLoad)}%` }}
            />
          </div>
          <span className="text-xs font-semibold tabular-nums w-9 text-right">
            {week.avgDailyLoad.toFixed(2)}
          </span>
        </div>
        {week.consecutiveHeavyDays > 0 && (
          <p className="text-[10px] text-orange-500 dark:text-orange-400 mt-1">
            {week.consecutiveHeavyDays} heavy day{week.consecutiveHeavyDays === 1 ? "" : "s"}
          </p>
        )}
      </td>

      {/* Energy */}
      <td className="px-3 py-3 min-w-28">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500/70"
              style={{ width: `${energyBar(week.avgEnergy)}%` }}
            />
          </div>
          <span className="text-xs font-semibold tabular-nums w-10 text-right">
            {week.avgEnergy !== null ? `${week.avgEnergy.toFixed(1)}` : "—"}
          </span>
        </div>
        {week.lowEnergyDays > 0 && (
          <p className="text-[10px] text-red-500 dark:text-red-400 mt-1">
            {week.lowEnergyDays} low-energy day{week.lowEnergyDays === 1 ? "" : "s"}
          </p>
        )}
      </td>

      {/* Focus */}
      <td className="px-3 py-3 min-w-28">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-purple-500/70"
              style={{ width: `${focusBar(week.focusMinutes)}%` }}
            />
          </div>
          <span className="text-xs font-semibold tabular-nums w-9 text-right">
            {formatHours(week.focusMinutes / 60)}
          </span>
        </div>
        {week.focusOverloadDays > 0 && (
          <p className="text-[10px] text-orange-500 dark:text-orange-400 mt-1">
            {week.focusOverloadDays} overload day{week.focusOverloadDays === 1 ? "" : "s"}
          </p>
        )}
      </td>

      {/* Strain summary */}
      <td className="px-4 py-3 whitespace-nowrap">
        {week.lowEnergyDays > 0 || week.focusOverloadDays > 0 ? (
          <span className="text-xs text-muted-foreground">
            {week.lowEnergyDays > 0 && week.focusOverloadDays > 0
              ? "Energy + focus"
              : week.lowEnergyDays > 0
                ? "Energy strain"
                : "Focus strain"}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/60">—</span>
        )}
      </td>
    </tr>
  );
}

// ─── Table ─────────────────────────────────────────────────────────────────

export function WeeklyStrainBreakdown() {
  const { data, loading, error, refetch } = useBurnoutTrends(12);

  // Newest week first — the API returns weeks in ascending order.
  const weeks = useMemo(() => [...data].reverse(), [data]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Loader2 className="w-4.5 h-4.5 animate-spin text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground">Weekly Strain Breakdown</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Loading your weekly breakdown…</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
            <AlertCircle className="w-4.5 h-4.5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground">Weekly Strain Breakdown</h4>
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

  // ── Empty ─────────────────────────────────────────────────────────────────
  if (weeks.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <BarChart3 className="w-4.5 h-4.5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground">Weekly Strain Breakdown</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Not enough data yet. Keep logging your energy and focus to see week-by-week trends.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10">
          <BarChart3 className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Weekly Strain Breakdown</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Energy, focus, and load side by side — {weeks.length} week
            {weeks.length !== 1 ? "s" : ""} of data
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/40">
              <th className="px-4 py-2.5 font-medium whitespace-nowrap">Week</th>
              <th className="px-3 py-2.5 font-medium whitespace-nowrap">Risk</th>
              <th className="px-3 py-2.5 font-medium whitespace-nowrap">
                Load <span className="font-normal text-muted-foreground/70">/1.5</span>
              </th>
              <th className="px-3 py-2.5 font-medium whitespace-nowrap">
                Energy <span className="font-normal text-muted-foreground/70">/10</span>
              </th>
              <th className="px-3 py-2.5 font-medium whitespace-nowrap">
                Focus <span className="font-normal text-muted-foreground/70">/40h</span>
              </th>
              <th className="px-4 py-2.5 font-medium whitespace-nowrap">Strain</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <WeekRow key={week.weekStart} week={week} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-3 border-t border-border text-xs text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500/70" /> Load
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500/70" /> Energy
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-500/70" /> Focus
        </span>
      </div>
    </div>
  );
}
