// components/ActivityFilters/DateRangeFilter.tsx
import { X } from 'lucide-react';
import { ActivityFilterValues } from '@/types/activityFilter.types';
import { Button } from '@/components/ui/Button';

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
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex-1 min-w-50">
        <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="fld-7">
          From
        </label>
        <input id="fld-7"
          type="date"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          value={
            filters.startDate
              ? new Date(filters.startDate).toISOString().split('T')[0]
              : ''
          }
          onChange={(e) => onStartDateChange(e.target.value)}
        />
      </div>

      <div className="flex-1 min-w-50">
        <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="fld-8">
          To
        </label>
        <input id="fld-8"
          type="date"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          value={
            filters.endDate
              ? new Date(filters.endDate).toISOString().split('T')[0]
              : ''
          }
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onClose}
        className="rounded-lg text-foreground hover:bg-accent"
        aria-label="Close custom date range"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
