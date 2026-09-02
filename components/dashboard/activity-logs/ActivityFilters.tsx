// components/ActivityFilters/ActivityFilters.tsx (BEST SOLUTION)
import { X } from "lucide-react";
import { ActivityFilterValues } from "@/types/activityFilter.types";
import {
  ACTION_OPTIONS,
  ENTITY_OPTIONS,
  DATE_PRESETS,
} from "@/constants/activityFilter.constants";
import { useActivityFilters } from "@/hooks/useActivityFilters";
import { FilterSelect } from "./ActivityFilters/FilterSelect";
import { Button } from "@/components/ui/Button";
import { DatePresetSelect } from "./ActivityFilters/DatePresetSelect";
import { DateRangeFilter } from "./ActivityFilters/DateRangeFilter";
import { ActiveFiltersDisplay } from "./ActivityFilters/ActiveFiltersDisplay";

interface ActivityFiltersProps {
  filters: ActivityFilterValues;
  onFiltersChange: (filters: ActivityFilterValues) => void;
  showDateFilters?: boolean;
}

export function ActivityFilters({
  filters,
  onFiltersChange,
  showDateFilters = false,
}: ActivityFiltersProps) {
  const {
    showCustomDateRange,
    activeFiltersCount,
    handleActionChange,
    handleEntityTypeChange,
    handleDatePresetChange,
    handleClearFilters,
    handleClearAction,
    handleClearEntityType,
    handleClearDateRange,
    handleStartDateChange,
    handleEndDateChange,
  } = useActivityFilters({ filters, onFiltersChange });

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Action Filter */}
          <FilterSelect
            value={filters.action}
            options={ACTION_OPTIONS}
            onChange={handleActionChange}
          />

          {/* Entity Type Filter */}
          <FilterSelect
            value={filters.entityType}
            options={ENTITY_OPTIONS}
            onChange={handleEntityTypeChange}
          />

          {/* Date Filter - NO ANY! */}
          {showDateFilters && (
            <DatePresetSelect
              options={DATE_PRESETS}
              onChange={handleDatePresetChange}
            />
          )}

          {/* Clear All Filters Button */}
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>

        {/* Custom Date Range */}
        {showCustomDateRange && (
          <div className="mt-4">
            <DateRangeFilter
              filters={filters}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              onClose={handleClearDateRange}
            />
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      <ActiveFiltersDisplay
        filters={filters}
        onClearAction={handleClearAction}
        onClearEntityType={handleClearEntityType}
        onClearDateRange={handleClearDateRange}
      />
    </div>
  );
}
