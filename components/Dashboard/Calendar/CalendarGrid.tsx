"use client";

import { useCallback, useRef, useState } from "react";
import { GoalCheckpoint } from "@/types/calendarPage.types";
import { CalendarDayCell } from "./CalendarDayCell";
import type { CalendarDayAggregate } from "@/types/calendar.types";
import { getWorkloadColor } from "@/utils/calendar.utils";

interface CalendarGridProps {
  calendarDays: Date[];
  getAggregateForDate: (date: Date) => CalendarDayAggregate | undefined;
  getGoalsForDate: (date: Date) => GoalCheckpoint[];
  isToday: (date: Date) => boolean;
  isCurrentMonth: (date: Date) => boolean;
  onDateClick: (date: Date) => void;
  onDateSelect?: (date: Date) => void;
}

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({
  calendarDays,
  getAggregateForDate,
  getGoalsForDate,
  isToday,
  isCurrentMonth,
  onDateClick,
  onDateSelect,
}: CalendarGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      const cols = 7;
      let newIndex = index;

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          newIndex = Math.min(index + 1, calendarDays.length - 1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          newIndex = Math.max(index - 1, 0);
          break;
        case "ArrowDown":
          e.preventDefault();
          newIndex = Math.min(index + cols, calendarDays.length - 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          newIndex = Math.max(index - cols, 0);
          break;
        case "Home":
          e.preventDefault();
          newIndex = 0;
          break;
        case "End":
          e.preventDefault();
          newIndex = calendarDays.length - 1;
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          onDateClick(calendarDays[index]);
          return;
        case "Escape":
          e.preventDefault();
          setSelectedIndex(null);
          return;
        default:
          return;
      }

      setSelectedIndex(newIndex);
      onDateSelect?.(calendarDays[newIndex]);

      // Focus the new cell
      const cells = gridRef.current?.querySelectorAll<HTMLElement>("[role='gridcell']");
      cells?.[newIndex]?.focus();
    },
    [calendarDays, onDateClick, onDateSelect]
  );

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/30" role="row">
        {DAY_HEADERS.map((day) => (
          <div
            key={day}
            className="p-3 sm:p-4 text-center text-sm font-semibold text-muted-foreground border-r last:border-r-0 border-border"
            role="columnheader"
            aria-label={day}
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-7"
        role="grid"
        aria-label="Calendar"
      >
        {calendarDays.map((day, index) => {
          const aggregate = getAggregateForDate(day);
          const workloadColor = aggregate
            ? getWorkloadColor(aggregate.workloadScore, aggregate.overCapacity)
            : "bg-background";
          const goals = getGoalsForDate(day);

          return (
            <CalendarDayCell
              key={index}
              date={day}
              aggregate={aggregate}
              goals={goals}
              isToday={isToday(day)}
              isCurrentMonth={isCurrentMonth(day)}
              workloadColor={workloadColor}
              isSelected={selectedIndex === index}
              onClick={() => onDateClick(day)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          );
        })}
      </div>
    </div>
  );
}
