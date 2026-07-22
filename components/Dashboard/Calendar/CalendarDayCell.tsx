"use client";

import { Zap, Circle, Target, CheckCircle2 } from "lucide-react";
import type { CalendarDayAggregate } from "@/types/calendar.types";
import { GoalCheckpoint } from "@/types/calendarPage.types";
import { getWorkloadBarColor } from "@/utils/calendar.utils";

interface CalendarDayCellProps {
  date: Date;
  aggregate?: CalendarDayAggregate;
  goals: GoalCheckpoint[];
  isToday: boolean;
  isCurrentMonth: boolean;
  workloadColor: string;
  isSelected?: boolean;
  onClick: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export function CalendarDayCell({
  date,
  aggregate,
  goals,
  isToday,
  isCurrentMonth,
  workloadColor,
  isSelected = false,
  onClick,
  onKeyDown,
}: CalendarDayCellProps) {
  const dateLabel = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const taskSummary = aggregate
    ? `${aggregate.totalTasks} tasks, ${aggregate.plannedHours.toFixed(1)} hours planned`
    : "No tasks";

  return (
    <div
      role="gridcell"
      tabIndex={0}
      aria-label={`${dateLabel}, ${taskSummary}${isToday ? ", today" : ""}`}
      aria-selected={isSelected}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`
        min-h-27.5 sm:min-h-30 p-2 sm:p-3 border-r border-b last:border-r-0 border-border
        ${!isCurrentMonth ? "opacity-40" : ""}
        ${isToday ? "ring-2 ring-primary ring-inset" : ""}
        ${isSelected ? "ring-2 ring-primary bg-accent/50" : ""}
        ${workloadColor}
        transition-all hover:bg-accent/50 cursor-pointer relative
        group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset
      `}
    >
      {/* Date Number */}
      <div className="flex items-start justify-between mb-2">
        <span
          className={`
            text-sm font-medium
            ${isToday ? "bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center" : "text-foreground"}
          `}
          aria-hidden="true"
        >
          {date.getDate()}
        </span>

        {aggregate?.hasPrimaryFocus && (
          <Zap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" aria-label="Has primary focus" />
        )}
      </div>

      {/* Task Stats */}
      {aggregate && (
        <div className="space-y-1.5">
          {aggregate.totalTasks > 0 && (
            <div className="flex items-center flex-wrap gap-1.5 text-xs" aria-hidden="true">
              <div className="flex items-center gap-1">
                <Circle className="w-2 h-2 fill-current text-muted-foreground" />
                <span className="text-muted-foreground">{aggregate.totalTasks}</span>
              </div>
              {aggregate.criticalTasks > 0 && (
                <div className="flex items-center gap-1">
                  <Circle className="w-2 h-2 fill-current text-red-500" />
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {aggregate.criticalTasks}
                  </span>
                </div>
              )}
              {aggregate.milestoneCount > 0 && (
                <div className="flex items-center gap-1">
                  <Target className="w-2.5 h-2.5 text-blue-500" />
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {aggregate.milestoneCount}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Workload Bar */}
          {aggregate.plannedHours > 0 && (
            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">
                  {aggregate.plannedHours.toFixed(1)}h
                </span>
                {aggregate.focusMinutes > 0 && (
                  <span className="text-purple-600 dark:text-purple-400 font-medium">
                    {Math.round(aggregate.focusMinutes / 60)}h focus
                  </span>
                )}
              </div>
              <div
                className="h-1 bg-muted rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={Math.round(aggregate.workloadScore * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Workload: ${Math.round(aggregate.workloadScore * 100)}%`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getWorkloadBarColor(
                    aggregate.overCapacity,
                    aggregate.workloadScore
                  )}`}
                  style={{ width: `${Math.min(aggregate.workloadScore * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Review Day Badge */}
          {aggregate.isReviewDay && (
            <div className="text-[10px] text-muted-foreground italic" aria-label="Review day">
              Review
            </div>
          )}
        </div>
      )}

      {/* Goals */}
      {goals.length > 0 && (
        <div className="mt-2 space-y-1" aria-label={`${goals.length} goals`}>
          {goals.slice(0, 1).map((goal) => (
            <div key={goal.id} className="flex items-center gap-1.5 text-xs">
              {goal.completed ? (
                <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" aria-hidden="true" />
              ) : (
                <Target className="w-3 h-3 text-blue-500 shrink-0" aria-hidden="true" />
              )}
              <span className="truncate text-foreground font-medium">{goal.title}</span>
            </div>
          ))}
          {goals.length > 1 && (
            <div className="text-[10px] text-muted-foreground">
              +{goals.length - 1} more
            </div>
          )}
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/30 transition-colors pointer-events-none rounded" />
    </div>
  );
}
