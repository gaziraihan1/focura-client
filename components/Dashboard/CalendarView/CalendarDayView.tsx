import React from "react";
import { Task } from "@/hooks/useTask";
import { DayViewHeader } from "./CalendarDayView/DayViewHeader";
import { DayViewStats } from "./CalendarDayView/DayViewStats";
import { TaskPrioritySection } from "./CalendarDayView/TaskPrioritySection";
import { DayViewEmptyState } from "./CalendarDayView/DayViewEmptyState";
import { DayViewLoadingState } from "./CalendarDayView/DayViewLoadingState";
import { useCalendarDayView } from "@/hooks/useCalenderDayView";

interface CalendarDayViewProps {
  currentDate: Date;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  isLoading: boolean;
}

export function CalendarDayView({
  currentDate,
  tasks,
  onTaskClick,
  isLoading,
}: CalendarDayViewProps) {
  const { dayTasks, categorizedTasks, totalEstimatedHours } =
    useCalendarDayView(currentDate, tasks);

  if (isLoading) {
    return <DayViewLoadingState />;
  }

  return (
    <div className="h-full bg-background p-6 overflow-y-auto scrollbar-hide">
      <div className="mb-6">
        <DayViewHeader currentDate={currentDate} />
        <DayViewStats
          tasks={dayTasks}
          totalEstimatedHours={totalEstimatedHours}
        />
      </div>

      <TaskPrioritySection
        priority="overdue"
        tasks={categorizedTasks.overdue}
        onTaskClick={onTaskClick}
      />

      <TaskPrioritySection
        priority="urgent"
        tasks={categorizedTasks.urgent}
        onTaskClick={onTaskClick}
      />

      <TaskPrioritySection
        priority="high"
        tasks={categorizedTasks.high}
        onTaskClick={onTaskClick}
      />

      <TaskPrioritySection
        priority="medium"
        tasks={categorizedTasks.medium}
        onTaskClick={onTaskClick}
      />

      <TaskPrioritySection
        priority="low"
        tasks={categorizedTasks.low}
        onTaskClick={onTaskClick}
      />

      {dayTasks.length === 0 && <DayViewEmptyState />}
    </div>
  );
}