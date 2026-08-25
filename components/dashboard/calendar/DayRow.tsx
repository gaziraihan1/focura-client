import { DayData } from "@/hooks/useDailyCapacityView";
import { cn } from "@/lib/utils";

interface DayRowProps {
  day: DayData;
  maxHours: number;
}

export function DayRow({ day, maxHours }: DayRowProps) {
  const plannedPct = maxHours > 0 ? (day.plannedHours / maxHours) * 100 : 0;
  const capacityPct = maxHours > 0 ? (day.capacityHours / maxHours) * 100 : 0;

  return (
    <div
      className={cn(
        "rounded-lg border p-3 transition-colors",
        day.isToday
          ? "border-primary/40 bg-primary/3"
          : "border-border bg-background",
        day.overCapacity && "border-amber-500/30 bg-amber-500/3"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-semibold w-8",
              day.isToday
                ? "text-primary"
                : "text-foreground"
            )}
          >
            {day.dayName}
          </span>
          {day.isToday && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
              Today
            </span>
          )}
          {!day.isWorkDay && day.plannedHours === 0 && (
            <span className="text-[10px] text-muted-foreground">Off</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs tabular-nums">
          <span
            className={cn(
              "font-medium",
              day.overCapacity
                ? "text-amber-600 dark:text-amber-400"
                : "text-foreground"
            )}
          >
            {day.plannedHours.toFixed(1)}h
          </span>
          <span className="text-muted-foreground">
            / {day.capacityHours.toFixed(0)}h
          </span>
        </div>
      </div>

      {/* Visual bars */}
      <div className="relative h-5 w-full rounded-md bg-muted overflow-hidden">
        {/* Capacity bar (background fill) */}
        <div
          className="absolute inset-y-0 left-0 rounded-md bg-primary/10 border-r border-border"
          style={{ width: `${capacityPct}%` }}
        />
        {/* Planned bar (foreground) */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-md transition-all",
            day.overCapacity
              ? "bg-linear-to-r from-amber-500 to-amber-400"
              : "bg-primary"
          )}
          style={{ width: `${Math.min(plannedPct, 100)}%` }}
        />
      </div>
    </div>
  );
}
