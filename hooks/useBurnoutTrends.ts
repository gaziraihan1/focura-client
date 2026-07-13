import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/axios';
import type { BurnoutTrend } from '@/types/calendar.types';

export function useBurnoutTrends(weeks = 12) {
  const [data, setData] = useState<BurnoutTrend[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.get<BurnoutTrend[]>(
        `/api/v1/calendar/burnout-trends?weeks=${weeks}`,
        { showErrorToast: false }
      );
      if (result?.success && result.data) {
        setData(result.data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [weeks]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, refetch: fetchData };
}

export function useRecommendations() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.get<any[]>('/api/v1/calendar/recommendations', { showErrorToast: false });
      if (result?.success && result.data) {
        setData(result.data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const dismiss = async (id: string) => {
    const result = await api.patch(`/api/v1/calendar/recommendations/${id}/dismiss`, {});
    if (result?.success) {
      setData(prev => prev.filter(r => r.id !== id));
      return true;
    }
    return false;
  };

  return { data, loading, refetch: fetchData, dismiss };
}
