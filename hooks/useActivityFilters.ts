// hooks/useActivityFilters.ts
import { useState, useCallback } from 'react';
import {
  ActivityFilterValues,
  ActivityAction,
  EntityType,
  DatePreset,
} from '@/types/activityFilter.types';

interface UseActivityFiltersProps {
  filters: ActivityFilterValues;
  onFiltersChange: (filters: ActivityFilterValues) => void;
}

export function useActivityFilters({
  filters,
  onFiltersChange,
}: UseActivityFiltersProps) {
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);

  const handleActionChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        action: value === 'all' ? undefined : (value as ActivityAction),
      });
    },
    [filters, onFiltersChange]
  );

  const handleEntityTypeChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        entityType: value === 'all' ? undefined : (value as EntityType),
      });
    },
    [filters, onFiltersChange]
  );

  const handleDatePresetChange = useCallback(
    (value: DatePreset | '') => {
      if (!value) return;

      if (value === 'custom') {
        setShowCustomDateRange(true);
        return;
      }

      const { startDate, endDate } = calculateDateRange(value);

      onFiltersChange({
        ...filters,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      });
      setShowCustomDateRange(false);
    },
    [filters, onFiltersChange]
  );

  const handleClearFilters = useCallback(() => {
    onFiltersChange({});
    setShowCustomDateRange(false);
  }, [onFiltersChange]);

  const handleClearAction = useCallback(() => {
    onFiltersChange({
      ...filters,
      action: undefined,
    });
  }, [filters, onFiltersChange]);

  const handleClearEntityType = useCallback(() => {
    onFiltersChange({
      ...filters,
      entityType: undefined,
    });
  }, [filters, onFiltersChange]);

  const handleClearDateRange = useCallback(() => {
    onFiltersChange({
      ...filters,
      startDate: undefined,
      endDate: undefined,
    });
    setShowCustomDateRange(false);
  }, [filters, onFiltersChange]);

  const handleStartDateChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        startDate: value ? new Date(value).toISOString() : undefined,
      });
    },
    [filters, onFiltersChange]
  );

  const handleEndDateChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        endDate: value ? new Date(value).toISOString() : undefined,
      });
    },
    [filters, onFiltersChange]
  );

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return {
    showCustomDateRange,
    setShowCustomDateRange,
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
  };
}

// Helper function to calculate date ranges
function calculateDateRange(preset: Exclude<DatePreset, 'custom'>): {
  startDate: Date;
  endDate: Date;
} {
  const now = new Date();

  switch (preset) {
    case 'today':
      return {
        startDate: new Date(now.setHours(0, 0, 0, 0)),
        endDate: new Date(now.setHours(23, 59, 59, 999)),
      };

    case 'yesterday': {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        startDate: new Date(yesterday.setHours(0, 0, 0, 0)),
        endDate: new Date(yesterday.setHours(23, 59, 59, 999)),
      };
    }

    case 'week': {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return {
        startDate: new Date(weekStart.setHours(0, 0, 0, 0)),
        endDate: new Date(now.setHours(23, 59, 59, 999)),
      };
    }

    case 'month':
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: new Date(now.setHours(23, 59, 59, 999)),
      };
  }
}