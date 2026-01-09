import React, { useState } from 'react';
import { 
  Filter, 
  ArrowUpDown,
  AlertCircle,
  Clock,
  X,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { KanbanFilters, KanbanSort } from '@/app/(dashboard-pages)/dashboard/tasks/kanban-board/page';

interface ExecutionControlBarProps {
  filters: KanbanFilters;
  onFiltersChange: (filters: KanbanFilters) => void;
  sort: KanbanSort;
  onSortChange: (sort: KanbanSort) => void;
  enforceWIP: boolean;
  onEnforceWIPChange: (enabled: boolean) => void;
  focusMode: boolean;
}

export function ExecutionControlBar({
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  enforceWIP,
  onEnforceWIPChange,
  focusMode,
}: ExecutionControlBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = 
    (filters.priority?.length || 0) + 
    (filters.blockedOnly ? 1 : 0) + 
    (filters.staleOnly ? 1 : 0);

  const togglePriority = (priority: string) => {
    const current = filters.priority || [];
    const updated = current.includes(priority)
      ? current.filter(p => p !== priority)
      : [...current, priority];
    onFiltersChange({ ...filters, priority: updated.length > 0 ? updated : undefined });
  };

  if (focusMode) {
    return (
      <div className="border-b border-border bg-muted/50 px-3 sm:px-4 lg:px-6 py-2">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Zap className="w-4 h-4 text-primary" />
          <span>Focus Mode: Showing only high-priority in-progress tasks</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-border bg-card">
      <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-all',
              showFilters || activeFilterCount > 0
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            )}
          >
            <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-primary-foreground text-primary rounded-full px-1.5 text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="relative group">
            <button className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-muted text-muted-foreground hover:bg-accent transition-all">
              <ArrowUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Sort:</span>
              <span className="capitalize font-medium text-foreground">{sort}</span>
            </button>

            <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[150px]">
              {(['priority', 'aging', 'recent', 'comments'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => onSortChange(s)}
                  className={cn(
                    'w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors capitalize',
                    sort === s && 'bg-accent font-medium'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => onFiltersChange({ ...filters, blockedOnly: !filters.blockedOnly })}
            className={cn(
              'flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-all',
              filters.blockedOnly
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            )}
          >
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Blocked only</span>
          </button>

          <button
            onClick={() => onFiltersChange({ ...filters, staleOnly: !filters.staleOnly })}
            className={cn(
              'flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-all',
              filters.staleOnly
                ? 'bg-amber-500 text-white'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            )}
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Stale tasks</span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enforceWIP}
                onChange={(e) => onEnforceWIPChange(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline">
                Enforce WIP limits
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground md:hidden">
                WIP
              </span>
            </label>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="border-t border-border bg-muted/50 px-3 sm:px-4 lg:px-6 py-3">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                Priority
              </label>
              <div className="flex flex-wrap gap-2">
                {['URGENT', 'HIGH', 'MEDIUM', 'LOW'].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => togglePriority(priority)}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded-md transition-all',
                      filters.priority?.includes(priority)
                        ? priority === 'URGENT'
                          ? 'bg-red-500 text-white'
                          : priority === 'HIGH'
                          ? 'bg-orange-500 text-white'
                          : priority === 'MEDIUM'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-500 text-white'
                        : 'bg-background border border-border text-muted-foreground hover:bg-accent'
                    )}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => onFiltersChange({ status: filters.status })}
              className="self-end flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear filters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
