import { useState, useMemo } from "react";
import { useTasks, useTaskStats, TaskFilters, TaskSort } from "@/hooks/useTask";
import { useUserId } from "@/hooks/useUser";
import { getTaskTimeInfo } from "@/lib/task/time";
import { TeamTaskScope } from "@/components/Dashboard/TeamTask/TeamTaskFiltersBar";

const ITEMS_PER_PAGE = 10;

interface UseTeamTasksPageProps {
  workspaceId?: string;
}

export function useTeamTasksPage({ workspaceId }: UseTeamTasksPageProps) {
  // Get current user ID
  const userId = useUserId();

  // Filter states
  const [scope, setScope] = useState<TeamTaskScope>("all");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [attentionOnly, setAttentionOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<TaskSort['sortBy']>('dueDate');
  const [sortOrder, setSortOrder] = useState<TaskSort['sortOrder']>('asc');

  // Build backend filters
  const backendFilters: TaskFilters = useMemo(() => ({
    type: "assigned",
    workspaceId,
    status: status !== "all" ? status : undefined,
    priority: priority !== "all" ? priority : undefined,
    search: search.trim() || undefined,
  }), [workspaceId, status, priority, search]);

  // Build sort params
  const sort: TaskSort = useMemo(() => ({
    sortBy,
    sortOrder,
  }), [sortBy, sortOrder]);

  // Fetch team/assigned tasks with backend pagination
  const { data: tasksResponse, isLoading } = useTasks(
    backendFilters,
    currentPage,
    ITEMS_PER_PAGE,
    sort
  );

  const tasks = useMemo(() => tasksResponse?.data || [], [tasksResponse?.data]);
  const pagination = tasksResponse?.pagination;

  // Get stats for assigned tasks only
  const { data: stats } = useTaskStats(workspaceId, "assigned");

  // Apply ONLY client-side filters that can't be done on backend
  // (scope filtering and attention filtering)
  const filteredTasks = useMemo(() => {
    // If user not loaded yet, return all tasks
    if (!userId) return tasks;

    return tasks.filter((task) => {
      // Scope filtering (client-side only since it's complex)
      if (scope === "assigned_to_me") {
        if (!task.assignees.some((a) => a.user.id === userId)) return false;
      }

      if (scope === "i_assigned") {
        if (task.createdBy.id !== userId) return false;
      }

      if (scope === "collaborative") {
        if (task.assignees.length <= 1) return false;
      }

      // Needs Attention filter (client-side only)
      if (attentionOnly) {
        const { isOverdue, isDueToday } = getTaskTimeInfo(task);
        if (!(task.status === "BLOCKED" || isOverdue || isDueToday)) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, scope, attentionOnly, userId]);

  // Reset to page 1 when filters change
  const handleScopeChange = (newScope: TeamTaskScope) => {
    setScope(newScope);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handlePriorityChange = (value: string) => {
    setPriority(value);
    setCurrentPage(1);
  };

  const handleAttentionToggle = () => {
    setAttentionOnly((v) => !v);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: TaskSort['sortBy']) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  // Handle page change with smooth scroll
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get section title based on scope
  const getSectionTitle = () => {
    switch (scope) {
      case "assigned_to_me":
        return "Assigned to Me";
      case "i_assigned":
        return "I Assigned";
      case "collaborative":
        return "Collaborative Tasks";
      default:
        return "All Team Tasks";
    }
  };

  return {
    userId,
    stats,
    scope,
    setScope: handleScopeChange,
    search,
    setSearch: handleSearchChange,
    status,
    setStatus: handleStatusChange,
    priority,
    setPriority: handlePriorityChange,
    attentionOnly,
    setAttentionOnly: handleAttentionToggle,
    sortBy,
    sortOrder,
    setSortBy: handleSortChange,
    filteredTasks,
    paginatedTasks: filteredTasks, // Already paginated by backend
    currentPage,
    totalPages: pagination?.totalPages || 0,
    totalItems: pagination?.totalCount || 0,
    pagination,
    isLoading,
    handlePageChange,
    getSectionTitle,
  };
}