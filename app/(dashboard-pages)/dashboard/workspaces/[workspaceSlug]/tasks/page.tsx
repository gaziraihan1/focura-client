"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle} from "lucide-react";

import { useWorkspace } from "@/hooks/useWorkspace";
import { useTasks, useTaskStats, TaskFilters, useTaskFilters, useTaskSorting } from "@/hooks/useTask";
import { useProjects } from "@/hooks/useProjects";
import { useLabels } from "@/hooks/useLabels";
import { useTeamMembers } from "@/hooks/useTeam";
import { TasksPageHeader } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TaskPageHeader";
import { TaskStatsGrid } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TaskStatsGrid";
import { TaskSearchAndFilters } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TaskSearchAndFilters";
import { EmptyState } from "@/components/Dashboard/AllTasks/WorkspaceTasks/EmptyState";
import { TaskList } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TaskList";

;

export default function WorkspaceTasksPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceSlug = params.workspaceSlug as string;

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
    // setSelectedLabels,
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
        case "priority":
          const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
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

  if (!workspace) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-4 lg:px-6">
      <TasksPageHeader
        workspaceName={workspace.name}
        onCreateTask={() =>
          router.push(`/dashboard/workspaces/${workspaceSlug}/tasks/new-task`)
        }
      />

      {stats && <TaskStatsGrid stats={stats} />}

      <TaskSearchAndFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        activeFiltersCount={activeFiltersCount}
        sortBy={sortBy}
        onSortChange={setSortBy}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
        selectedAssignee={selectedAssignee}
        onAssigneeChange={setSelectedAssignee}
        selectedLabels={selectedLabels}
        onToggleLabel={toggleLabel}
        onClearFilters={clearFilters}
        projects={projects}
        labels={labels}
        members={members}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="text-center py-12 rounded-xl bg-card border border-border">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load tasks</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            Retry
          </button>
        </div>
      ) : filteredAndSortedTasks.length === 0 ? (
        <EmptyState
          hasFilters={searchQuery !== "" || activeFiltersCount > 0}
          searchQuery={searchQuery}
          onCreateTask={() =>
            router.push(
              `/dashboard/workspaces/${workspaceSlug}/tasks/new-task`
            )
          }
        />
      ) : (
        <TaskList tasks={filteredAndSortedTasks} workspaceSlug={workspaceSlug} />
      )}
    </div>
  );
}