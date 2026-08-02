import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/axios';
import type { BurnoutTrend, WellnessRecommendation } from '@/types/calendar.types';

export function useBurnoutTrends(weeks = 12) {
  const [data, setData] = useState<BurnoutTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get<BurnoutTrend[]>(
        `/api/v1/calendar/burnout-trends?weeks=${weeks}`,
        { showErrorToast: false }
      );
      if (result?.success && result.data) {
        setData(result.data);
      } else {
        setError('Failed to load burnout trends');
      }
    } catch {
      setError('Unable to fetch burnout trends. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [weeks]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useRecommendations() {
  const [data, setData] = useState<WellnessRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get<WellnessRecommendation[]>('/api/v1/calendar/recommendations', { showErrorToast: false });
      if (result?.success && result.data) {
        setData(result.data);
      } else {
        setError('No recommendations available');
      }
    } catch {
      setError('Unable to load recommendations. Please try again.');
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

  const dismissAll = async (): Promise<number> => {
    try {
      const result = await api.post<{ dismissedCount: number }>('/api/v1/calendar/recommendations/dismiss-all', {});
      if (result?.success) {
        setData([]);
        return result.data?.dismissedCount ?? 0;
      }
      return 0;
    } catch {
      return 0;
    }
  };

  return { data, loading, error, refetch: fetchData, dismiss, dismissAll };
}
