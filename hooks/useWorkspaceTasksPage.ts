import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useWorkspace, useWorkspaceRoleFromWorkspace } from "@/hooks/useWorkspace";
import { useProjects } from "@/hooks/useProjects";
import { useLabels } from "@/hooks/useLabels";
import { useTeamMembers } from "@/hooks/useTeam";
import { useTasks, useTaskStats, TaskFilters, TaskSort, useWorkspaceQuota, useTask } from "@/hooks/useTask";
import { useFocusSession } from "./useFocusSession";
import { useDailyTasks } from "./useDailyTasks";
import toast from "react-hot-toast";

export const DEFAULT_PAGE_SIZE = 10;

interface UseWorkspaceTasksPageProps {
  workspaceSlug: string;
}

export function useWorkspaceTasksPage({ workspaceSlug }: UseWorkspaceTasksPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  const [loadingType, setLoadingType] = useState<"primary" | "secondary" | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [focusRequired, setFocusRequired] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sortBy, setSortBy] = useState<TaskSort["sortBy"]>("priority");
  const [sortOrder, setSortOrder] = useState<TaskSort["sortOrder"]>("asc");

  const { data: workspace } = useWorkspace(workspaceSlug);
  const { role } = useWorkspaceRoleFromWorkspace(workspaceSlug);
  const { data: projects = [] } = useProjects(workspace?.id);
  const { data: labelsResponse } = useLabels();
  const labels = labelsResponse?.data ?? [];
  const { data: members = [] } = useTeamMembers(workspace?.id);

  const toggleLabel = (labelId: string) => {
    setSelectedLabels((prev) => prev.includes(labelId) ? prev.filter((id) => id !== labelId) : [...prev, labelId]);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedStatus("all"); setSelectedPriority("all"); setSelectedProject("all");
    setSelectedAssignee("all"); setSelectedLabels([]); setFocusRequired(false); setCurrentPage(1);
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  const activeFiltersCount = useMemo(
    () => [selectedStatus !== "all", selectedPriority !== "all", selectedProject !== "all", selectedAssignee !== "all", selectedLabels.length > 0, focusRequired].filter(Boolean).length,
    [selectedStatus, selectedPriority, selectedProject, selectedAssignee, selectedLabels, focusRequired],
  );

  const filters: TaskFilters = useMemo(
    () => ({
      workspaceId: workspace?.id, status: selectedStatus !== "all" ? selectedStatus : undefined,
      priority: selectedPriority !== "all" ? selectedPriority : undefined,
      projectId: selectedProject !== "all" ? selectedProject : undefined,
      assigneeId: selectedAssignee !== "all" ? selectedAssignee : undefined,
      labelIds: selectedLabels.length > 0 ? selectedLabels : undefined,
      search: searchQuery.trim() || undefined, focusRequired: focusRequired || undefined,
    }),
    [workspace?.id, selectedStatus, selectedPriority, selectedProject, selectedAssignee, selectedLabels, searchQuery, focusRequired],
  );

  const sort: TaskSort = useMemo(() => ({ sortBy, sortOrder }), [sortBy, sortOrder]);

  const { data: tasksResponse, isLoading, isError } = useTasks(filters, currentPage, pageSize, sort);
  // Client-side guard: only show tasks that actually belong to this workspace.
  // A task belongs to the workspace if it has workspaceId matching,
  // or if it's in a project whose workspace matches.
  const tasks = useMemo(() => {
    if (!workspace?.id) return tasksResponse?.data || [];
    return (tasksResponse?.data || []).filter(
      (t) =>
        t.workspaceId === workspace.id ||
        t.project?.workspace?.id === workspace.id,
    );
  }, [tasksResponse?.data, workspace?.id]);
  const pagination = tasksResponse?.pagination;
  const { data: stats } = useTaskStats(workspace?.id);
  const { data: qouta } = useWorkspaceQuota(workspace?.id);
  const { activeSession, completeSession } = useFocusSession();
  const { data: focusedTask = null } = useTask(activeSession?.taskId as string);
  const workspaceAutoCompletedRef = useRef(false);

  useEffect(() => { workspaceAutoCompletedRef.current = false; }, [activeSession?.id]);

  useEffect(() => {
    if (!activeSession?.taskId) return;
    const updateTimer = () => {
      const startTime = new Date(activeSession?.startedAt).getTime();
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, activeSession.duration * 60 - elapsed);
      setTimeRemaining(remaining);
      if (remaining === 0 && !activeSession.completed && !workspaceAutoCompletedRef.current) {
        workspaceAutoCompletedRef.current = true;
        completeSession();
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeSession, completeSession]);

  const { primaryTask, secondaryTasks, hasPrimaryTask, isLoading: dailyTasksLoading, addToPrimary, addToSecondary, removeDailyTask } = useDailyTasks(workspaceSlug);

  const handleAddToPrimary = useCallback(async (taskId: string) => {
    if (hasPrimaryTask) { toast.error("You already have a primary task set for today"); return; }
    setLoadingTaskId(taskId); setLoadingType("primary");
    try { const result = await addToPrimary(taskId); if (!result.success) toast.error(result.message || "Failed to add task to Primary"); }
    finally { setLoadingTaskId(null); setLoadingType(null); }
  }, [hasPrimaryTask, addToPrimary]);

  const handleRemoveDailyTask = useCallback(async (taskId: string) => {
    const result = await removeDailyTask(taskId);
    if (!result.success) toast.error(result.message || "Failed to remove task");
  }, [removeDailyTask]);

  const handleAddToSecondary = useCallback(async (taskId: string) => {
    setLoadingTaskId(taskId); setLoadingType("secondary");
    try { const result = await addToSecondary(taskId); if (!result.success) toast.error(result.message || "Failed to add task to Secondary"); }
    finally { setLoadingTaskId(null); setLoadingType(null); }
  }, [addToSecondary]);

  const handleSortChange = (newSortBy: TaskSort["sortBy"]) => {
    if (newSortBy === sortBy) { setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }
    else { setSortBy(newSortBy); setSortOrder(newSortBy === "dueDate" || newSortBy === "createdAt" || newSortBy === "priority" ? "asc" : "desc"); }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handleStatusChange = (status: string) => { setSelectedStatus(status); setCurrentPage(1); };
  const handlePriorityChange = (priority: string) => { setSelectedPriority(priority); setCurrentPage(1); };
  const handleProjectChange = (projectId: string) => { setSelectedProject(projectId); setCurrentPage(1); };
  const handleAssigneeChange = (assigneeId: string) => { setSelectedAssignee(assigneeId); setCurrentPage(1); };
  const handleFocusRequiredChange = (value: boolean) => { setFocusRequired(value); setCurrentPage(1); };
  const handleSearchChange = (value: string) => { setSearchQuery(value); setCurrentPage(1); };

  return {
    workspace, workspaceSlug, stats, tasks, pagination, currentPage, pageSize, isLoading, isError,
    searchQuery, setSearchQuery: handleSearchChange, showFilters, toggleFilters, activeFiltersCount,
    sortBy, sortOrder, setSortBy: handleSortChange, selectedStatus, setSelectedStatus: handleStatusChange,
    selectedPriority, setSelectedPriority: handlePriorityChange, selectedProject, setSelectedProject: handleProjectChange,
    selectedAssignee, setSelectedAssignee: handleAssigneeChange, selectedLabels, toggleLabel, clearFilters,
    focusRequired, setFocusRequired: handleFocusRequiredChange, handlePageChange, handleAddToSecondary,
    handleAddToPrimary, loadingTaskId, primaryTask, secondaryTasks, hasPrimaryTask, dailyTasksLoading,
    handleRemoveDailyTask, projects, labels, members, qouta, focusedTask, timeRemaining, activeSession,
    completeSession, loadingType, role,
  };
}
