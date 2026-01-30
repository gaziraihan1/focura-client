import { useState, useMemo } from "react";
import { useTasks, Task } from "@/hooks/useTask";

export type KanbanScope = "personal" | "assigned" | "team";
export type KanbanSort = "priority" | "aging" | "recent" | "comments";

export interface KanbanFilters {
  status?: string[];
  priority?: string[];
  assigneeId?: string;
  blockedOnly?: boolean;
  staleOnly?: boolean;
}

export function useKanbanPage() {
  const [scope, setScope] = useState<KanbanScope>("personal");
  const [filters, setFilters] = useState<KanbanFilters>({
    status: ["TODO", "IN_PROGRESS", "IN_REVIEW", "BLOCKED"],
  });
  const [sort, setSort] = useState<KanbanSort>("priority");
  const [focusMode, setFocusMode] = useState(false);
  const [enforceWIP, setEnforceWIP] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data: allTasks = [], isLoading } = useTasks();

  const scopedTasks = useMemo(() => {
    switch (scope) {
      case "personal":
        return allTasks.filter((task) => task.assignees.length === 0);
      case "assigned":
        return allTasks.filter((task) => task.assignees.length > 0);
      case "team":
        return allTasks;
      default:
        return allTasks;
    }
  }, [allTasks, scope]);

  const filteredTasks = useMemo(() => {
    let tasks = scopedTasks;

    if (filters.status && filters.status.length > 0) {
      tasks = tasks.filter((task) => filters.status!.includes(task.status));
    }

    if (filters.priority && filters.priority.length > 0) {
      tasks = tasks.filter((task) =>
        filters.priority!.includes(task.priority)
      );
    }

    if (filters.assigneeId) {
      tasks = tasks.filter((task) =>
        task.assignees.some((a) => a.user.id === filters.assigneeId)
      );
    }

    if (filters.blockedOnly) {
      tasks = tasks.filter((task) => task.status === "BLOCKED");
    }

    if (filters.staleOnly) {
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
      tasks = tasks.filter((task) => new Date(task.updatedAt) < fiveDaysAgo);
    }

    return tasks;
  }, [scopedTasks, filters]);

  const displayTasks = useMemo(() => {
    if (!focusMode) return filteredTasks;

    return filteredTasks.filter((task) => {
      const isHighPriority =
        task.priority === "URGENT" || task.priority === "HIGH";
      const isInProgress = task.status === "IN_PROGRESS";
      const isAssignedToMe = task.assignees.length > 0; 

      return isHighPriority && (isInProgress || isAssignedToMe);
    });
  }, [filteredTasks, focusMode]);

  const taskCounts = useMemo(() => {
    const total = displayTasks.length;
    const inProgress = displayTasks.filter(
      (t) => t.status === "IN_PROGRESS"
    ).length;
    const blocked = displayTasks.filter((t) => t.status === "BLOCKED").length;

    return { total, inProgress, blocked };
  }, [displayTasks]);

  return {
    scope,
    setScope,
    filters,
    setFilters,
    sort,
    setSort,
    focusMode,
    setFocusMode,
    enforceWIP,
    setEnforceWIP,
    showInsights,
    setShowInsights,
    selectedTask,
    setSelectedTask,
    displayTasks,
    taskCounts,
    isLoading,
  };
}

interface UseExecutionControlBarProps {
  filters: KanbanFilters;
  onFiltersChange: (filters: KanbanFilters) => void;
}

export function useExecutionControlBar({
  filters,
  onFiltersChange,
}: UseExecutionControlBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount =
    (filters.priority?.length || 0) +
    (filters.blockedOnly ? 1 : 0) +
    (filters.staleOnly ? 1 : 0);

  const togglePriority = (priority: string) => {
    const current = filters.priority || [];
    const updated = current.includes(priority)
      ? current.filter((p) => p !== priority)
      : [...current, priority];
    onFiltersChange({
      ...filters,
      priority: updated.length > 0 ? updated : undefined,
    });
  };

  const toggleBlockedOnly = () => {
    onFiltersChange({ ...filters, blockedOnly: !filters.blockedOnly });
  };

  const toggleStaleOnly = () => {
    onFiltersChange({ ...filters, staleOnly: !filters.staleOnly });
  };

  const clearFilters = () => {
    onFiltersChange({ status: filters.status });
  };

  const toggleFiltersPanel = () => {
    setShowFilters((prev) => !prev);
  };

  return {
    showFilters,
    activeFilterCount,
    togglePriority,
    toggleBlockedOnly,
    toggleStaleOnly,
    clearFilters,
    toggleFiltersPanel,
  };
}