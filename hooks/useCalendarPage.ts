import { useState, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from "date-fns";
import { Task, useTasks } from "@/hooks/useTask";

type CalendarView = "month" | "week" | "day";

export function useCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showOnlyTimeBound, setShowOnlyTimeBound] = useState(true);

  const { data: tasks = [], isLoading } = useTasks();

  // Filter tasks based on time-bound toggle
  const filteredTasks = useMemo(() => {
    if (!showOnlyTimeBound) return tasks;
    return tasks.filter((task) => task.dueDate || task.startDate);
  }, [tasks, showOnlyTimeBound]);

  // Calculate date range for the calendar view
  const dateRange = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    return { start, end };
  }, [currentDate]);

  // Navigation handlers
  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseTaskModal = () => {
    setSelectedTask(null);
  };

  return {
    currentDate,
    view,
    setView,
    selectedTask,
    showOnlyTimeBound,
    setShowOnlyTimeBound,
    filteredTasks,
    dateRange,
    isLoading,
    handlePrevious,
    handleNext,
    handleToday,
    handleTaskClick,
    handleCloseTaskModal,
  };
}