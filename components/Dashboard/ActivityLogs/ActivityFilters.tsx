import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';

export interface ActivityFilterValues {
  action?: string;
  entityType?: string;
  startDate?: string;
  endDate?: string;
}

interface ActivityFiltersProps {
  filters: ActivityFilterValues;
  onFiltersChange: (filters: ActivityFilterValues) => void;
  showDateFilters?: boolean;
}

const ACTION_OPTIONS = [
  { value: 'all', label: 'All Actions' },
  { value: 'CREATED', label: 'Created' },
  { value: 'UPDATED', label: 'Updated' },
  { value: 'DELETED', label: 'Deleted' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'COMMENTED', label: 'Commented' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'UNASSIGNED', label: 'Unassigned' },
  { value: 'STATUS_CHANGED', label: 'Status Changed' },
  { value: 'PRIORITY_CHANGED', label: 'Priority Changed' },
];

const ENTITY_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'TASK', label: 'Tasks' },
  { value: 'PROJECT', label: 'Projects' },
  { value: 'WORKSPACE', label: 'Workspaces' },
  { value: 'COMMENT', label: 'Comments' },
  { value: 'FILE', label: 'Files' },
];

const DATE_PRESETS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'custom', label: 'Custom Range' },
];

export function ActivityFilters({
  filters,
  onFiltersChange,
  showDateFilters = false,
}: ActivityFiltersProps) {
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFiltersChange({
      ...filters,
      action: value === 'all' ? undefined : value,
    });
  };

  const handleEntityTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFiltersChange({
      ...filters,
      entityType: value === 'all' ? undefined : value,
    });
  };

  const handleDatePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const now = new Date();
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    switch (value) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = new Date(yesterday.setHours(0, 0, 0, 0));
        endDate = new Date(yesterday.setHours(23, 59, 59, 999));
        break;
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        startDate = new Date(weekStart.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'custom':
        setShowCustomDateRange(true);
        return;
      default:
        startDate = undefined;
        endDate = undefined;
    }

    onFiltersChange({
      ...filters,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    });
    setShowCustomDateRange(false);
  };

  const handleClearFilters = () => {
    onFiltersChange({});
    setShowCustomDateRange(false);
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Action Filter */}
        <div className="flex-1 min-w-[200px]">
          <select
            value={filters.action || 'all'}
            onChange={handleActionChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {ACTION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Entity Type Filter */}
        <div className="flex-1 min-w-[200px]">
          <select
            value={filters.entityType || 'all'}
            onChange={handleEntityTypeChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {ENTITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        {showDateFilters && (
          <div className="flex-1 min-w-[200px]">
            <select
              onChange={handleDatePresetChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Filter by date</option>
              {DATE_PRESETS.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Clear Filters */}
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
        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">From</label>
            <input
              type="date"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
              value={
                filters.startDate
                  ? new Date(filters.startDate).toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  startDate: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : undefined,
                })
              }
            />
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">To</label>
            <input
              type="date"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
              value={
                filters.endDate
                  ? new Date(filters.endDate).toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  endDate: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : undefined,
                })
              }
            />
          </div>
          
          <button
            onClick={() => {
              setShowCustomDateRange(false);
              onFiltersChange({
                ...filters,
                startDate: undefined,
                endDate: undefined,
              });
            }}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
          
          {filters.action && (
            <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
              Action: {ACTION_OPTIONS.find(o => o.value === filters.action)?.label}
              <button
                onClick={() => handleActionChange({ target: { value: 'all' } } as any)}
                className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.entityType && (
            <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
              Type: {ENTITY_OPTIONS.find(o => o.value === filters.entityType)?.label}
              <button
                onClick={() => handleEntityTypeChange({ target: { value: 'all' } } as any)}
                className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {(filters.startDate || filters.endDate) && (
            <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
              Date Range
              <button
                onClick={() => {
                  onFiltersChange({
                    ...filters,
                    startDate: undefined,
                    endDate: undefined,
                  });
                  setShowCustomDateRange(false);
                }}
                className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}