import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/axios';
import type {
  CalendarDayAggregate,
  CalendarInsights,
  GoalCheckpoint,
  SystemCalendarEvent,
  CalendarFilters,
  CreateGoalCheckpointInput,
} from '@/types/calendar.types';

export function useCalendarAggregates(filters: CalendarFilters) {
  const [data, setData] = useState<CalendarDayAggregate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        startDate: filters.startDate.toISOString(),
        endDate: filters.endDate.toISOString(),
        ...(filters.workspaceId && { workspaceId: filters.workspaceId }),
      });

      const result = await api.get<CalendarDayAggregate[]>(
        `/api/calendar/aggregates?${params}`,
        { showErrorToast: false }
      );

      if (result?.success && result.data) {
        setData(result.data);
      } else {
        setError(result?.message || 'Failed to fetch aggregates');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters.startDate, filters.endDate, filters.workspaceId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useCalendarInsights(filters: CalendarFilters) {
  const [data, setData] = useState<CalendarInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        startDate: filters.startDate.toISOString(),
        endDate: filters.endDate.toISOString(),
        ...(filters.workspaceId && { workspaceId: filters.workspaceId }),
      });

      const result = await api.get<CalendarInsights>(
        `/api/calendar/insights?${params}`,
        { showErrorToast: false }
      );

      if (result?.success && result.data) {
        setData(result.data);
      } else {
        setError(result?.message || 'Failed to fetch insights');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters.startDate, filters.endDate, filters.workspaceId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useGoalCheckpoints(filters: CalendarFilters) {
  const [data, setData] = useState<GoalCheckpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        startDate: filters.startDate.toISOString(),
        endDate: filters.endDate.toISOString(),
        ...(filters.workspaceId && { workspaceId: filters.workspaceId }),
      });

      const result = await api.get<GoalCheckpoint[]>(
        `/api/calendar/goals?${params}`,
        { showErrorToast: false }
      );

      if (result?.success && result.data) {
        setData(result.data);
      } else {
        setError(result?.message || 'Failed to fetch goals');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters.startDate, filters.endDate, filters.workspaceId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createGoal = async (input: CreateGoalCheckpointInput) => {
    try {
      const result = await api.post<GoalCheckpoint>(
        '/api/calendar/goals',
        input,
        { showSuccessToast: true }
      );

      if (result?.success) {
        await fetchData();
        return result.data;
      } else {
        throw new Error(result?.message || 'Failed to create goal');
      }
    } catch (err) {
      throw err;
    }
  };

  return { data, loading, error, refetch: fetchData, createGoal };
}

export function useSystemEvents(filters: CalendarFilters) {
  const [data, setData] = useState<SystemCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        startDate: filters.startDate.toISOString(),
        endDate: filters.endDate.toISOString(),
        ...(filters.workspaceId && { workspaceId: filters.workspaceId }),
      });

      const result = await api.get<SystemCalendarEvent[]>(
        `/api/calendar/system-events?${params}`,
        { showErrorToast: false }
      );

      if (result?.success && result.data) {
        setData(result.data);
      } else {
        setError(result?.message || 'Failed to fetch system events');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters.startDate, filters.endDate, filters.workspaceId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export async function initializeCalendar() {
  try {
    const result = await api.post<void>(
      '/api/calendar/initialize',
      {},
      { showSuccessToast: false }
    );

    if (!result?.success) {
      throw new Error(result?.message || 'Failed to initialize calendar');
    }

    return true;
  } catch (err) {
    console.error('Failed to initialize calendar:', err);
    return false;
  }
}

export async function recalculateAggregate(date: Date, workspaceId?: string) {
  try {
    const result = await api.post<void>(
      '/api/calendar/recalculate',
      { date, workspaceId },
      { showSuccessToast: false }
    );

    if (!result?.success) {
      throw new Error(result?.message || 'Failed to recalculate aggregate');
    }

    return true;
  } catch (err) {
    console.error('Failed to recalculate aggregate:', err);
    return false;
  }
}