"use client";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { TasksPageHeader } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TaskPageHeader";
import { TaskStatsGrid } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TaskStatsGrid";
import { TaskSearchAndFilters } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TaskSearchAndFilters";
import { TaskTabs } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TaskTabs";
import { useWorkspaceTasksPage } from "@/hooks/useTasksPage";
import TaskQuotaDetails from "@/components/Dashboard/AllTasks/TaskQoutaDetails";
import { FocusModeBanner } from "@/components/Dashboard/AllTasks/FocusModeBanner";
import { LoadingState } from "@/components/Shared/LoadingState";

const TasksContentArea = dynamic(
  () => import("@/components/Dashboard/AllTasks/WorkspaceTasks/TasksContentArea").then((m) => m.TasksContentArea),
  { ssr: false }
);

const PrimaryTasksView = dynamic(
  () => import("@/components/Dashboard/AllTasks/WorkspaceTasks/PrimaryTaskView").then((m) => m.PrimaryTasksView),
  { ssr: false }
);

export default function WorkspaceTasksPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceSlug = params.workspaceSlug as string;

  const {
    workspace, stats, tasks, pagination, currentPage, isLoading, isError,
    searchQuery, setSearchQuery, showFilters, toggleFilters, activeFiltersCount,
    sortBy, sortOrder, setSortBy, selectedStatus, setSelectedStatus,
    selectedPriority, setSelectedPriority, selectedProject, setSelectedProject,
    selectedAssignee, setSelectedAssignee, selectedLabels, toggleLabel, clearFilters,
    focusRequired, setFocusRequired, handlePageChange, projects, labels, members,
    qouta, focusedTask, timeRemaining, activeSession, completeSession,
    primaryTask, secondaryTasks, hasPrimaryTask, dailyTasksLoading,
    handleAddToPrimary, handleAddToSecondary, handleRemoveDailyTask,
    loadingTaskId, loadingType, role,
  } = useWorkspaceTasksPage({ workspaceSlug });

  if (!workspace) return <LoadingState />;

  const handleCreateTask = () => {
    router.push(`/dashboard/workspaces/${workspaceSlug}/tasks/new-task`);
  };

  return (
    <div className="space-y-6 px-2 sm:px-4 lg:px-6">
      <TasksPageHeader workspaceName={workspace.name} onCreateTask={handleCreateTask} memberRole={role} />
      <TaskQuotaDetails qouta={qouta} />
      {focusedTask && activeSession && (
        <FocusModeBanner task={focusedTask} timeRemaining={timeRemaining} onEndFocus={completeSession} sessionDuration={activeSession.duration} workspaceSlug={workspaceSlug} />
      )}

      {stats && <TaskStatsGrid stats={stats} />}
      <TaskSearchAndFilters
        searchQuery={searchQuery} onSearchChange={setSearchQuery} showFilters={showFilters}
        onToggleFilters={toggleFilters} activeFiltersCount={activeFiltersCount} sortBy={sortBy}
        sortOrder={sortOrder} onSortChange={setSortBy} selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus} selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority} selectedProject={selectedProject}
        onProjectChange={setSelectedProject} selectedAssignee={selectedAssignee}
        onAssigneeChange={setSelectedAssignee} selectedLabels={selectedLabels}
        onToggleLabel={toggleLabel} onClearFilters={clearFilters} focusRequired={focusRequired}
        onFocusRequiredChange={setFocusRequired} projects={projects} labels={labels} members={members}
      />

      <TaskTabs
        allTasksContent={
          <TasksContentArea
            tasks={tasks} pagination={pagination} currentPage={currentPage}
            onPageChange={handlePageChange} isLoading={isLoading} isError={isError}
            searchQuery={searchQuery} activeFiltersCount={activeFiltersCount}
            workspaceSlug={workspaceSlug} onCreateTask={handleCreateTask}
            onAddToPrimary={handleAddToPrimary} onAddToSecondary={handleAddToSecondary}
            isPrimaryDisabled={hasPrimaryTask} loadingTaskId={loadingTaskId}
            loadingType={loadingType} primaryTaskId={primaryTask?.id}
            secondaryTaskIds={secondaryTasks.map((t) => t.id)} memberRole={role}
          />
        }
        primaryTasksContent={
          dailyTasksLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            </div>
          ) : (
            <PrimaryTasksView primaryTask={primaryTask} secondaryTasks={secondaryTasks} workspaceSlug={workspaceSlug} onRemove={handleRemoveDailyTask} />
          )
        }
      />
    </div>
  );
}
