import { useMemo, useState } from "react";
import { Task } from "@/hooks/useTask";
import { KanbanSort } from "@/hooks/useKanbanPage";
import { differenceInDays, parseISO } from "date-fns";

export type ColumnConfig = {
  id: string;
  title: string;
  statuses: Task["status"][];
  wipLimit: number;
  color: string;
};

export const COLUMNS: ColumnConfig[] = [
  {
    id: "backlog",
    title: "Backlog",
    statuses: ["TODO"],
    wipLimit: 20,
    color: "gray",
  },
  {
    id: "in-progress",
    title: "In Progress",
    statuses: ["IN_PROGRESS"],
    wipLimit: 3,
    color: "blue",
  },
  {
    id: "review",
    title: "Review",
    statuses: ["IN_REVIEW"],
    wipLimit: 5,
    color: "purple",
  },
  {
    id: "blocked",
    title: "Blocked",
    statuses: ["BLOCKED"],
    wipLimit: 999,
    color: "red",
  },
  {
    id: "done",
    title: "Done",
    statuses: ["COMPLETED"],
    wipLimit: 999,
    color: "green",
  },
];

interface UseKanbanBoardProps {
  tasks: Task[];
  sort: KanbanSort;
  focusMode: boolean;
}

export function useKanbanBoard({ tasks, sort, focusMode }: UseKanbanBoardProps) {
  const [currentColumnIndex, setCurrentColumnIndex] = useState(0);

  // Group tasks by column
  const tasksByColumn = useMemo(() => {
    const grouped = new Map<string, Task[]>();

    COLUMNS.forEach((column) => {
      const columnTasks = tasks.filter((task) =>
        column.statuses.includes(task.status)
      );
      grouped.set(column.id, columnTasks);
    });

    return grouped;
  }, [tasks]);

  // Sort tasks within each column
  const sortedTasksByColumn = useMemo(() => {
    const sorted = new Map<string, Task[]>();

    tasksByColumn.forEach((tasks, columnId) => {
      const sortedTasks = [...tasks];

      switch (sort) {
        case "priority": {
          const priorityOrder: Record<string, number> = {
            URGENT: 0,
            HIGH: 1,
            MEDIUM: 2,
            LOW: 3,
          };
          sortedTasks.sort((a, b) => {
            const aPriority = priorityOrder[a.priority] ?? 999;
            const bPriority = priorityOrder[b.priority] ?? 999;
            return aPriority - bPriority;
          });
          break;
        }

        case "aging":
          sortedTasks.sort((a, b) => {
            const aAge = differenceInDays(new Date(), parseISO(a.updatedAt));
            const bAge = differenceInDays(new Date(), parseISO(b.updatedAt));
            return bAge - aAge;
          });
          break;

        case "recent":
          sortedTasks.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() -
              new Date(a.updatedAt).getTime()
          );
          break;

        case "comments":
          sortedTasks.sort((a, b) => b._count.comments - a._count.comments);
          break;
      }

      sorted.set(columnId, sortedTasks);
    });

    return sorted;
  }, [tasksByColumn, sort]);

  // Calculate column statistics
  const columnStats = useMemo(() => {
    const stats = new Map<
      string,
      {
        count: number;
        avgDays: number;
        isBottleneck: boolean;
      }
    >();

    COLUMNS.forEach((column) => {
      const tasks = sortedTasksByColumn.get(column.id) || [];
      const count = tasks.length;

      const totalDays = tasks.reduce((sum, task) => {
        return sum + differenceInDays(new Date(), parseISO(task.updatedAt));
      }, 0);
      const avgDays = tasks.length > 0 ? totalDays / tasks.length : 0;

      const isBottleneck = count > column.wipLimit * 0.8 && avgDays > 3;

      stats.set(column.id, { count, avgDays, isBottleneck });
    });

    return stats;
  }, [sortedTasksByColumn]);

  // Determine visible columns based on mode
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const visibleColumns = isMobile
    ? [COLUMNS[currentColumnIndex]]
    : focusMode
    ? COLUMNS.filter((c) => c.id !== "backlog" && c.id !== "done")
    : COLUMNS;

  const handlePreviousColumn = () => {
    setCurrentColumnIndex(Math.max(0, currentColumnIndex - 1));
  };

  const handleNextColumn = () => {
    setCurrentColumnIndex(Math.min(COLUMNS.length - 1, currentColumnIndex + 1));
  };

  return {
    sortedTasksByColumn,
    columnStats,
    visibleColumns,
    isMobile,
    currentColumnIndex,
    handlePreviousColumn,
    handleNextColumn,
  };
}