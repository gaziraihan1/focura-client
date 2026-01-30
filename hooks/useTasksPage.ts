import { useState, useMemo } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useProjects } from "@/hooks/useProjects";
import { useLabels } from "@/hooks/useLabels";
import { useTeamMembers } from "@/hooks/useTeam";
import { useRouter } from "next/navigation";
import { useTasks, useTaskStats, TaskFilters, useTaskFilters,
  useTaskSorting } from "@/hooks/useTask";

export const PAGE_SIZE = 10;

export function useTasksPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "personal" | "assigned">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Build filters for API
  const filters: TaskFilters = useMemo(
    () => ({
      type: activeTab,
      status: selectedStatus !== "all" ? selectedStatus : undefined,
      priority: selectedPriority !== "all" ? selectedPriority : undefined,
    }),
    [activeTab, selectedStatus, selectedPriority]
  );

  // Fetch tasks with filters
  const { data: tasks = [], isLoading, isError } = useTasks(filters);

  // Get stats for current tab
  const { data: stats } = useTaskStats(undefined, activeTab);

  // Apply search filter
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTasks.length / PAGE_SIZE);

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTasks.slice(start, start + PAGE_SIZE);
  }, [filteredTasks, currentPage]);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateTask = () => {
    router.push("/dashboard/tasks/add-task");
  };

  return {
    activeTab,
    searchQuery,
    selectedStatus,
    selectedPriority,
    currentPage,
    totalPages,
    stats,
    paginatedTasks,
    totalItems: filteredTasks.length,
    isLoading,
    isError,
    handleTabChange,
    handleSearchChange,
    handleStatusChange,
    handlePriorityChange,
    handlePageChange,
    handleCreateTask,
  };
}


interface UseWorkspaceTasksPageProps {
  workspaceSlug: string;
}

export function useWorkspaceTasksPage({
  workspaceSlug,
}: UseWorkspaceTasksPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: workspace } = useWorkspace(workspaceSlug);
  const { data: projects = [] } = useProjects(workspace?.id);
  const { data: labels = [] } = useLabels(workspace?.id);
  const { data: members = [] } = useTeamMembers(workspace?.id);

  const {
    selectedStatus,
    setSelectedStatus,
    selectedPriority,
    setSelectedPriority,
    selectedProject,
    setSelectedProject,
    selectedAssignee,
    setSelectedAssignee,
    selectedLabels,
    toggleLabel,
    clearFilters,
    activeFiltersCount,
  } = useTaskFilters();

  const { sortBy, setSortBy } = useTaskSorting();

  const filters: TaskFilters = useMemo(
    () => ({
      workspaceId: workspace?.id,
      status: selectedStatus !== "all" ? selectedStatus : undefined,
      priority: selectedPriority !== "all" ? selectedPriority : undefined,
      projectId: selectedProject !== "all" ? selectedProject : undefined,
      assigneeId: selectedAssignee !== "all" ? selectedAssignee : undefined,
      labelIds: selectedLabels.length > 0 ? selectedLabels : undefined,
    }),
    [
      workspace?.id,
      selectedStatus,
      selectedPriority,
      selectedProject,
      selectedAssignee,
      selectedLabels,
    ]
  );

  const { data: tasks = [], isLoading, isError } = useTasks(filters);
  const { data: stats } = useTaskStats(workspace?.id);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort tasks
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "priority": {
          const priorityOrder: Record<string, number> = {
            URGENT: 0,
            HIGH: 1,
            MEDIUM: 2,
            LOW: 3,
          };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case "status":
          return a.status.localeCompare(b.status);
        case "createdAt":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [tasks, searchQuery, sortBy]);

  const toggleFilters = () => setShowFilters(!showFilters);

  return {
    workspace,
    workspaceSlug,
    stats,
    tasks: filteredAndSortedTasks,
    isLoading,
    isError,
    searchQuery,
    setSearchQuery,
    showFilters,
    toggleFilters,
    activeFiltersCount,
    sortBy,
    setSortBy,
    selectedStatus,
    setSelectedStatus,
    selectedPriority,
    setSelectedPriority,
    selectedProject,
    setSelectedProject,
    selectedAssignee,
    setSelectedAssignee,
    selectedLabels,
    toggleLabel,
    clearFilters,
    projects,
    labels,
    members,
  };
}