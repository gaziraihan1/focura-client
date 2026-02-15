"use client";
import { useParams, useRouter } from "next/navigation";
import { TasksPageHeader } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TaskPageHeader";
import { TaskStatsGrid } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TaskStatsGrid";
import { TaskSearchAndFilters } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TaskSearchAndFilters";
import { TasksContentArea } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TasksContentArea";
import { LoadingState } from "@/components/Shared/LoadingState";
import { TaskTabs } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TaskTabs";
import { useWorkspaceTasksPage } from "@/hooks/useTasksPage";
import { useDailyTasks } from "@/hooks/useDailyTasks";
import toast from "react-hot-toast";
import { PrimaryTasksView } from "@/components/Dashboard/AllTasks/WorkspaceTasks/PrimaryTaskView";

export default function WorkspaceTasksPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceSlug = params.workspaceSlug as string;

  const {
    workspace,
    stats,
    tasks,
    pagination,
    currentPage,
    // pageSize,
    isLoading,
    isError,
    searchQuery,
    setSearchQuery,
    showFilters,
    toggleFilters,
    activeFiltersCount,
    sortBy,
    sortOrder,
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
    handlePageChange,
    projects,
    labels,
    members,
  } = useWorkspaceTasksPage({ workspaceSlug });
  console.log(tasks,"..")

  const {
    primaryTask,
    secondaryTasks,
    hasPrimaryTask,
    isLoading: dailyTasksLoading,
    addToPrimary,
    addToSecondary,
  } = useDailyTasks(workspaceSlug);
  console.log(tasks)

  const handleCreateTask = () => {
    router.push(`/dashboard/workspaces/${workspaceSlug}/tasks/new-task`);
  };

  const handleAddToPrimary = async (taskId: string) => {
    if (hasPrimaryTask) {
      toast.error("You already have a primary task set for today");
      return;
    }

    const result = await addToPrimary(taskId);
    
    if (result.success) {
      toast.success(result.message || "Task added to Primary");
    } else {
      toast.error(result.message || "Failed to add task to Primary");
    }
  };

  const handleAddToSecondary = async (taskId: string) => {
    const result = await addToSecondary(taskId);
    
    if (result.success) {
      toast.success(result.message || "Task added to Secondary");
    } else {
      toast.error(result.message || "Failed to add task to Secondary");
    }
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
        sortOrder={sortOrder}
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

      <TaskTabs
        allTasksContent={
          <TasksContentArea
            tasks={tasks}
            pagination={pagination}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            isLoading={isLoading}
            isError={isError}
            searchQuery={searchQuery}
            activeFiltersCount={activeFiltersCount}
            workspaceSlug={workspaceSlug}
            onCreateTask={handleCreateTask}
            onAddToPrimary={handleAddToPrimary}
            onAddToSecondary={handleAddToSecondary}
            isPrimaryDisabled={hasPrimaryTask}
          />
        }
        primaryTasksContent={
          dailyTasksLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            </div>
          ) : (
            <PrimaryTasksView
              primaryTask={primaryTask}
              secondaryTasks={secondaryTasks}
              workspaceSlug={workspaceSlug}
            />
          )
        }
      />
    </div>
  );
}