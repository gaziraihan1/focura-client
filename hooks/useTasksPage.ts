import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTasks, useTaskStats, TaskFilters, TaskSort, usePersonalQuota, useTask } from "@/hooks/useTask";
import { useUserProfile } from "./useUser";
import { useFocusSession } from "./useFocusSession";
import { syncFocusTimer } from "./useFocusTimeRemaining";
import { useUpdateSearchParams } from "./useUpdateSearchParams";
import { useDebouncedValue } from "./useDebouncedValue";

export const DEFAULT_PAGE_SIZE = 10;

/**
 * Personal tasks page controller.
 *
 * All view state (tab, status, priority, sort, pagination, focus filter) is
 * derived FROM the URL search params — the URL is the single source of truth,
 * so filtered views are shareable and back/forward restores state. Handlers
 * patch the URL instead of setting local state; re-renders flow from the
 * resulting searchParams change. Only `searchQuery` keeps local state (the
 * text input needs synchronous feedback while typing) but is mirrored to the
 * URL as well.
 */
export function useTasksPage() {
  const { userId } = useUserProfile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateParams = useUpdateSearchParams();

  // ── View state: derived from URL ────────────────────────────────────────────
  const activeTab = (searchParams.get("tab") as "all" | "personal" | "assigned") || "all";
  const selectedStatus = searchParams.get("status") ?? "all";
  const selectedPriority = searchParams.get("priority") ?? "all";
  const currentPage = Number(searchParams.get("page")) || 1;
  const sortBy = (searchParams.get("sortBy") as TaskSort["sortBy"]) || "priority";
  const sortOrder = (searchParams.get("sortOrder") as TaskSort["sortOrder"]) || "asc";
  const focusRequired = searchParams.get("focusRequired") === "true";
  const pageSize = DEFAULT_PAGE_SIZE;

  // ── Search input: local for responsiveness, debounced-mirrored to URL ──────
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") ?? "");
  const debouncedSearch = useDebouncedValue(searchQuery, 400);
  const isFirstSearchSync = useRef(true);
  useEffect(() => {
    // Skip the initial run so an existing ?search= param isn't rewritten.
    if (isFirstSearchSync.current) {
      isFirstSearchSync.current = false;
      return;
    }
    updateParams({ search: debouncedSearch.trim() || null, page: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const filters: TaskFilters = useMemo(
    () => ({ type: activeTab, status: selectedStatus !== "all" ? selectedStatus : undefined, priority: selectedPriority !== "all" ? selectedPriority : undefined, search: searchQuery.trim() || undefined, userId, focusRequired: focusRequired || undefined }),
    [activeTab, selectedStatus, selectedPriority, searchQuery, userId, focusRequired],
  );

  const sort: TaskSort = useMemo(() => ({ sortBy, sortOrder }), [sortBy, sortOrder]);

  const { data: tasksResponse, isLoading, isError } = useTasks(filters, currentPage, pageSize, sort);
  const tasks = tasksResponse?.data || [];
  const pagination = tasksResponse?.pagination;
  const { data: quota } = usePersonalQuota();
  const { data: stats } = useTaskStats(undefined, activeTab);

  // Every filter change resets to page 1 (page param removed when back on 1).
  const handleTabChange = (tab: "all" | "personal" | "assigned") => {
    updateParams({ tab: tab === "all" ? null : tab, page: null });
  };
  const handleStatusChange = (status: string) => {
    updateParams({ status: status === "all" ? null : status, page: null });
  };
  const handlePriorityChange = (priority: string) => {
    updateParams({ priority: priority === "all" ? null : priority, page: null });
  };
  const handleFocusRequiredChange = (value: boolean) => {
    updateParams({ focusRequired: value ? "true" : null, page: null });
  };
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };
  const handleSortChange = (newSortBy: TaskSort["sortBy"]) => {
    if (newSortBy === sortBy) {
      updateParams({ sortOrder: sortOrder === "asc" ? "desc" : "asc", page: null });
    } else {
      updateParams({
        sortBy: newSortBy,
        sortOrder: newSortBy === "priority" ? null : "desc",
        page: null,
      });
    }
  };
  const handlePageChange = (page: number) => {
    updateParams({ page: page > 1 ? String(page) : null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleCreateTask = () => { router.push("/dashboard/tasks/add-task"); };

  const { activeSession, completeSession } = useFocusSession();

  useEffect(() => {
    syncFocusTimer(activeSession, completeSession);
  }, [activeSession, completeSession]);

  const { data: focusedTask = null } = useTask(activeSession?.taskId as string);

  return {
    activeTab, searchQuery, selectedStatus, selectedPriority, currentPage, pageSize, sortBy, sortOrder,
    stats, tasks, pagination, isLoading, isError, handleTabChange, handleSearchChange, handleStatusChange,
    handlePriorityChange, handleSortChange, handlePageChange, handleCreateTask, tasksResponse, focusedTask,
    activeSession, completeSession, quota, focusRequired, setFocusRequired: handleFocusRequiredChange,
  };
}

// Re-export workspace tasks page from its own file
export { useWorkspaceTasksPage } from "./useWorkspaceTasksPage";
