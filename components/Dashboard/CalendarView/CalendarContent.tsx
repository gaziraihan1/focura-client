import { Task } from "@/hooks/useTask";
import { CalendarGrid } from "@/components/Dashboard/CalendarView/CalendarGrid";
import { ResponsiveSidebar } from "@/components/Dashboard/CalendarView/ResponsiveSidebar";

type CalendarView = "month" | "week" | "day";

interface CalendarContentProps {
  currentDate: Date;
  view: CalendarView;
  tasks: Task[];
  dateRange: {
    start: Date;
    end: Date;
  };
  isLoading: boolean;
  onTaskClick: (task: Task) => void;
}

export function CalendarContent({
  currentDate,
  view,
  tasks,
  dateRange,
  isLoading,
  onTaskClick,
}: CalendarContentProps) {
  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 overflow-auto scrollbar-hide">
        <CalendarGrid
          currentDate={currentDate}
          view={view}
          tasks={tasks}
          dateRange={dateRange}
          onTaskClick={onTaskClick}
          isLoading={isLoading}
        />
      </div>

      <ResponsiveSidebar
        currentDate={currentDate}
        tasks={tasks}
        onTaskClick={onTaskClick}
      />
    </div>
  );
}