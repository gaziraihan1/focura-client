import { useState, useMemo } from "react";
import { useTasks, useTaskStats } from "@/hooks/useTask";
import { useUserId } from "@/hooks/useUser";
import { usePagination } from "@/hooks/usePagination";
import { getTaskTimeInfo } from "@/lib/task/time";
import { TeamTaskScope } from "@/components/Dashboard/TeamTask/TeamTaskFiltersBar";

const ITEMS_PER_PAGE = 10;

interface UseTeamTasksPageProps {
  workspaceId?: string;
}

export function useTeamTasksPage({ workspaceId }: UseTeamTasksPageProps) {
  // Get current user ID
  const userId = useUserId();

  // Fetch team/assigned tasks
  const { data: tasks = [], isLoading } = useTasks({
    type: "assigned",
    workspaceId,
  });

  // Get stats for assigned tasks only
  const { data: stats } = useTaskStats(workspaceId, "assigned");

  // Filter states
  const [scope, setScope] = useState<TeamTaskScope>("all");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [attentionOnly, setAttentionOnly] = useState(false);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    // If user not loaded yet, return all tasks
    if (!userId) return tasks;

    return tasks.filter((task) => {
      // Scope filtering
      if (scope === "assigned_to_me") {
        if (!task.assignees.some((a) => a.user.id === userId)) return false;
      }

      if (scope === "i_assigned") {
        if (task.createdBy.id !== userId) return false;
      }

      if (scope === "collaborative") {
        if (task.assignees.length <= 1) return false;
      }

      // Search filter
      if (
        search &&
        !task.title.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (status !== "all" && task.status !== status) {
        return false;
      }

      // Priority filter
      if (priority !== "all" && task.priority !== priority) {
        return false;
      }

      // Needs Attention filter
      if (attentionOnly) {
        const { isOverdue, isDueToday } = getTaskTimeInfo(task);
        if (!(task.status === "BLOCKED" || isOverdue || isDueToday)) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, scope, search, status, priority, attentionOnly, userId]);

  // Use pagination hook
  const {
    currentPage,
    totalPages,
    totalItems,
    paginatedItems,
    setCurrentPage,
    resetPage,
  } = usePagination({
    items: filteredTasks,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  // Reset to page 1 when filters change
  const handleFilterChange = <T,>(filterSetter: (value: T) => void) => {
    return (value: T) => {
      filterSetter(value);
      resetPage();
    };
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

  // Handle attention toggle separately (doesn't take a value)
  const handleAttentionToggle = () => {
    setAttentionOnly((v) => !v);
    resetPage();
  };

  return {
    userId,
    stats,
    scope,
    setScope,
    search,
    setSearch,
    status,
    setStatus,
    priority,
    setPriority,
    attentionOnly,
    setAttentionOnly,
    filteredTasks,
    paginatedTasks: paginatedItems,
    currentPage,
    totalPages,
    totalItems,
    isLoading,
    handleFilterChange,
    handlePageChange,
    handleAttentionToggle,
    getSectionTitle,
  };
}