"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { TasksPageHeader } from "@/components/dashboard/tasks/all-tasks/workspace-tasks/TaskPageHeader";
import { TaskStatsGrid } from "@/components/dashboard/tasks/all-tasks/workspace-tasks/TaskStatsGrid";
import { TaskSearchAndFilters } from "@/components/dashboard/tasks/all-tasks/workspace-tasks/TaskSearchAndFilters";
import { TaskTabs } from "@/components/dashboard/tasks/all-tasks/workspace-tasks/TaskTabs";
import { useWorkspaceTasksPage } from "@/hooks/useTasksPage";
import TaskQuotaDetails from "@/components/dashboard/tasks/all-tasks/TaskQoutaDetails";
import { FocusModeBanner } from "@/components/dashboard/tasks/all-tasks/FocusModeBanner";
import { AiDailyPlan } from "@/components/ai/AiDailyPlan";
import { LoadingState } from "@/components/shared/LoadingState";

const TasksContentArea = dynamic(
  () => import("@/components/dashboard/tasks/all-tasks/workspace-tasks/TasksContentArea").then((m) => m.TasksContentArea),
  { ssr: false }
);

const PrimaryTasksView = dynamic(
  () => import("@/components/dashboard/tasks/all-tasks/workspace-tasks/PrimaryTaskView").then((m) => m.PrimaryTasksView),
  { ssr: false }
);

interface TasksPageContentProps {
  workspaceSlug: string;
}

export function TasksPageContent({ workspaceSlug }: TasksPageContentProps) {
  const router = useRouter();

  const {
    workspace, stats, tasks, pagination, currentPage, isLoading, isError,
    searchQuery, setSearchQuery, showFilters, toggleFilters, activeFiltersCount,
    sortBy, sortOrder, setSortBy, selectedStatus, setSelectedStatus,
    selectedPriority, setSelectedPriority, selectedProject, setSelectedProject,
    selectedAssignee, setSelectedAssignee, selectedLabels, toggleLabel, clearFilters,
    selectedSection, setSelectedSection,
    focusRequired, setFocusRequired, handlePageChange, projects, sections, labels, members,
    qouta, focusedTask, activeSession, completeSession,
    primaryTask, secondaryTasks, hasPrimaryTask, dailyTasksLoading,
    handleAddToPrimary, handleAddToSecondary, handleRemoveDailyTask,
    loadingTaskId, loadingType, role,
  } = useWorkspaceTasksPage({ workspaceSlug });

  if (!workspace) return <LoadingState />;

  const handleCreateTask = () => {
    router.push(`/dashboard/workspaces/${workspaceSlug}/tasks/new-task`);
  };

  return (
    <div className="space-y-6 px-2 sm:px-4 lg:px-6 2xl:max-w-7xl mx-auto">
      <TasksPageHeader workspaceName={workspace.name} onCreateTask={handleCreateTask} memberRole={role} />
      <TaskQuotaDetails qouta={qouta} />
      {focusedTask && activeSession && (
        <FocusModeBanner task={focusedTask} onEndFocus={completeSession} sessionDuration={activeSession.duration} workspaceSlug={workspaceSlug} />
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
        sections={sections} selectedSection={selectedSection} onSectionChange={setSelectedSection}
      />

      <AiDailyPlan
        tasks={(tasks ?? []).map((task) => ({
          id: task.id,
          title: task.title,
          priority: task.priority ?? null,
          energyType: task.energyType ?? null,
          estimatedHours: task.estimatedHours ?? null,
          dueDate: task.dueDate ?? null,
        }))}
        workspaceId={workspace.id}
        workspaceSlug={workspaceSlug}
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
