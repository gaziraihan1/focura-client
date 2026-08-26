import { Task } from "@/hooks/useTask";
import { DayViewHeader } from "./DayViewHeader";
import { DayViewStats } from "./DayViewStats";
import { TaskPrioritySection } from "./TaskPrioritySection";
import { Calendar as CalendarIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { DayViewLoadingState } from "./DayViewLoadingState";
import { useCalendarDayView } from "@/hooks/useCalendarDayView";

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
    <div className="h-full bg-background px-3 py-5 overflow-y-auto scrollbar-hide">
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

      {dayTasks.length === 0 && (
        <EmptyState
          icon={CalendarIcon}
          title="No tasks scheduled"
          description="You have a free day! Enjoy your time or add some tasks."
        />
      )}
    </div>
  );
}