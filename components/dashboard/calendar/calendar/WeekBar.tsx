import { WeekRatio } from "@/hooks/useWeeklyComparison";
import { cn } from "@/lib/utils";

interface WeekBarProps {
  week: WeekRatio;
}

export function WeekBar({ week }: WeekBarProps) {
  const pct = Math.min(week.ratio * 100, 200);
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "w-16 text-xs shrink-0",
          week.isCurrent
            ? "font-semibold text-foreground"
            : "text-muted-foreground",
        )}
      >
        {week.isCurrent ? "This week" : week.label}
      </span>
      <div className="flex-1 h-4 bg-muted rounded-md overflow-hidden relative">
        <div
          className={cn(
            "h-full rounded-md transition-all",
            week.ratio > 1
              ? "bg-linear-to-r from-amber-400 to-amber-500"
              : week.isCurrent
                ? "bg-primary"
                : "bg-muted-foreground/20",
          )}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span
        className={cn(
          "w-12 text-xs text-right tabular-nums shrink-0",
          week.ratio > 1
            ? "text-amber-600 dark:text-amber-400 font-medium"
            : "text-muted-foreground",
        )}
      >
        {(week.ratio * 100).toFixed(0)}%
      </span>
    </div>
  );
}
