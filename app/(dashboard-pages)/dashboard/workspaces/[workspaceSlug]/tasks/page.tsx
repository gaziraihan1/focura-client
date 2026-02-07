"use client";

import { useParams, useRouter } from "next/navigation";
import { TasksPageHeader } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TaskPageHeader";
import { TaskStatsGrid } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TaskStatsGrid";
import { TaskSearchAndFilters } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TaskSearchAndFilters";
import { TasksContentArea } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TasksContentArea";
import { LoadingState } from "@/components/Shared/LoadingState";
import { useWorkspaceTasksPage } from "@/hooks/useTasksPage";

export default function WorkspaceTasksPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceSlug = params.workspaceSlug as string;

  const {
    workspace,
    stats,
    tasks,
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
  } = useWorkspaceTasksPage({ workspaceSlug });

  const handleCreateTask = () => {
    router.push(`/dashboard/workspaces/${workspaceSlug}/tasks/new-task`);
  };

  if (!workspace) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6 px-2 sm:px-4 lg:px-6">
      <TasksPageHeader
        workspaceName={workspace.name}
        onCreateTask={handleCreateTask}
      />

      {stats && <TaskStatsGrid stats={stats} />}

      <TaskSearchAndFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showFilters={showFilters}
        onToggleFilters={toggleFilters}
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

      <TasksContentArea
        tasks={tasks}
        isLoading={isLoading}
        isError={isError}
        searchQuery={searchQuery}
        activeFiltersCount={activeFiltersCount}
        workspaceSlug={workspaceSlug}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
}