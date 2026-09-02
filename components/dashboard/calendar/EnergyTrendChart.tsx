"use client";

import { useMemo, useState } from "react";
import { Brain, ChevronDown, ChevronUp, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useEnergyHistory } from "@/hooks/useEnergyLevel";
import { Button } from "@/components/ui/Button";

// ─── Helpers ───────────────────────────────────────────────────────────────

function getBarColor(level: number): string {
  if (level >= 8) return "bg-green-500";
  if (level >= 5) return "bg-yellow-500";
  return "bg-red-500";
}

// ─── Component ─────────────────────────────────────────────────────────────

export function EnergyTrendChart() {
  const [expanded, setExpanded] = useState(false);

  // Last 30 days of energy history
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 29);
    return { startDate: start, endDate: end };
  }, []);

  const { data: history, loading, error, refetch } = useEnergyHistory(startDate, endDate, 1, 31);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Loader2 className="w-4.5 h-4.5 animate-spin text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground">Energy Trend</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Loading your energy history…</p>
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
            <h4 className="text-sm font-semibold text-foreground">Energy Trend</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="shrink-0 gap-1.5 px-2.5 py-1.5 text-muted-foreground"
            aria-label="Retry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // ── Empty ─────────────────────────────────────────────────────────────────
  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Brain className="w-4.5 h-4.5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground">Energy Trend</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              No energy data yet. Log your daily energy level to see trends over time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Oldest → newest for display
  const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const avg = Math.round((sorted.reduce((s, e) => s + e.energyLevel, 0) / sorted.length) * 10) / 10;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <Button
        variant="ghost"
        onClick={() => setExpanded(!expanded)}
        className="w-full justify-between p-4 text-left hover:bg-accent/30"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
            <Brain className="w-4.5 h-4.5 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-semibold">Energy Trend</h4>
            <p className="text-xs text-muted-foreground">
              {sorted.length} day{sorted.length !== 1 ? "s" : ""} · avg {avg}/10
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </Button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Bars */}
          <div className="flex items-end gap-1 h-28">
            {sorted.map((entry) => {
              const d = new Date(entry.date);
              const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              return (
                <div key={entry.id} className="flex-1 flex flex-col items-center gap-1 group relative min-w-0">
                  <div
                    className={`w-full rounded-t ${getBarColor(entry.energyLevel)} transition-all min-h-1`}
                    style={{ height: `${Math.max(entry.energyLevel * 10, 4)}%` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover border border-border rounded-lg px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <p className="font-medium">{label}</p>
                    <p className="text-muted-foreground">{entry.energyLevel}/10</p>
                    {entry.note && <p className="text-muted-foreground max-w-40 truncate">{entry.note}</p>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" /> High (8-10)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-500" /> Medium (5-7)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Low (1-4)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
