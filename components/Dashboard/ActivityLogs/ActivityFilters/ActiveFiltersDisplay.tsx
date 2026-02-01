// components/ActivityFilters/ActiveFiltersDisplay.tsx
import { Filter } from 'lucide-react';
import { ActivityFilterValues } from '@/types/activityFilter.types';
import { ACTION_OPTIONS, ENTITY_OPTIONS } from '@/constant/activityFilter.constant';
import { ActiveFiltersBadge } from './ActiveFiltersBadge';

interface ActiveFiltersDisplayProps {
  filters: ActivityFilterValues;
  onClearAction: () => void;
  onClearEntityType: () => void;
  onClearDateRange: () => void;
}

export function ActiveFiltersDisplay({
  filters,
  onClearAction,
  onClearEntityType,
  onClearDateRange,
}: ActiveFiltersDisplayProps) {
  const hasActiveFilters =
    filters.action || filters.entityType || filters.startDate || filters.endDate;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Filter className="h-4 w-4 text-gray-500" />
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Active filters:
      </span>

      {filters.action && (
        <ActiveFiltersBadge
          label="Action"
          value={
            ACTION_OPTIONS.find((o) => o.value === filters.action)?.label || ''
          }
          onClear={onClearAction}
        />
      )}

      {filters.entityType && (
        <ActiveFiltersBadge
          label="Type"
          value={
            ENTITY_OPTIONS.find((o) => o.value === filters.entityType)?.label ||
            ''
          }
          onClear={onClearEntityType}
        />
      )}

      {(filters.startDate || filters.endDate) && (
        <ActiveFiltersBadge
          label="Date Range"
          value=""
          onClear={onClearDateRange}
        />
      )}
    </div>
  );
}