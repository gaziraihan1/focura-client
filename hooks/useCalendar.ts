import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type {
  CalendarDayAggregate,
  CalendarInsights,
  GoalCheckpoint,
  SystemCalendarEvent,
  CalendarFilters,
  CreateGoalCheckpointInput,
} from '@/types/calendar.types';

export const calendarKeys = {
  all: ['calendar'] as const,
  aggregates: (filters: CalendarFilters) =>
    [...calendarKeys.all, 'aggregates', filters.startDate.toISOString(), filters.endDate.toISOString(), filters.workspaceId] as const,
  insights: (filters: CalendarFilters) =>
    [...calendarKeys.all, 'insights', filters.startDate.toISOString(), filters.endDate.toISOString(), filters.workspaceId] as const,
  goals: (filters: CalendarFilters) =>
    [...calendarKeys.all, 'goals', filters.startDate.toISOString(), filters.endDate.toISOString(), filters.workspaceId] as const,
  systemEvents: (filters: CalendarFilters) =>
    [...calendarKeys.all, 'systemEvents', filters.startDate.toISOString(), filters.endDate.toISOString(), filters.workspaceId] as const,
};

export function useCalendarAggregates(filters: CalendarFilters) {
  return useQuery({
    queryKey: calendarKeys.aggregates(filters),
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: filters.startDate.toISOString(),
        endDate: filters.endDate.toISOString(),
        ...(filters.workspaceId && { workspaceId: filters.workspaceId }),
      });

      const result = await api.get<CalendarDayAggregate[]>(
        `/api/v1/calendar/aggregates?${params}`,
        { showErrorToast: false }
      );

      return result?.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCalendarInsights(filters: CalendarFilters) {
  return useQuery({
    queryKey: calendarKeys.insights(filters),
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: filters.startDate.toISOString(),
        endDate: filters.endDate.toISOString(),
        ...(filters.workspaceId && { workspaceId: filters.workspaceId }),
      });

      const result = await api.get<CalendarInsights>(
        `/api/v1/calendar/insights?${params}`,
        { showErrorToast: false }
      );

      return result?.data ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useGoalCheckpoints(filters: CalendarFilters) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: calendarKeys.goals(filters),
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: filters.startDate.toISOString(),
        endDate: filters.endDate.toISOString(),
        ...(filters.workspaceId && { workspaceId: filters.workspaceId }),
      });

      const result = await api.get<GoalCheckpoint[]>(
        `/api/v1/calendar/goals?${params}`,
        { showErrorToast: false }
      );

      return result?.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createGoalMutation = useMutation({
    mutationFn: async (input: CreateGoalCheckpointInput) => {
      const result = await api.post<GoalCheckpoint>(
        '/api/v1/calendar/goals',
        input,
        { showSuccessToast: true }
      );
      return result?.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: calendarKeys.goals(filters) });
    },
  });

  return {
    ...query,
    createGoal: createGoalMutation.mutateAsync,
    isCreating: createGoalMutation.isPending,
  };
}

export function useSystemEvents(filters: CalendarFilters) {
  return useQuery({
    queryKey: calendarKeys.systemEvents(filters),
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: filters.startDate.toISOString(),
        endDate: filters.endDate.toISOString(),
        ...(filters.workspaceId && { workspaceId: filters.workspaceId }),
      });

      const result = await api.get<SystemCalendarEvent[]>(
        `/api/v1/calendar/system-events?${params}`,
        { showErrorToast: false }
      );

      return result?.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useInitializeCalendar() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await api.post<void>(
        '/api/v1/calendar/initialize',
        {},
        { showSuccessToast: false }
      );
      return result?.success;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: calendarKeys.all });
    },
  });
}

export function useRecalculateAggregate(filters: CalendarFilters) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, workspaceId }: { date: Date; workspaceId?: string }) => {
      const result = await api.post<void>(
        '/api/v1/calendar/recalculate',
        { date, workspaceId },
        { showSuccessToast: false }
      );
      return result?.success;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: calendarKeys.aggregates(filters) });
    },
  });
}
