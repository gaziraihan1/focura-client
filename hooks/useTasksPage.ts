import { useState, useMemo, useEffect } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useProjects } from "@/hooks/useProjects";
import { useLabels } from "@/hooks/useLabels";
import { useTeamMembers } from "@/hooks/useTeam";
import { useRouter } from "next/navigation";
import { useTasks, useTaskStats, TaskFilters, TaskSort } from "@/hooks/useTask";
import { useUserProfile } from "./useUser";
import { useFocusSession } from "./useFocusSession";

export const DEFAULT_PAGE_SIZE = 10;

/**
 * Hook for personal tasks page with backend pagination
 */
export function useTasksPage() {
  const { userId } = useUserProfile();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "personal" | "assigned">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState<TaskSort['sortBy']>('createdAt');
  const [sortOrder, setSortOrder] = useState<TaskSort['sortOrder']>('desc');

  // Build filters for API
  const filters: TaskFilters = useMemo(
    () => ({
      type: activeTab,
      status: selectedStatus !== "all" ? selectedStatus : undefined,
      priority: selectedPriority !== "all" ? selectedPriority : undefined,
      search: searchQuery.trim() || undefined,
      userId: userId
    }),
    [activeTab, selectedStatus, selectedPriority, searchQuery, userId]
  );

  // Build sort params
  const sort: TaskSort = useMemo(
    () => ({
      sortBy,
      sortOrder,
    }),
    [sortBy, sortOrder]
  );

  // Fetch tasks with backend pagination
  const { data: tasksResponse, isLoading, isError } = useTasks(filters, currentPage, pageSize, sort);
  const tasks = tasksResponse?.data || [];
  const pagination = tasksResponse?.pagination;

  // Get stats for current tab
  const { data: stats } = useTaskStats(undefined, activeTab);

  // Handler functions that reset pagination
  const handleTabChange = (tab: "all" | "personal" | "assigned") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handlePriorityChange = (priority: string) => {
    setSelectedPriority(priority);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: TaskSort['sortBy']) => {
    if (newSortBy === sortBy) {
      // Toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateTask = () => {
    router.push("/dashboard/tasks/add-task");
  };

  const {
    activeSession,
    completeSession,
  } = useFocusSession();

  // Calculate initial time remaining
  const calculateTimeRemaining = () => {
    if (!activeSession || !activeSession.taskId) {
      return 0;
    }

    const startTime = new Date(activeSession.startedAt).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000); // seconds
    const remaining = Math.max(0, activeSession.duration * 60 - elapsed);
    return remaining;
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining);

  // Update timer for active session
  useEffect(() => {
    if (!activeSession || !activeSession.taskId) {
      return;
    }

    const updateTimer = () => {
      const startTime = new Date(activeSession.startedAt).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000); // seconds
      const remaining = Math.max(0, activeSession.duration * 60 - elapsed);
      setTimeRemaining(remaining);

      // Auto-complete when time runs out
      if (remaining === 0 && !activeSession.completed) {
        completeSession();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [activeSession, completeSession]);

  // Find the focused task in current task list
  const focusedTask = activeSession?.taskId 
    ? tasks.find(t => t.id === activeSession.taskId)
    : null;

  return {
    activeTab,
    searchQuery,
    selectedStatus,
    selectedPriority,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    stats,
    tasks,
    pagination,
    isLoading,
    isError,
    handleTabChange,
    handleSearchChange,
    handleStatusChange,
    handlePriorityChange,
    handleSortChange,
    handlePageChange,
    handleCreateTask,
    tasksResponse,
    focusedTask,
    timeRemaining,
    activeSession,
    completeSession
  };
}

interface UseWorkspaceTasksPageProps {
  workspaceSlug: string;
}

/**
 * Hook for workspace tasks page with backend pagination
 */
export function useWorkspaceTasksPage({
  workspaceSlug,
}: UseWorkspaceTasksPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  const { data: workspace } = useWorkspace(workspaceSlug);
  const { data: projects = [] } = useProjects(workspace?.id);
  const { data: labels = [] } = useLabels();
  const { data: members = [] } = useTeamMembers(workspace?.id);

  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const [sortBy, setSortBy] = useState<TaskSort['sortBy']>('dueDate');
  const [sortOrder, setSortOrder] = useState<TaskSort['sortOrder']>('asc');

  const toggleLabel = (labelId: string) => {
    setSelectedLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedStatus("all");
    setSelectedPriority("all");
    setSelectedProject("all");
    setSelectedAssignee("all");
    setSelectedLabels([]);
    setCurrentPage(1);
  };

  const activeFiltersCount = useMemo(
    () =>
      [
        selectedStatus !== "all",
        selectedPriority !== "all",
        selectedProject !== "all",
        selectedAssignee !== "all",
        selectedLabels.length > 0,
      ].filter(Boolean).length,
    [
      selectedStatus,
      selectedPriority,
      selectedProject,
      selectedAssignee,
      selectedLabels,
    ]
  );

  const filters: TaskFilters = useMemo(
    () => ({
      workspaceId: workspace?.id,
      status: selectedStatus !== "all" ? selectedStatus : undefined,
      priority: selectedPriority !== "all" ? selectedPriority : undefined,
      projectId: selectedProject !== "all" ? selectedProject : undefined,
      assigneeId: selectedAssignee !== "all" ? selectedAssignee : undefined,
      labelIds: selectedLabels.length > 0 ? selectedLabels : undefined,
      search: searchQuery.trim() || undefined,
    }),
    [
      workspace?.id,
      selectedStatus,
      selectedPriority,
      selectedProject,
      selectedAssignee,
      selectedLabels,
      searchQuery,
    ]
  );

  const sort: TaskSort = useMemo(
    () => ({
      sortBy,
      sortOrder,
    }),
    [sortBy, sortOrder]
  );

  const { data: tasksResponse, isLoading, isError } = useTasks(filters, currentPage, pageSize, sort);
  const tasks = tasksResponse?.data || [];
  const pagination = tasksResponse?.pagination;

  const { data: stats } = useTaskStats(workspace?.id);

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleSortChange = (newSortBy: TaskSort['sortBy']) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder(newSortBy === 'dueDate' || newSortBy === 'createdAt' ? 'asc' : 'desc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handlePriorityChange = (priority: string) => {
    setSelectedPriority(priority);
    setCurrentPage(1);
  };

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
    setCurrentPage(1);
  };

  const handleAssigneeChange = (assigneeId: string) => {
    setSelectedAssignee(assigneeId);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return {
    workspace,
    workspaceSlug,
    stats,
    tasks,
    pagination,
    currentPage,
    pageSize,
    isLoading,
    isError,
    searchQuery,
    setSearchQuery: handleSearchChange,
    showFilters,
    toggleFilters,
    activeFiltersCount,
    sortBy,
    sortOrder,
    setSortBy: handleSortChange,
    selectedStatus,
    setSelectedStatus: handleStatusChange,
    selectedPriority,
    setSelectedPriority: handlePriorityChange,
    selectedProject,
    setSelectedProject: handleProjectChange,
    selectedAssignee,
    setSelectedAssignee: handleAssigneeChange,
    selectedLabels,
    toggleLabel,
    clearFilters,
    handlePageChange,
    projects,
    labels,
    members,
  };
}