import { useMemo } from "react";
import { Task } from "@/hooks/useTask";
import { differenceInDays, parseISO } from "date-fns";

type AgingStatus = "normal" | "warning" | "critical";

interface UseKanbanCardProps {
  task: Task;
  isBlocked: boolean;
}

export function useKanbanCard({ task }: UseKanbanCardProps) {
  const daysStale = useMemo(
    () => differenceInDays(new Date(), parseISO(task.updatedAt)),
    [task.updatedAt]
  );

  const agingStatus: AgingStatus = useMemo(() => {
    if (daysStale <= 2) return "normal";
    if (daysStale <= 5) return "warning";
    return "critical";
  }, [daysStale]);

  const isOverdue = useMemo(() => {
    return (
      task.dueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status !== "COMPLETED"
    );
  }, [task.dueDate, task.status]);

  const subtaskProgress = useMemo(() => {
    return task._count.subtasks > 0 ? task._count.subtasks * 0.7 : 0;
  }, [task._count.subtasks]);

  const getPriorityColor = (): string => {
    switch (task.priority) {
      case "URGENT":
        return "border-l-red-500 bg-red-50 dark:bg-red-950/20";
      case "HIGH":
        return "border-l-orange-500 bg-orange-50 dark:bg-orange-950/20";
      case "MEDIUM":
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20";
      case "LOW":
        return "border-l-gray-400 bg-gray-50 dark:bg-gray-950/20";
      default:
        return "border-l-gray-400 bg-gray-50 dark:bg-gray-950/20";
    }
  };

  const getAgingBorder = (): string => {
    if (agingStatus === "critical") return "ring-2 ring-destructive";
    if (agingStatus === "warning") return "ring-2 ring-amber-500";
    return "";
  };

  return {
    daysStale,
    agingStatus,
    isOverdue,
    subtaskProgress,
    getPriorityColor,
    getAgingBorder,
  };
}