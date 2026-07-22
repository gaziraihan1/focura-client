import { useState, useMemo } from "react";
import { useTasks, Task } from "@/hooks/useTask";
import { useWorkspace } from "@/hooks/useWorkspace";
import { KanbanScope, KanbanSort, KanbanFilters } from "@/hooks/useKanbanPage";

interface UseWorkspaceKanbanPageProps {
  workspaceSlug: string;
}

export function useWorkspaceKanbanPage({
  workspaceSlug,
}: UseWorkspaceKanbanPageProps) {
  const [scope, setScope] = useState<KanbanScope>("personal");
  const [filters, setFilters] = useState<KanbanFilters>({
    status: ["TODO", "IN_PROGRESS", "IN_REVIEW", "BLOCKED"],
  });
  const [sort, setSort] = useState<KanbanSort>("priority");
  const [focusMode, setFocusMode] = useState(false);
  const [enforceWIP, setEnforceWIP] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Resolve workspace ID from slug — same pattern as useWorkspaceTasksPage
  const { data: workspace } = useWorkspace(workspaceSlug);

  // Pass workspaceId as a filter so only workspace-scoped tasks are fetched.
  // useTasks already accepts a filters object; we merge workspaceId in.
  const taskFilters = useMemo(
  () => ({ workspaceId: workspace?.id }),
  [workspace?.id]
);

  const { data, isLoading } = useTasks(taskFilters);

  // Client-side guard: only show tasks that actually belong to this workspace.
  const allTasks = useMemo(() => {
    if (!workspace?.id) return data?.data || [];
    return (data?.data || []).filter(
      (t) =>
        t.workspaceId === workspace.id ||
        t.project?.workspace?.id === workspace.id,
    );
  }, [data, workspace]);

  // Scope filtering — identical logic to the global hook
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
    // Workspace context
    workspace,
    workspaceSlug,
    // Shared kanban state — identical shape to useKanbanPage
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