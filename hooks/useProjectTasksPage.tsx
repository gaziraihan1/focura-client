'use client';

// hooks/useProjectTasksPage.tsx
// All data fetching, filtering and board-column logic for the project tasks
// page lives here — the page component stays presentational.

import { createElement, useMemo, useEffect, useRef, useState, type ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { useProjectDetailsBySlug, useProjectRole } from '@/hooks/useProjects';
import { useUserProfile } from '@/hooks/useUser';
import { Task, useTasks, TaskSort } from '@/hooks/useTask';
import { useProjectSections, useProjectSprints, useProjectMilestones, useProjectViews, type ProjectViewItem } from '@/hooks/useProjectFeatures';
import { buildWorkflowColumns, mergeBoardColumns, assignTasksToColumns } from '@/utils/workflow';
import { COLUMNS } from '@/components/Dashboard/Workspaces/project/Tasks/ListRow';
import type { SectionsById } from '@/components/Dashboard/ProjectDetails/TaskCard';
import { usePagination } from '@/hooks/usePagination';
import { useUrlState } from '@/hooks/useUrlState';

export type ViewMode = 'board' | 'list';
type TaskStatus   = Task['status'];
type TaskPriority = Task['priority'];

export interface BoardColumnConfig {
  status: TaskStatus;
  label: string;
  icon: ReactNode;
  color: string;
  sectionId?: string;
}

export const LIST_PAGE_SIZE = 15;
export const NO_SECTION_FILTER = 'ALL';

export function useProjectTasksPage() {
  const params = useParams();
  const projectSlug = params?.projectSlug as string;

  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [showCreate, setShowCreate] = useState(false);
  // URL-synced so "view tasks of section X" can be deep-linked from anywhere
  // (e.g. ?section=<id> from the sections page). Note the value is derived from
  // the URL (useUrlState writes via router.replace), so the filter applies on
  // the navigation render — the codebase's established pattern.
  const [rawSectionFilter, setSectionFilter] = useUrlState<string>('section', NO_SECTION_FILTER);
  const [rawSprintFilter, setSprintFilter] = useUrlState<string>('sprint', NO_SECTION_FILTER);
  const [rawMilestoneFilter, setMilestoneFilter] = useUrlState<string>('milestone', NO_SECTION_FILTER);
  const [viewParam, setViewParam] = useUrlState<string>('view', '');

  // ── Project (for header, members, permissions) ────────────────────────────
  const { data: project, isLoading, error } = useProjectDetailsBySlug(projectSlug);
  const isArchived = project?.status === 'ARCHIVED';

  // ── Real task data for this project ───────────────────────────────────────
  // Tasks are fetched from the dedicated tasks endpoint filtered by projectId
  // (project.tasks from the detail response is not guaranteed to be populated).
  const taskSort = useMemo<TaskSort>(() => ({ sortBy: 'priority', sortOrder: 'asc' }), []);
  const { data: tasksData, isLoading: tasksLoading } = useTasks(
    { projectId: project?.id, workspaceId: project?.workspaceId },
    1,
    100,
    taskSort,
    !!(project?.id && project?.workspaceId),
  );
  const tasks = useMemo<Task[]>(() => (tasksData?.data ?? []) as Task[], [tasksData]);

  // ── Workflow columns ──────────────────────────────────────────────────────
  // Custom sections with a status mapping drive the board; default columns are
  // merged in for any status without a mapped section so tasks are never hidden.
  const { data: sections } = useProjectSections(project?.id);
  const { data: sprintStats } = useProjectSprints(project?.id);
  const { data: milestoneStats } = useProjectMilestones(project?.id);
  const { data: views = [] } = useProjectViews(project?.id);
  const sprints = sprintStats?.sprints ?? [];
  const milestones = milestoneStats?.milestones ?? [];

  // sectionId → { name, color } so cards/rows can show which section a task
  // belongs to (folder sections included — they don't become board columns).
  const sectionsById = useMemo<SectionsById>(
    () => new Map((sections ?? []).map((section) => [section.id, { name: section.name, color: section.color }])),
    [sections],
  );

  // A deep-linked ?section= may point to a section that no longer exists — fall
  // back to "all" so the board doesn't silently appear empty.
  const sectionFilter =
    rawSectionFilter !== NO_SECTION_FILTER && sectionsById.has(rawSectionFilter)
      ? rawSectionFilter
      : NO_SECTION_FILTER;

  const sprintFilter =
    rawSprintFilter !== NO_SECTION_FILTER && sprints.some((s) => s.id === rawSprintFilter)
      ? rawSprintFilter
      : NO_SECTION_FILTER;

  const milestoneFilter =
    rawMilestoneFilter !== NO_SECTION_FILTER && milestones.some((m) => m.id === rawMilestoneFilter)
      ? rawMilestoneFilter
      : NO_SECTION_FILTER;

  const boardColumns = useMemo<BoardColumnConfig[]>(() => {
    const workflow = buildWorkflowColumns(sections ?? []);
    return mergeBoardColumns(workflow, COLUMNS).map((col) =>
      'sectionId' in col
        ? {
            status: col.status,
            label: col.label,
            color: '',
            sectionId: col.sectionId,
            // createElement (not JSX) so the compiler can keep this memo intact
            icon: createElement('span', {
              className: 'size-3.5 rounded-full shrink-0',
              style: { backgroundColor: col.color },
            }),
          }
        : col,
    );
  }, [sections]);

  // ── Saved views ──────────────────────────────────────────────────────────
  const activeView = viewParam ? views.find((v) => v.id === viewParam) : undefined;

  const applyView = (view: ProjectViewItem) => {
    setViewMode(view.type === 'LIST' ? 'list' : 'board');
    setSearch('');
    setPriorityFilter('ALL');
    setStatusFilter('ALL');
    setSectionFilter(NO_SECTION_FILTER);
    setSprintFilter(NO_SECTION_FILTER);
    setMilestoneFilter(NO_SECTION_FILTER);
    setViewParam(view.id);
  };

  // Drop the applied saved view (back to the default board/list toggle).
  const resetView = () => {
    setViewParam('');
    setViewMode('board');
    setSearch('');
    setPriorityFilter('ALL');
    setStatusFilter('ALL');
    setSectionFilter(NO_SECTION_FILTER);
    setSprintFilter(NO_SECTION_FILTER);
    setMilestoneFilter(NO_SECTION_FILTER);
  };

  // Arriving with ?view= (deep link / chip click) keeps the mode in sync.
  useEffect(() => {
    if (activeView) setViewMode(activeView.type === 'LIST' ? 'list' : 'board');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView?.id]);

  // Auto-apply the project's default view on first load when none is chosen.
  const defaultAppliedRef = useRef(false);
  useEffect(() => {
    if (!project?.id || viewParam || defaultAppliedRef.current) return;
    const defaultView = views.find((v) => v.isDefault);
    if (defaultView) {
      setViewMode(defaultView.type === 'LIST' ? 'list' : 'board');
      defaultAppliedRef.current = true;
    }
  }, [project?.id, viewParam, views]);

  // ── Permission helpers (mirror ProjectDetailsPage) ────────────────────────
  const { userId } = useUserProfile();
  const { canCreateTasks } = useProjectRole(project?.id, project);

  // Plain derived value — the React Compiler memoizes it (manual useMemo here
  // would trip the compiler's dep-inference check).
  const isMember = project?.members && userId
    ? project.members.some((m) => m.userId === userId || m.user?.id === userId)
    : false;

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
    if (statusFilter !== 'ALL') result = result.filter((t) => t.status === statusFilter);
    if (sectionFilter !== NO_SECTION_FILTER) result = result.filter((t) => t.sectionId === sectionFilter);
    if (sprintFilter !== NO_SECTION_FILTER) result = result.filter((t) => t.sprintId === sprintFilter);
    if (milestoneFilter !== NO_SECTION_FILTER) result = result.filter((t) => t.milestoneId === milestoneFilter);
    return result;
  }, [tasks, search, priorityFilter, statusFilter, sectionFilter, sprintFilter, milestoneFilter]);

  // Tasks grouped per column — an assigned section wins over status so a card
  // never renders twice (see assignTasksToColumns).
  const tasksByColumn = useMemo(
    () => assignTasksToColumns(boardColumns, filteredTasks),
    [boardColumns, filteredTasks],
  );

  // ── Client-side pagination for the list view ──────────────────────────────
  const { paginatedItems, currentPage, totalPages, totalItems, setCurrentPage } = usePagination<Task>({
    items: filteredTasks,
    itemsPerPage: LIST_PAGE_SIZE,
  });

  // Back to page 1 whenever the filters change so the user never lands on an
  // empty page after narrowing the results.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, priorityFilter, statusFilter, sectionFilter, setCurrentPage]);

  return {
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
    activeViewId: viewParam || null,
    applyView,
    resetView,
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
  };
}
