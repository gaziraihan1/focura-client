import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/axios';
import type { UserCapacity, UserWorkSchedule } from '@/types/calendar.types';
import type { UpdateCapacityInput, UpdateScheduleInput } from '@/types/calendar.types';

export function useUserCapacity() {
  const [data, setData] = useState<UserCapacity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get<UserCapacity>('/api/v1/calendar/capacity', { showErrorToast: false });
      if (result?.success && result.data) {
        setData(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch capacity');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateCapacity = async (input: UpdateCapacityInput) => {
    const result = await api.put<UserCapacity>('/api/v1/calendar/capacity', input, { showSuccessToast: true });
    if (result?.success && result.data) {
      setData(result.data as any);
      return true;
    }
    return false;
  };

  return { data, loading, error, refetch: fetchData, updateCapacity };
}

export function useUserSchedule() {
  const [data, setData] = useState<UserWorkSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get<UserWorkSchedule>('/api/v1/calendar/schedule', { showErrorToast: false });
      if (result?.success && result.data) {
        setData(result.data as any);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateSchedule = async (input: UpdateScheduleInput) => {
    const result = await api.put<UserWorkSchedule>('/api/v1/calendar/schedule', input, { showSuccessToast: true });
    if (result?.success && result.data) {
      setData(result.data as any);
      return true;
    }
    return false;
  };

  return { data, loading, error, refetch: fetchData, updateSchedule };
}
