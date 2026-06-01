'use client';

// app/(dashboard)/workspaces/[workspaceSlug]/projects/[projectSlug]/tasks/page.tsx

import { useState, useMemo }  from 'react';
import { useParams, useRouter }     from 'next/navigation';
import {
  AlertCircle
} from 'lucide-react';
import { useProjectDetailsBySlug } from '@/hooks/useProjects';
import { useUserProfile }          from '@/hooks/useUser';
import { useProjectRole }          from '@/hooks/useProjects';
import { Task }                    from '@/hooks/useTask';
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
 
  // ── Same data source as ProjectDetailsPage ────────────────────────────────
  // Tasks are embedded in the project response — no separate fetch needed.
  const { data: project, isLoading, error } = useProjectDetailsBySlug(projectSlug);
  console.log(project)
  const isArchived = project?.status === 'ARCHIVED';
 
  // ── Permission helpers (mirror ProjectDetailsPage) ────────────────────────
  const { userId }      = useUserProfile();
  const { canCreateTasks } = useProjectRole(project?.id, project);
 
  const isMember = useMemo(() => {
    if (!project?.members || !userId) return false;
    return project.members.some((m) => m.userId === userId || m.user?.id === userId);
  }, [project?.members, userId]);
 
 
  // ── Client-side filter ────────────────────────────────────────────────────
  const filteredTasks = useMemo(() => {
    let result: Task[] = (project?.tasks ?? []) as Task[];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q),
      );
    }
    if (priorityFilter !== 'ALL') result = result.filter((t) => t.priority === priorityFilter);
    if (statusFilter   !== 'ALL') result = result.filter((t) => t.status   === statusFilter);
    return result;
  }, [project?.tasks, search, priorityFilter, statusFilter]);
 
  console.log(filteredTasks)
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
    if (filteredTasks.length === 0) {
      return <EmptyTasks onAddTask={() => setShowCreate(true)} canCreate={canCreateTasks} isArchived={isArchived} />;
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
          totalCount={filteredTasks.length}
          onAddTask={() => setShowCreate(true)}
          canCreate={canCreateTasks}
          isArchived={isArchived}
        />
 
        {/* Live completion bar — always reflects unfiltered tasks */}
        <StatsBar tasks={filteredTasks} />
 
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