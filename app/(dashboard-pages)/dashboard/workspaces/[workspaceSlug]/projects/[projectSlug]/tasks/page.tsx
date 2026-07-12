'use client';

// app/(dashboard)/workspaces/[workspaceSlug]/projects/[projectSlug]/tasks/page.tsx

import { useState, useMemo }  from 'react';
import { useParams, useRouter }     from 'next/navigation';
import {
  AlertCircle,
} from 'lucide-react';
import { useProjectDetailsBySlug, useProjectRole } from '@/hooks/useProjects';
import { useUserProfile }          from '@/hooks/useUser';
import { Task, useTasks }          from '@/hooks/useTask';
import { AccessDeniedProject }     from '@/components/Dashboard/ProjectDetails/AccessDeniedProject';
import LoadingState                from '@/components/Dashboard/ProjectDetails/LoadingState';
import CreateTaskModal             from '@/components/Dashboard/ProjectDetails/CreateTaskModal';
import { EmptyTasks } from '@/components/Dashboard/Workspaces/project/Tasks/EmptyTasks';
import { COLUMNS, ListRow } from '@/components/Dashboard/Workspaces/project/Tasks/ListRow';
import { Toolbar } from '@/components/Dashboard/Workspaces/project/Tasks/ToolBar';
import { StatsBar } from '@/components/Dashboard/Workspaces/project/Tasks/StatsBar';
import { BoardColumn } from '@/components/Dashboard/Workspaces/project/Tasks/BoardColumn';
import { PageHeader } from '@/components/Dashboard/Workspaces/project/Tasks/PageHeader';

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode     = 'board' | 'list';
type TaskStatus   = Task['status'];
type TaskPriority = Task['priority'];

export default function ProjectTasksPage() {
  const params      = useParams();
  const router      = useRouter();
  const projectSlug = params?.projectSlug as string;

  const [viewMode,       setViewMode]       = useState<ViewMode>('board');
  const [search,         setSearch]         = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');
  const [statusFilter,   setStatusFilter]   = useState<TaskStatus | 'ALL'>('ALL');
  const [showCreate,     setShowCreate]     = useState(false);

  // ── Project (for header, members, permissions) ────────────────────────────
  const { data: project, isLoading, error } = useProjectDetailsBySlug(projectSlug);
  const isArchived = project?.status === 'ARCHIVED';

  // ── Real task data for this project ───────────────────────────────────────
  // Tasks are fetched from the dedicated tasks endpoint filtered by projectId
  // (project.tasks from the detail response is not guaranteed to be populated).
  const { data: tasksData, isLoading: tasksLoading } = useTasks(
    { projectId: project?.id, workspaceId: project?.workspaceId },
    1,
    100,
    undefined,
    !!(project?.id && project?.workspaceId),
  );
  const tasks = useMemo<Task[]>(
    () => (tasksData?.data ?? []) as Task[],
    [tasksData],
  );

  // ── Permission helpers (mirror ProjectDetailsPage) ────────────────────────
  const { userId }      = useUserProfile();
  const { canCreateTasks } = useProjectRole(project?.id, project);

  const isMember = useMemo(() => {
    if (!project?.members || !userId) return false;
    return project.members.some((m) => m.userId === userId || m.user?.id === userId);
  }, [project?.members, userId]);


  // ── Client-side filter ────────────────────────────────────────────────────
  const filteredTasks = useMemo(() => {
    let result: Task[] = tasks;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q),
      );
    }
    if (priorityFilter !== 'ALL') result = result.filter((t) => t.priority === priorityFilter);
    if (statusFilter   !== 'ALL') result = result.filter((t) => t.status   === statusFilter);
    return result;
  }, [tasks, search, priorityFilter, statusFilter]);

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

  // ── Task loading skeleton ────────────────────────────────────────────────
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
            onClick={() => { setSearch(''); setPriorityFilter('ALL'); setStatusFilter('ALL'); }}
            className="text-sm text-primary hover:underline transition-colors"
          >
            Clear filters
          </button>
        </div>
      );
    }

    if (viewMode === 'board') {
      return (
        <div className="overflow-x-auto pb-4 -mx-2 px-2 sm:mx-0 sm:px-0">
  <div className="flex gap-3 items-start" style={{ minWidth: `${COLUMNS.length * 280}px` }}>
    {COLUMNS.map((col) => (
      <BoardColumn
              key={col.status}
              {...col}
              tasks={filteredTasks.filter((t) => t.status === col.status)}
              workspaceSlug={workspaceSlug}
              onAddTask={() => setShowCreate(true)}
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
        {filteredTasks.map((task) => (
          <ListRow key={task.id} task={task} workspaceSlug={workspaceSlug} />
        ))}
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
          viewMode={viewMode}       setViewMode={setViewMode}
          search={search}           setSearch={setSearch}
          priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
          statusFilter={statusFilter}     setStatusFilter={setStatusFilter}
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
