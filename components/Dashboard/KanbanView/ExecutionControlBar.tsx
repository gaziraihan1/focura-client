import React from "react";
import { KanbanFilters, KanbanSort, useExecutionControlBar } from "@/hooks/useKanbanPage";
import { FocusModeBar } from "./ExecutionControlBar/FocusModeBar";
import { ControlBarActions } from "./ExecutionControlBar/ControlBarActions";
import { FiltersPanel } from "./ExecutionControlBar/FiltersPanel";


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
  const {
    showFilters,
    activeFilterCount,
    togglePriority,
    toggleBlockedOnly,
    toggleStaleOnly,
    clearFilters,
    toggleFiltersPanel,
  } = useExecutionControlBar({ filters, onFiltersChange });

  if (focusMode) {
    return <FocusModeBar />;
  }

  return (
    <div className="border-b border-border bg-card">
      <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
        <ControlBarActions
          showFilters={showFilters}
          activeFilterCount={activeFilterCount}
          filters={filters}
          sort={sort}
          enforceWIP={enforceWIP}
          onToggleFilters={toggleFiltersPanel}
          onSortChange={onSortChange}
          onToggleBlockedOnly={toggleBlockedOnly}
          onToggleStaleOnly={toggleStaleOnly}
          onEnforceWIPChange={onEnforceWIPChange}
        />
      </div>

      {showFilters && (
        <FiltersPanel
          filters={filters}
          onTogglePriority={togglePriority}
          onClearFilters={clearFilters}
        />
      )}
    </div>
  );
}