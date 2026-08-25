"use client";

// components/Dashboard/Workspaces/project/Tasks/ProjectTasksCalendar.tsx
// Project-scoped calendar view for the project tasks page. Reuses the full
// calendar stack (month/week/day grid, sidebar, task modal) that powers the
// workspace-level calendar page, fed with this project's filtered tasks.

import { useCallback, useMemo, useState } from "react";import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { Task } from "@/hooks/useTask";
import { CalendarHeader } from "@/components/dashboard/calendar/calendar-view/CalendarHeader";
import { CalendarContent } from "@/components/dashboard/calendar/calendar-view/CalendarContent";
import { TaskDetailsModal } from "@/components/dashboard/calendar/calendar-view/TaskDetailsModal";

type CalendarView = "month" | "week" | "day";

interface ProjectTasksCalendarProps {
  tasks: Task[];
  isLoading: boolean;
}

export function ProjectTasksCalendar({ tasks, isLoading }: ProjectTasksCalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [view, setView] = useState<CalendarView>("month");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showOnlyTimeBound, setShowOnlyTimeBound] = useState(true);

  // Time-bound toggle mirrors the workspace calendar page: when on, only tasks
  // with a start/due date are placed on the grid.
  const filteredTasks = useMemo(
    () => (showOnlyTimeBound ? tasks.filter((t) => t.startDate || t.dueDate) : tasks),
    [tasks, showOnlyTimeBound],
  );

  const dateRange = useMemo(
    () => ({
      start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 }),
      end: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 }),
    }),
    [currentDate],
  );

  const handlePrevious = useCallback(() => {
    setCurrentDate((prev) =>
      view === "month" ? subMonths(prev, 1) : view === "week" ? subWeeks(prev, 1) : subDays(prev, 1),
    );
  }, [view]);

  const handleNext = useCallback(() => {
    setCurrentDate((prev) =>
      view === "month" ? addMonths(prev, 1) : view === "week" ? addWeeks(prev, 1) : addDays(prev, 1),
    );
  }, [view]);

  const handleToday = useCallback(() => setCurrentDate(new Date()), []);
  const handleTaskClick = useCallback((task: Task) => setSelectedTask(task), []);
  const handleCloseTaskModal = useCallback(() => setSelectedTask(null), []);

  return (
    <div className="flex h-[calc(100vh-18rem)] min-h-[480px] flex-col overflow-hidden rounded-xl border border-border bg-card">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        showOnlyTimeBound={showOnlyTimeBound}
        onToggleTimeBound={setShowOnlyTimeBound}
      />

      <div className="min-h-0 flex-1">
        <CalendarContent
          currentDate={currentDate}
          view={view}
          tasks={filteredTasks}
          dateRange={dateRange}
          isLoading={isLoading}
          onTaskClick={handleTaskClick}
        />
      </div>

      {selectedTask && <TaskDetailsModal task={selectedTask} onClose={handleCloseTaskModal} />}
    </div>
  );
}
