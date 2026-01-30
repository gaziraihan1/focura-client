import { useMemo } from "react";
import { format, isPast } from "date-fns";
import { Task } from "@/hooks/useTask";

interface CategorizedTasks {
  urgent: Task[];
  high: Task[];
  medium: Task[];
  low: Task[];
  overdue: Task[];
}

export function useCalendarDayView(currentDate: Date, tasks: Task[]) {
  // Filter tasks for the current day
  const dayTasks = useMemo(() => {
    const dateKey = format(currentDate, "yyyy-MM-dd");
    return tasks.filter((task) => {
      const taskDate = task.dueDate || task.startDate;
      if (!taskDate) return false;
      return format(new Date(taskDate), "yyyy-MM-dd") === dateKey;
    });
  }, [tasks, currentDate]);

  // Categorize tasks by priority
  const categorizedTasks = useMemo<CategorizedTasks>(() => {
    const urgent: Task[] = [];
    const high: Task[] = [];
    const medium: Task[] = [];
    const low: Task[] = [];
    const overdue: Task[] = [];

    dayTasks.forEach((task) => {
      if (
        task.dueDate &&
        isPast(new Date(task.dueDate)) &&
        task.status !== "COMPLETED"
      ) {
        overdue.push(task);
        return;
      }

      switch (task.priority) {
        case "URGENT":
          urgent.push(task);
          break;
        case "HIGH":
          high.push(task);
          break;
        case "MEDIUM":
          medium.push(task);
          break;
        case "LOW":
          low.push(task);
          break;
      }
    });

    return { urgent, high, medium, low, overdue };
  }, [dayTasks]);

  // Calculate total estimated hours
  const totalEstimatedHours = useMemo(() => {
    return dayTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
  }, [dayTasks]);

  return {
    dayTasks,
    categorizedTasks,
    totalEstimatedHours,
  };
}