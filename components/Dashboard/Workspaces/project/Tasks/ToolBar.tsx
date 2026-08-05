import { Task } from "@/hooks/useTask";
import { cn } from "@/lib/utils";
import { ChevronDown, Eye, Filter, Flag, FolderOpen, LayoutGrid, List, Search, SlidersHorizontal, Sprout, X } from "lucide-react";
import { useState } from "react";
import { PRIORITY_CONFIG } from "./PriorityBadge";
import { COLUMNS } from "./ListRow";
import type { MilestoneItem, ProjectSectionItem, ProjectViewItem, SprintItem } from "@/hooks/useProjectFeatures";
type ViewMode     = 'board' | 'list';
type TaskPriority = Task['priority'];
type TaskStatus   = Task['status'];

export function Toolbar({
  viewMode,       setViewMode,
  search,         setSearch,
  priorityFilter, setPriorityFilter,
  statusFilter,   setStatusFilter,
  sections = [],
  sectionFilter = 'ALL',
  setSectionFilter,
  sprints = [],
  sprintFilter = 'ALL',
  setSprintFilter,
  milestones = [],
  milestoneFilter = 'ALL',
  setMilestoneFilter,
  views = [],
  activeViewId = null,
  onApplyView,
  onResetView,
}: {
  viewMode:          ViewMode;
  setViewMode:       (v: ViewMode) => void;
  search:            string;
  setSearch:         (v: string) => void;
  priorityFilter:    TaskPriority | 'ALL';
  setPriorityFilter: (v: TaskPriority | 'ALL') => void;
  statusFilter:      TaskStatus | 'ALL';
  setStatusFilter:   (v: TaskStatus | 'ALL') => void;
  sections?:         ProjectSectionItem[];
  sectionFilter?:    string;
  setSectionFilter?: (v: string) => void;
  sprints?:          SprintItem[];
  sprintFilter?:     string;
  setSprintFilter?:  (v: string) => void;
  milestones?:       MilestoneItem[];
  milestoneFilter?:  string;
  setMilestoneFilter?: (v: string) => void;
  views?:            ProjectViewItem[];
  activeViewId?:     string | null;
  onApplyView?:      (view: ProjectViewItem) => void;
  onResetView?:      () => void;
}) {
  const [openMenu, setOpenMenu] = useState<'priority' | 'status' | 'section' | 'sprint' | 'milestone' | null>(null);

  const activeSection = sections.find((s) => s.id === sectionFilter);
  const activeSprint = sprints.find((s) => s.id === sprintFilter);
  const activeMilestone = milestones.find((m) => m.id === milestoneFilter);
  const hasFilters = priorityFilter !== 'ALL' || statusFilter !== 'ALL' || sectionFilter !== 'ALL' || sprintFilter !== 'ALL' || milestoneFilter !== 'ALL';

  return (
    <div className="flex flex-col gap-2">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks…"
          className="w-full rounded-lg border border-border bg-background pl-8 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Priority dropdown */}
        <div className="relative">
          <button
            onClick={() => { setOpenMenu((cur) => (cur === 'priority' ? null : 'priority')); }}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground',
              priorityFilter !== 'ALL' && 'border-primary/50 text-primary bg-primary/5',
            )}
          >
            <SlidersHorizontal className="size-3.5" />
            <span className="hidden sm:inline">
              {priorityFilter === 'ALL' ? 'Priority' : PRIORITY_CONFIG[priorityFilter as TaskPriority].label}
            </span>
            <ChevronDown className={cn('size-3.5 transition-transform', openMenu === 'priority' && 'rotate-180')} />
          </button>
          {openMenu === 'priority' && (
            <div className="absolute top-full left-0 mt-1.5 z-30 min-w-37.5 rounded-xl border border-border bg-popover shadow-[0_8px_24px_0_rgb(0_0_0/0.12)] py-1 overflow-hidden">
              {(['ALL', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => { setPriorityFilter(p); setOpenMenu(null); }}
                  className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors', priorityFilter === p && 'bg-muted font-medium')}
                >
                  {p !== 'ALL' && <span className={cn('size-2 rounded-full shrink-0', PRIORITY_CONFIG[p].dot)} />}
                  {p === 'ALL' ? 'All priorities' : PRIORITY_CONFIG[p].label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status dropdown */}
        <div className="relative">
          <button
            onClick={() => { setOpenMenu((cur) => (cur === 'status' ? null : 'status')); }}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground',
              statusFilter !== 'ALL' && 'border-primary/50 text-primary bg-primary/5',
            )}
          >
            <Filter className="size-3.5" />
            <span className="hidden sm:inline">
              {statusFilter === 'ALL' ? 'Status' : COLUMNS.find((c) => c.status === statusFilter)?.label}
            </span>
            <ChevronDown className={cn('size-3.5 transition-transform', openMenu === 'status' && 'rotate-180')} />
          </button>
          {openMenu === 'status' && (
            <div className="absolute top-full left-0 mt-1.5 z-30 min-w-40 rounded-xl border border-border bg-popover shadow-[0_8px_24px_0_rgb(0_0_0/0.12)] py-1 overflow-hidden">
              {(['ALL', ...COLUMNS.map((c) => c.status)] as const).map((s) => {
                const col = COLUMNS.find((c) => c.status === s);
                return (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s as TaskStatus | 'ALL'); setOpenMenu(null); }}
                    className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors', statusFilter === s && 'bg-muted font-medium')}
                  >
                    {col && <span className={col.color}>{col.icon}</span>}
                    {s === 'ALL' ? 'All statuses' : col?.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section dropdown */}
        <div className="relative">
          <button
            onClick={() => { setOpenMenu((cur) => (cur === 'section' ? null : 'section')); }}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground',
              sectionFilter !== 'ALL' && 'border-primary/50 text-primary bg-primary/5',
            )}
          >
            <FolderOpen className="size-3.5" />
            <span className="hidden sm:inline">{activeSection ? activeSection.name : 'Section'}</span>
            <ChevronDown className={cn('size-3.5 transition-transform', openMenu === 'section' && 'rotate-180')} />
          </button>
          {openMenu === 'section' && (
            <div className="absolute top-full left-0 mt-1.5 z-30 min-w-44 rounded-xl border border-border bg-popover shadow-[0_8px_24px_0_rgb(0_0_0/0.12)] py-1 overflow-hidden">
              <button
                onClick={() => { setSectionFilter?.('ALL'); setOpenMenu(null); }}
                className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors', sectionFilter === 'ALL' && 'bg-muted font-medium')}
              >
                All sections
              </button>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => { setSectionFilter?.(section.id); setOpenMenu(null); }}
                  className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors', sectionFilter === section.id && 'bg-muted font-medium')}
                >
                  <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: section.color ?? '#667eea' }} />
                  {section.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sprint dropdown */}
        <div className="relative">
          <button
            onClick={() => { setOpenMenu((cur) => (cur === 'sprint' ? null : 'sprint')); }}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground',
              sprintFilter !== 'ALL' && 'border-primary/50 text-primary bg-primary/5',
            )}
          >
            <Sprout className="size-3.5" />
            <span className="hidden sm:inline">{activeSprint ? activeSprint.name : 'Sprint'}</span>
            <ChevronDown className={cn('size-3.5 transition-transform', openMenu === 'sprint' && 'rotate-180')} />
          </button>
          {openMenu === 'sprint' && (
            <div className="absolute top-full left-0 mt-1.5 z-30 min-w-44 rounded-xl border border-border bg-popover shadow-[0_8px_24px_0_rgb(0_0_0/0.12)] py-1 overflow-hidden">
              <button
                onClick={() => { setSprintFilter?.('ALL'); setOpenMenu(null); }}
                className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors', sprintFilter === 'ALL' && 'bg-muted font-medium')}
              >
                All sprints
              </button>
              {sprints.map((sprint) => (
                <button
                  key={sprint.id}
                  onClick={() => { setSprintFilter?.(sprint.id); setOpenMenu(null); }}
                  className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors', sprintFilter === sprint.id && 'bg-muted font-medium')}
                >
                  <span className={cn('size-2 rounded-full shrink-0', sprint.status === 'ACTIVE' ? 'bg-emerald-500' : sprint.status === 'COMPLETED' ? 'bg-blue-500' : 'bg-muted-foreground/40')} />
                  <span className="truncate">{sprint.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Milestone dropdown */}
        <div className="relative">
          <button
            onClick={() => { setOpenMenu((cur) => (cur === 'milestone' ? null : 'milestone')); }}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground',
              milestoneFilter !== 'ALL' && 'border-primary/50 text-primary bg-primary/5',
            )}
          >
            <Flag className="size-3.5" />
            <span className="hidden sm:inline">{activeMilestone ? activeMilestone.title : 'Milestone'}</span>
            <ChevronDown className={cn('size-3.5 transition-transform', openMenu === 'milestone' && 'rotate-180')} />
          </button>
          {openMenu === 'milestone' && (
            <div className="absolute top-full left-0 mt-1.5 z-30 min-w-44 rounded-xl border border-border bg-popover shadow-[0_8px_24px_0_rgb(0_0_0/0.12)] py-1 overflow-hidden">
              <button
                onClick={() => { setMilestoneFilter?.('ALL'); setOpenMenu(null); }}
                className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors', milestoneFilter === 'ALL' && 'bg-muted font-medium')}
              >
                All milestones
              </button>
              {milestones.map((milestone) => (
                <button
                  key={milestone.id}
                  onClick={() => { setMilestoneFilter?.(milestone.id); setOpenMenu(null); }}
                  className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors', milestoneFilter === milestone.id && 'bg-muted font-medium')}
                >
                  <span className={cn('size-2 rounded-full shrink-0', milestone.status === 'COMPLETED' ? 'bg-blue-500' : milestone.status === 'DELAYED' ? 'bg-red-500' : milestone.status === 'AT_RISK' ? 'bg-amber-500' : 'bg-emerald-500')} />
                  <span className="truncate">{milestone.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={() => { setPriorityFilter('ALL'); setStatusFilter('ALL'); setSectionFilter?.('ALL'); setSprintFilter?.('ALL'); setMilestoneFilter?.('ALL'); }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-3" /> Clear
          </button>
        )}

        <div className="flex-1" />

        {/* View toggle */}
        <div className="flex items-center rounded-lg border border-border bg-background p-0.5 gap-0.5">
          {(['board', 'list'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              aria-label={`${mode} view`}
              className={cn(
                'flex items-center justify-center rounded-md px-2.5 py-1.5 transition-all',
                viewMode === mode ? 'bg-muted text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {mode === 'board' ? <LayoutGrid className="size-3.5" /> : <List className="size-3.5" />}
            </button>
          ))}
        </div>
      </div>

        {/* Saved views */}
        {views.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground mr-0.5">
              <Eye className="size-3" /> Views
            </span>
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => onApplyView?.(view)}
                className={cn(
                  'flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
                  activeViewId === view.id
                    ? 'border-primary/50 bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                <Eye className="size-3" />
                {view.name}
                {view.isDefault && (
                  <span className="rounded bg-primary/15 px-1 text-[9px] font-semibold text-primary">Default</span>
                )}
              </button>
            ))}
            {activeViewId && (
              <button
                onClick={() => { setViewMode('board'); onResetView?.(); }}
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
              >
                Reset view
              </button>
            )}
          </div>
        )}
    </div>
  );
}