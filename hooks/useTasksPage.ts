import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTasks, useTaskStats, TaskFilters, TaskSort, usePersonalQuota, useTask } from "@/hooks/useTask";
import { useUserProfile } from "./useUser";
import { useFocusSession } from "./useFocusSession";

export const DEFAULT_PAGE_SIZE = 10;

export function useTasksPage() {
  const { userId } = useUserProfile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"all" | "personal" | "assigned">("all");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") ?? "");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState<TaskSort["sortBy"]>("priority");
  const [sortOrder, setSortOrder] = useState<TaskSort["sortOrder"]>("asc");
  const [focusRequired, setFocusRequired] = useState(false);

  const filters: TaskFilters = useMemo(
    () => ({ type: activeTab, status: selectedStatus !== "all" ? selectedStatus : undefined, priority: selectedPriority !== "all" ? selectedPriority : undefined, search: searchQuery.trim() || undefined, userId, focusRequired: focusRequired || undefined }),
    [activeTab, selectedStatus, selectedPriority, searchQuery, userId, focusRequired],
  );

  const sort: TaskSort = useMemo(() => ({ sortBy, sortOrder }), [sortBy, sortOrder]);

  const { data: tasksResponse, isLoading, isError } = useTasks(filters, currentPage, pageSize, sort);
  const tasks = tasksResponse?.data || [];
  const pagination = tasksResponse?.pagination;
  const { data: qouta } = usePersonalQuota();
  const { data: stats } = useTaskStats(undefined, activeTab);

  const handleTabChange = (tab: "all" | "personal" | "assigned") => { setActiveTab(tab); setCurrentPage(1); };
  const handleStatusChange = (status: string) => { setSelectedStatus(status); setCurrentPage(1); };
  const handlePriorityChange = (priority: string) => { setSelectedPriority(priority); setCurrentPage(1); };
  const handleFocusRequiredChange = (value: boolean) => { setFocusRequired(value); setCurrentPage(1); };
  const handleSearchChange = (value: string) => { setSearchQuery(value); setCurrentPage(1); };
  const handleSortChange = (newSortBy: TaskSort["sortBy"]) => {
    if (newSortBy === sortBy) { setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }
    else { setSortBy(newSortBy); setSortOrder(newSortBy === "priority" ? "asc" : "desc"); }
    setCurrentPage(1);
  };
  const handlePageChange = (page: number) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handleCreateTask = () => { router.push("/dashboard/tasks/add-task"); };

  const { activeSession, completeSession } = useFocusSession();
  const autoCompletedRef = useRef(false);

  useEffect(() => { autoCompletedRef.current = false; }, [activeSession?.id]);

  const calculateTimeRemaining = () => {
    if (!activeSession || !activeSession.taskId) return 0;
    const startTime = new Date(activeSession.startedAt).getTime();
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    return Math.max(0, activeSession.duration * 60 - elapsed);
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining);

  useEffect(() => {
    if (!activeSession || !activeSession.taskId) return;
    const updateTimer = () => {
      const startTime = new Date(activeSession.startedAt).getTime();
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, activeSession.duration * 60 - elapsed);
      setTimeRemaining(remaining);
      if (remaining === 0 && !activeSession.completed && !autoCompletedRef.current) {
        autoCompletedRef.current = true;
        completeSession();
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeSession, completeSession]);

  const { data: focusedTask = null } = useTask(activeSession?.taskId as string);

  return {
    activeTab, searchQuery, selectedStatus, selectedPriority, currentPage, pageSize, sortBy, sortOrder,
    stats, tasks, pagination, isLoading, isError, handleTabChange, handleSearchChange, handleStatusChange,
    handlePriorityChange, handleSortChange, handlePageChange, handleCreateTask, tasksResponse, focusedTask,
    timeRemaining, activeSession, completeSession, qouta, focusRequired, setFocusRequired: handleFocusRequiredChange,
  };
}

// Re-export workspace tasks page from its own file
export { useWorkspaceTasksPage } from "./useWorkspaceTasksPage";
