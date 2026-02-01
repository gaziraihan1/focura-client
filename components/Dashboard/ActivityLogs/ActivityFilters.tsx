// components/ActivityFilters/ActivityFilters.tsx (BEST SOLUTION)
import { X } from 'lucide-react';
import { ActivityFilterValues } from '@/types/activityFilter.types';
import {
  ACTION_OPTIONS,
  ENTITY_OPTIONS,
  DATE_PRESETS,
} from '@/constant/activityFilter.constant';
import { useActivityFilters } from '@/hooks/useActivityFilters';
import { FilterSelect } from './ActivityFilters/FilterSelect';
import { DatePresetSelect } from './ActivityFilters/DatePresetSelect';
import { DateRangeFilter } from './ActivityFilters/DateRangeFilter';
import { ActiveFiltersDisplay } from './ActivityFilters/ActiveFiltersDisplay';

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
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <X className="h-4 w-4" />
            Clear ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Custom Date Range */}
      {showCustomDateRange && (
        <DateRangeFilter
          filters={filters}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onClose={handleClearDateRange}
        />
      )}

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