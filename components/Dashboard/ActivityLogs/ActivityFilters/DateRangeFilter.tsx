// components/ActivityFilters/DateRangeFilter.tsx
import { X } from 'lucide-react';
import { ActivityFilterValues } from '@/types/activityFilter.types';

interface DateRangeFilterProps {
  filters: ActivityFilterValues;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClose: () => void;
}

export function DateRangeFilter({
  filters,
  onStartDateChange,
  onEndDateChange,
  onClose,
}: DateRangeFilterProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
      <div className="flex-1 min-w-[200px]">
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          From
        </label>
        <input
          type="date"
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
          value={
            filters.startDate
              ? new Date(filters.startDate).toISOString().split('T')[0]
              : ''
          }
          onChange={(e) => onStartDateChange(e.target.value)}
        />
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          To
        </label>
        <input
          type="date"
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
          value={
            filters.endDate
              ? new Date(filters.endDate).toISOString().split('T')[0]
              : ''
          }
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </div>

      <button
        onClick={onClose}
        className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
        aria-label="Close custom date range"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}