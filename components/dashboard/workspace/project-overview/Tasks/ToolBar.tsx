import { Task } from "@/hooks/useTask";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CalendarDays, ChevronDown, Eye, Filter, Flag, FolderOpen, GanttChartSquare, LayoutGrid, List, Search, SlidersHorizontal, Sprout, X } from "lucide-react";
import { useState } from "react";
import { FilterDropdown } from "@/components/shared/FilterDropdown";
import { PRIORITY_CONFIG } from "./PriorityBadge";
import { COLUMNS } from "./ListRow";
import type { MilestoneItem, ProjectSectionItem, ProjectViewItem, SprintItem } from "@/hooks/useProjectFeatures";
type ViewMode     = 'board' | 'list' | 'calendar' | 'timeline';
type TaskPriority = Task['priority'];
type TaskStatus   = Task['status'];

// Board / List / Calendar / Timeline switch. Rendered twice so it can live on
// its own row on mobile (next to the Filters toggle) while staying inline on
// the right of the filter row on larger screens.
  const buttons: Array<{ mode: ViewMode; label: string; icon: React.ReactNode }> = [
    { mode: 'board', label: 'board view', icon: <LayoutGrid className="size-3.5" /> },
    { mode: 'list', label: 'list view', icon: <List className="size-3.5" /> },
    { mode: 'calendar', label: 'calendar view', icon: <CalendarDays className="size-3.5" /> },
    { mode: 'timeline', label: 'timeline view', icon: <GanttChartSquare className="size-3.5" /> },
  ];
function ViewToggle({
  viewMode,
  setViewMode,
}: {
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
}) {

  return (
    <div className="flex items-center rounded-lg border border-border bg-background p-0.5 gap-0.5">
      {buttons.map(({ mode, label, icon }) => (
        <Button
          key={mode}
          variant="ghost"
          onClick={() => setViewMode(mode)}
          aria-label={label}
          title={label}
          className={cn(
            'flex items-center justify-center rounded-md px-2.5 py-1.5 transition-all',
            viewMode === mode ? 'bg-muted text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {icon}
        </Button>
      ))}
    </div>
  );
}

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
  onClearFilters,
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
  onClearFilters?:   () => void;
}) {
  // On small screens the filter controls are hidden behind this toggle (large
  // screens show them always, expanded by default).
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeSection = sections.find((s) => s.id === sectionFilter);
  const activeSprint = sprints.find((s) => s.id === sprintFilter);
  const activeMilestone = milestones.find((m) => m.id === milestoneFilter);
  const activeFilterCount =
    (search !== '' ? 1 : 0) +
    (priorityFilter !== 'ALL' ? 1 : 0) +
    (statusFilter !== 'ALL' ? 1 : 0) +
    (sectionFilter !== 'ALL' ? 1 : 0) +
    (sprintFilter !== 'ALL' ? 1 : 0) +
    (milestoneFilter !== 'ALL' ? 1 : 0);
  const hasFilters = activeFilterCount > 0;

  return (
    <div className="flex flex-col gap-2">
      {/* Mobile controls row — filters toggle + view switch, always visible */}
      <div className="flex items-center justify-between gap-2 sm:hidden">
        <Button
          variant="outline"
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          aria-controls="project-task-filters"
          className={cn(
            'flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground',
            hasFilters && 'border-primary/50 text-primary bg-primary/5',
          )}
        >
          <SlidersHorizontal className="size-3.5" />
          <span>Filters</span>
          {hasFilters && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={cn('size-3.5 transition-transform', filtersOpen && 'rotate-180')} />
        </Button>

        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* Filter controls — collapsed behind the toggle on mobile, always visible on sm+ */}
      <div
        id="project-task-filters"
        className={cn('flex-col gap-2', filtersOpen ? 'flex' : 'hidden sm:flex')}
      >
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <input aria-label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks…"
            className="w-full rounded-lg border border-border bg-background pl-8 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
          />
          {search && (
            <Button variant="ghost" onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Search">
              <X className="size-3.5" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Priority dropdown */}
          <FilterDropdown
            label="Priority"
            icon={<SlidersHorizontal className="size-3.5" />}
            value={priorityFilter === 'ALL' ? undefined : PRIORITY_CONFIG[priorityFilter as TaskPriority].label}
            active={priorityFilter !== 'ALL'}
          >
            {(close) => (
              <>
                {(['ALL', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).map((p) => (
                  <Button
                    key={p}
                    variant="ghost"
                    onClick={() => { setPriorityFilter(p); close(); }}
                    className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors', priorityFilter === p && 'bg-muted font-medium')}
                  >
                    {p !== 'ALL' && <span className={cn('size-2 rounded-full shrink-0', PRIORITY_CONFIG[p].dot)} />}
                    {p === 'ALL' ? 'All priorities' : PRIORITY_CONFIG[p].label}
                  </Button>
                ))}
              </>
            )}
          </FilterDropdown>

          {/* Status dropdown */}
          <FilterDropdown
            label="Status"
            icon={<Filter className="size-3.5" />}
            value={statusFilter === 'ALL' ? undefined : COLUMNS.find((c) => c.status === statusFilter)?.label}
            active={statusFilter !== 'ALL'}
          >
            {(close) => (
              <>
                {(['ALL', ...COLUMNS.map((c) => c.status)] as const).map((s) => {
                  const col = COLUMNS.find((c) => c.status === s);
                  return (
                    <Button
                      key={s}
                      variant="ghost"
                      onClick={() => { setStatusFilter(s as TaskStatus | 'ALL'); close(); }}
                      className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors', statusFilter === s && 'bg-muted font-medium')}
                    >
                      {col && <span className={col.color}>{col.icon}</span>}
                      {s === 'ALL' ? 'All statuses' : col?.label}
                    </Button>
                  );
                })}
              </>
            )}
          </FilterDropdown>

          {/* Section dropdown */}
          <FilterDropdown
            label="Section"
            icon={<FolderOpen className="size-3.5" />}
            value={sectionFilter === 'ALL' ? undefined : activeSection?.name}
            active={sectionFilter !== 'ALL'}
          >
            {(close) => (
              <>
                <Button
                  variant="ghost"
                  onClick={() => { setSectionFilter?.('ALL'); close(); }}
                  className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors', sectionFilter === 'ALL' && 'bg-muted font-medium')}
                >
                  All sections
                </Button>
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant="ghost"
                    onClick={() => { setSectionFilter?.(section.id); close(); }}
                    className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors', sectionFilter === section.id && 'bg-muted font-medium')}
                  >
                    <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: section.color ?? '#667eea' }} />
                    {section.name}
                  </Button>
                ))}
              </>
            )}
          </FilterDropdown>

          {/* Sprint dropdown */}
          <FilterDropdown
            label="Sprint"
            icon={<Sprout className="size-3.5" />}
            value={sprintFilter === 'ALL' ? undefined : activeSprint?.name}
            active={sprintFilter !== 'ALL'}
          >
            {(close) => (
              <>
                <Button
                  variant="ghost"
                  onClick={() => { setSprintFilter?.('ALL'); close(); }}
                  className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors', sprintFilter === 'ALL' && 'bg-muted font-medium')}
                >
                  All sprints
                </Button>
                {sprints.map((sprint) => (
                  <Button
                    key={sprint.id}
                    variant="ghost"
                    onClick={() => { setSprintFilter?.(sprint.id); close(); }}
                    className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors', sprintFilter === sprint.id && 'bg-muted font-medium')}
                  >
                    <span className={cn('size-2 rounded-full shrink-0', sprint.status === 'ACTIVE' ? 'bg-emerald-500' : sprint.status === 'COMPLETED' ? 'bg-blue-500' : 'bg-muted-foreground/40')} />
                    <span className="truncate">{sprint.name}</span>
                  </Button>
                ))}
              </>
            )}
          </FilterDropdown>

          {/* Milestone dropdown */}
          <FilterDropdown
            label="Milestone"
            icon={<Flag className="size-3.5" />}
            value={milestoneFilter === 'ALL' ? undefined : activeMilestone?.title}
            active={milestoneFilter !== 'ALL'}
          >
            {(close) => (
              <>
                <Button
                  variant="ghost"
                  onClick={() => { setMilestoneFilter?.('ALL'); close(); }}
                  className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors', milestoneFilter === 'ALL' && 'bg-muted font-medium')}
                >
                  All milestones
                </Button>
                {milestones.map((milestone) => (
                  <Button
                    key={milestone.id}
                    variant="ghost"
                    onClick={() => { setMilestoneFilter?.(milestone.id); close(); }}
                    className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors', milestoneFilter === milestone.id && 'bg-muted font-medium')}
                  >
                    <span className={cn('size-2 rounded-full shrink-0', milestone.status === 'COMPLETED' ? 'bg-blue-500' : milestone.status === 'DELAYED' ? 'bg-red-500' : milestone.status === 'AT_RISK' ? 'bg-amber-500' : 'bg-emerald-500')} />
                    <span className="truncate">{milestone.title}</span>
                  </Button>
                ))}
              </>
            )}
          </FilterDropdown>

          {/* Clear */}
          {hasFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="size-3.5" /> Clear
            </Button>
          )}

          <div className="hidden sm:block flex-1" />

          {/* View switch — inline on the right for sm+ (mobile has its own row) */}
          <div className="hidden sm:block">
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>
        </div>
      </div>

        {/* Saved views */}
        {views.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground mr-0.5">
              <Eye className="size-3" /> Views
            </span>
            {views.map((view) => (
              <Button
                key={view.id}
                variant="outline"
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
              </Button>
            ))}
            {activeViewId && (
              <Button
                variant="outline"
                onClick={onResetView}
                className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Reset view
              </Button>
            )}
          </div>
        )}
    </div>
  );
}