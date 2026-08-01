"use client";

import { Flame, Loader2 } from "lucide-react";
import { useFocusSessionStats } from "@/hooks/useFocusSession";
import { cn } from "@/lib/utils";

// ─── Streak tiers ────────────────────────────────────────────────────────────

interface StreakTier {
  label: string;
  message: string;
  badge: string;
  ring: string;
  bar: string;
}

function getStreakTier(streak: number): StreakTier {
  if (streak >= 7) {
    return {
      label: "On fire",
      message: "Incredible consistency — keep it going!",
      badge: "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400",
      ring: "from-green-500 to-emerald-500",
      bar: "bg-green-500",
    };
  }
  if (streak >= 3) {
    return {
      label: "Building",
      message: "Great momentum — a few more days to lock it in.",
      badge: "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400",
      ring: "from-yellow-500 to-amber-500",
      bar: "bg-yellow-500",
    };
  }
  return {
    label: "Getting started",
    message: "Complete one focus session today to start your streak.",
    badge: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
    ring: "from-red-500 to-rose-500",
    bar: "bg-red-500",
  };
}

// Cap the visual bar at 14 days (2 weeks) so the fill stays meaningful
function streakProgress(streak: number): number {
  return Math.min(streak / 14, 1) * 100;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function FocusStreakBadge() {
  const { data: stats, isLoading } = useFocusSessionStats();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="h-2 w-32 rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  // No data (e.g. query error) — hide the badge rather than spin forever
  if (!stats) return null;

  const streak = stats.focusStreak ?? 0;
  const tier = getStreakTier(streak);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        {/* Flame icon with tier ring */}
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm",
            tier.ring
          )}
        >
          <Flame className="h-4.5 w-4.5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">
              {streak} day{streak !== 1 ? "s" : ""} streak
            </p>
            <span
              className={cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded-full border shrink-0",
                tier.badge
              )}
            >
              {tier.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{tier.message}</p>
        </div>
      </div>

      {/* Streak progress bar */}
      <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", tier.bar)}
          style={{ width: `${streakProgress(streak)}%` }}
        />
      </div>
    </div>
  );
}
