import { Task } from "@/hooks/useTask";
import { cn } from "@/lib/utils";
import { ChevronDown, Filter, LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { PRIORITY_CONFIG } from "./PriorityBadge";
import { COLUMNS } from "./ListRow";
type ViewMode     = 'board' | 'list';
type TaskPriority = Task['priority'];
type TaskStatus   = Task['status'];

export function Toolbar({
  viewMode,       setViewMode,
  search,         setSearch,
  priorityFilter, setPriorityFilter,
  statusFilter,   setStatusFilter,
}: {
  viewMode:          ViewMode;
  setViewMode:       (v: ViewMode) => void;
  search:            string;
  setSearch:         (v: string) => void;
  priorityFilter:    TaskPriority | 'ALL';
  setPriorityFilter: (v: TaskPriority | 'ALL') => void;
  statusFilter:      TaskStatus | 'ALL';
  setStatusFilter:   (v: TaskStatus | 'ALL') => void;
}) {
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [statusOpen,   setStatusOpen]   = useState(false);

  const hasFilters = priorityFilter !== 'ALL' || statusFilter !== 'ALL';

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
            onClick={() => { setPriorityOpen((p) => !p); setStatusOpen(false); }}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground',
              priorityFilter !== 'ALL' && 'border-primary/50 text-primary bg-primary/5',
            )}
          >
            <SlidersHorizontal className="size-3.5" />
            <span className="hidden sm:inline">
              {priorityFilter === 'ALL' ? 'Priority' : PRIORITY_CONFIG[priorityFilter as TaskPriority].label}
            </span>
            <ChevronDown className={cn('size-3.5 transition-transform', priorityOpen && 'rotate-180')} />
          </button>
          {priorityOpen && (
            <div className="absolute top-full left-0 mt-1.5 z-30 min-w-37.5 rounded-xl border border-border bg-popover shadow-[0_8px_24px_0_rgb(0_0_0/0.12)] py-1 overflow-hidden">
              {(['ALL', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => { setPriorityFilter(p); setPriorityOpen(false); }}
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
            onClick={() => { setStatusOpen((p) => !p); setPriorityOpen(false); }}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground',
              statusFilter !== 'ALL' && 'border-primary/50 text-primary bg-primary/5',
            )}
          >
            <Filter className="size-3.5" />
            <span className="hidden sm:inline">
              {statusFilter === 'ALL' ? 'Status' : COLUMNS.find((c) => c.status === statusFilter)?.label}
            </span>
            <ChevronDown className={cn('size-3.5 transition-transform', statusOpen && 'rotate-180')} />
          </button>
          {statusOpen && (
            <div className="absolute top-full left-0 mt-1.5 z-30 min-w-40 rounded-xl border border-border bg-popover shadow-[0_8px_24px_0_rgb(0_0_0/0.12)] py-1 overflow-hidden">
              {(['ALL', ...COLUMNS.map((c) => c.status)] as const).map((s) => {
                const col = COLUMNS.find((c) => c.status === s);
                return (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s as TaskStatus | 'ALL'); setStatusOpen(false); }}
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

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={() => { setPriorityFilter('ALL'); setStatusFilter('ALL'); }}
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
    </div>
  );
}