import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/axios';
import type { EnergyLevel, LogEnergyInput, PaginationMeta } from '@/types/calendar.types';

export function useEnergyLevel(date: Date) {
  const [data, setData] = useState<EnergyLevel | null>(null);
  const [loading, setLoading] = useState(true);

  const dateStr = date.toISOString().split('T')[0];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.get<EnergyLevel>(
        `/api/v1/calendar/energy?date=${dateStr}`,
        { showErrorToast: false }
      );
      if (result?.success) {
        setData(result.data ?? null);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [dateStr]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const logEnergy = async (input: LogEnergyInput) => {
    const result = await api.post<EnergyLevel>('/api/v1/calendar/energy', input, { showSuccessToast: true });
    if (result?.success && result.data) {
      setData(result.data as any);
      return true;
    }
    return false;
  };

  return { data, loading, refetch: fetchData, logEnergy };
}

export function useEnergyHistory(startDate: Date, endDate: Date, page = 1, limit = 31) {
  const [data, setData] = useState<EnergyLevel[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    page: String(page),
    limit: String(limit),
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result: any = await api.get<EnergyLevel[]>(
        `/api/v1/calendar/energy/history?${params}`,
        { showErrorToast: false }
      );
      if (result?.success) {
        setData(result.data ?? []);
        setPagination(result.pagination ?? null);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [params.toString()]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, pagination, loading, refetch: fetchData };
}
