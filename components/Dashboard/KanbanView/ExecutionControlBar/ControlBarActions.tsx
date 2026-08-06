import { Filter, ArrowUpDown, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterDropdown } from "@/components/Shared/FilterDropdown";
import { KanbanSort, KanbanFilters } from "@/hooks/useKanbanPage";

interface ControlBarActionsProps {
  showFilters: boolean;
  activeFilterCount: number;
  filters: KanbanFilters;
  sort: KanbanSort;
  enforceWIP: boolean;
  onToggleFilters: () => void;
  onSortChange: (sort: KanbanSort) => void;
  onToggleBlockedOnly: () => void;
  onToggleStaleOnly: () => void;
  onEnforceWIPChange: (enabled: boolean) => void;
}

export function ControlBarActions({
  showFilters,
  activeFilterCount,
  filters,
  sort,
  enforceWIP,
  onToggleFilters,
  onSortChange,
  onToggleBlockedOnly,
  onToggleStaleOnly,
  onEnforceWIPChange,
}: ControlBarActionsProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
      {/* Filters Button */}
      <button
        onClick={onToggleFilters}
        className={cn(
          "flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors",
          showFilters || activeFilterCount > 0
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-accent"
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

      {/* Sort Dropdown — click-to-open (touch friendly, viewport clamped) */}
      <FilterDropdown
        label="Sort"
        value={sort.charAt(0).toUpperCase() + sort.slice(1)}
        icon={<ArrowUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
      >
        {(close) => (
          <>
            {(["priority", "aging", "recent", "comments"] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  onSortChange(s);
                  close();
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors capitalize",
                  sort === s && "bg-accent font-medium"
                )}
              >
                {s}
              </button>
            ))}
          </>
        )}
      </FilterDropdown>

      {/* Blocked Only Button */}
      <button
        onClick={onToggleBlockedOnly}
        className={cn(
          "flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors",
          filters.blockedOnly
            ? "bg-destructive text-destructive-foreground"
            : "bg-muted text-muted-foreground hover:bg-accent"
        )}
      >
        <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Blocked only</span>
      </button>

      {/* Stale Tasks Button */}
      <button
        onClick={onToggleStaleOnly}
        className={cn(
          "flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors",
          filters.staleOnly
            ? "bg-amber-500 text-white"
            : "bg-muted text-muted-foreground hover:bg-accent"
        )}
      >
        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Stale tasks</span>
      </button>

      {/* WIP Limits Toggle */}
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
  );
}
