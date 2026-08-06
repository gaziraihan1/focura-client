'use client';

// app/(dashboard)/workspaces/[workspaceSlug]/projects/[projectSlug]/tasks/page.tsx
// Presentational only — all data/filtering/board logic lives in
// hooks/useProjectTasksPage.tsx.

import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { AccessDeniedProject } from '@/components/Dashboard/ProjectDetails/AccessDeniedProject';
import LoadingState from '@/components/Dashboard/ProjectDetails/LoadingState';
import CreateTaskModal from '@/components/Dashboard/ProjectDetails/CreateTaskModal';
import { EmptyTasks } from '@/components/Dashboard/Workspaces/project/Tasks/EmptyTasks';
import { ListRow } from '@/components/Dashboard/Workspaces/project/Tasks/ListRow';
import { Toolbar } from '@/components/Dashboard/Workspaces/project/Tasks/ToolBar';
import { StatsBar } from '@/components/Dashboard/Workspaces/project/Tasks/StatsBar';
import { BoardColumn } from '@/components/Dashboard/Workspaces/project/Tasks/BoardColumn';
import { PageHeader } from '@/components/Dashboard/Workspaces/project/Tasks/PageHeader';
import { Pagination } from '@/components/Shared/Pagination';
import {
  useProjectTasksPage,
  LIST_PAGE_SIZE,
} from '@/hooks/useProjectTasksPage';

// ── Task loading skeleton ───────────────────────────────────────────────────
const TasksSkeleton = () => (
  <div className="space-y-3">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-3 animate-pulse space-y-3">
          <div className="h-3 w-2/3 rounded bg-muted" />
          <div className="h-2.5 w-full rounded bg-muted" />
          <div className="h-2.5 w-4/5 rounded bg-muted" />
          <div className="flex -space-x-2 pt-1">
            <div className="size-6 rounded-full bg-muted border-2 border-card" />
            <div className="size-6 rounded-full bg-muted border-2 border-card" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function ProjectTasksPage() {
  const router = useRouter();
  const {
    project,
    isLoading,
    error,
    isArchived,
    tasks,
    tasksLoading,
    sections,
    sectionsById,
    sprints,
    milestones,
    views,
    activeViewId,
    applyView,
    resetView,
    clearFilters,
    sprintFilter,
    setSprintFilter,
    milestoneFilter,
    setMilestoneFilter,
    boardColumns,
    canCreateTasks,
    isMember,
    viewMode,
    setViewMode,
    search,
    setSearch,
    priorityFilter,
    setPriorityFilter,
    statusFilter,
    setStatusFilter,
    sectionFilter,
    setSectionFilter,
    showCreate,
    setShowCreate,
    filteredTasks,
    tasksByColumn,
    paginatedItems,
    currentPage,
    totalPages,
    totalItems,
    setCurrentPage,
  } = useProjectTasksPage();

  // ── Guards (mirrors ProjectDetailsPage pattern exactly) ───────────────────
  if (isLoading) return <LoadingState />;

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">Project not found</h2>
        <p className="text-muted-foreground mb-4">
          {error ? 'Failed to load project details' : 'This project does not exist or you do not have access'}
        </p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!isMember && !project.isAdmin) {
    return (
      <AccessDeniedProject
        projectName={project.name}
        workspaceName={project.workspace?.name}
      />
    );
  }

  const workspaceSlug = project.workspace?.slug ?? '';

  // ── Body ──────────────────────────────────────────────────────────────────
  const renderBody = () => {
    if (tasksLoading && tasks.length === 0) return <TasksSkeleton />;

    if (tasks.length === 0) {
      return <EmptyTasks onAddTask={() => setShowCreate(true)} canCreate={canCreateTasks} isArchived={isArchived} />;
    }

    if (filteredTasks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <p className="text-sm font-medium text-foreground">No tasks match your filters</p>
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Clear filters
          </button>
        </div>
      );
    }

    if (viewMode === 'board') {
      return (
        <div className="overflow-x-auto pb-4 -mx-2 px-2 sm:mx-0 sm:px-0">
          <div className="flex gap-3 items-start" style={{ minWidth: `${boardColumns.length * 280}px` }}>
            {boardColumns.map((col) => (
              <BoardColumn
                key={col.status}
                {...col}
                tasks={tasksByColumn.get(col.status) ?? []}
                workspaceSlug={workspaceSlug}
                onAddTask={() => setShowCreate(true)}
                sectionsById={sectionsById}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <div className="hidden sm:grid grid-cols-[auto_1fr_130px_100px_90px_80px] items-center gap-3 px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">
          <span className="size-4" />
          <span>Task</span>
          <span>Status</span>
          <span>Priority</span>
          <span>Due</span>
          <span>Assignee</span>
        </div>
        {paginatedItems.map((task) => (
          <ListRow key={task.id} task={task} workspaceSlug={workspaceSlug} sectionsById={sectionsById} />
        ))}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={LIST_PAGE_SIZE}
          totalItems={totalItems}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-6 space-y-4">
        <PageHeader
          projectName={project.name}
          projectColor={project.color}
          workspaceName={project.workspace?.name}
          totalCount={tasks.length}
          onAddTask={() => setShowCreate(true)}
          canCreate={canCreateTasks}
          isArchived={isArchived}
        />

        {/* Live completion bar — always reflects ALL project tasks, not the filtered subset */}
        <StatsBar tasks={tasks} isLoading={tasksLoading} />

        <Toolbar
          viewMode={viewMode} setViewMode={setViewMode}
          search={search} setSearch={setSearch}
          priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          sections={sections ?? []}
          sectionFilter={sectionFilter} setSectionFilter={setSectionFilter}
          sprints={sprints ?? []}
          sprintFilter={sprintFilter} setSprintFilter={setSprintFilter}
          milestones={milestones ?? []}
          milestoneFilter={milestoneFilter} setMilestoneFilter={setMilestoneFilter}
          views={views ?? []}
          activeViewId={activeViewId}
          onApplyView={applyView}
          onResetView={resetView}
          onClearFilters={clearFilters}
        />

        {renderBody()}
      </div>

      {showCreate && canCreateTasks && !isArchived && (
        <CreateTaskModal
          workspaceId={project.workspaceId}
          projectId={project.id}
          projectMembers={project.members}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}
