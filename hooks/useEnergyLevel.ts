import { useState, useEffect, useCallback } from 'react';
import { api, type ApiResponse } from '@/lib/axios';
import type { EnergyLevel, LogEnergyInput, PaginationMeta } from '@/types/calendar.types';

export function useEnergyLevel(date: Date) {
  const [data, setData] = useState<EnergyLevel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dateStr = date.toISOString().split('T')[0];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get<EnergyLevel>(
        `/api/v1/calendar/energy?date=${dateStr}`,
        { showErrorToast: false }
      );
      if (result?.success) {
        setData(result.data ?? null);
      } else {
        setError('Failed to load energy level');
      }
    } catch {
      setError('Unable to fetch energy level. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [dateStr]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const logEnergy = async (input: LogEnergyInput): Promise<boolean> => {
    try {
      const result = await api.post<EnergyLevel>('/api/v1/calendar/energy', input, { showSuccessToast: true });
      if (result?.success && result.data) {
        setData(result.data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return { data, loading, error, refetch: fetchData, logEnergy };
}

export function useEnergyHistory(startDate: Date, endDate: Date, page = 1, limit = 31) {
  const [data, setData] = useState<EnergyLevel[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = new URLSearchParams({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    page: String(page),
    limit: String(limit),
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend returns pagination at the envelope level, so extend the response type.
      const result = (await api.get<EnergyLevel[]>(
        `/api/v1/calendar/energy/history?${params}`,
        { showErrorToast: false }
      )) as (ApiResponse<EnergyLevel[]> & { pagination?: PaginationMeta }) | undefined;
      if (result?.success) {
        setData(result.data ?? []);
        setPagination(result.pagination ?? null);
      } else {
        setError('Failed to load energy history');
      }
    } catch {
      setData([]);
      setError('Unable to fetch energy history. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [params.toString()]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, pagination, loading, error, refetch: fetchData };
}
