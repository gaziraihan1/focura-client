// hooks/useFocusSession.ts
"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

export type FocusType = 'POMODORO' | 'SHORT_BREAK' | 'LONG_BREAK' | 'DEEP_WORK' | 'CUSTOM';

export interface FocusSession {
  id: string;
  userId: string;
  taskId: string | null;
  duration: number; // in minutes
  type: FocusType;
  completed: boolean;
  startedAt: string;
  endedAt: string | null;
  task?: {
    id: string;
    title: string;
    description?: string;
  };
}

export interface StartFocusSessionInput {
  taskId: string;
  type: FocusType;
  duration: number; // in minutes
}

export interface FocusSessionStats {
  totalSessions: number;
  totalMinutes: number;
  completedToday: number;
  averageSessionLength: number;
  focusStreak: number; // consecutive days with focus sessions
}

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const focusSessionKeys = {
  all: ['focus-sessions'] as const,
  active: () => [...focusSessionKeys.all, 'active'] as const,
  stats: () => [...focusSessionKeys.all, 'stats'] as const,
  lists: () => [...focusSessionKeys.all, 'list'] as const,
  detail: (id: string) => [...focusSessionKeys.all, 'detail', id] as const,
};

// ─── Fetchers ─────────────────────────────────────────────────────────────────

const fetchActiveSession = async (): Promise<FocusSession | null> => {
  const result = await api.get<FocusSession>('/api/v1/focus-sessions/active', {
    showErrorToast: false,
  });
  return result?.success ? (result.data ?? null) : null;
};

const fetchFocusSessionStats = async (): Promise<FocusSessionStats> => {
  const result = await api.get<FocusSessionStats>('/api/v1/focus-sessions/stats');
  if (!result?.success || !result.data) {
    throw new Error('Failed to fetch focus session stats');
  }
  return result.data;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFocusSession() {
  const qc = useQueryClient();

  // Active session — polling every 30s to stay in sync across tabs
  const {
    data: activeSession = null,
    isLoading: isLoadingActive,
  } = useQuery({
    queryKey: focusSessionKeys.active(),
    queryFn: fetchActiveSession,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  // ── Start session ──────────────────────────────────────────────────────────

  const { mutate: startSession, isPending: isStarting } = useMutation({
    mutationFn: async ({
      taskId,
      duration = 25,
      type = 'POMODORO',
    }: {
      taskId: string;
      duration?: number;
      type?: FocusType;
    }) => {
      const result = await api.post<FocusSession>(
        '/api/v1/focus-sessions/start',
        { taskId, type, duration },
        { showSuccessToast: true }
      );
      if (!result?.success || !result.data) {
        throw new Error('Failed to start focus session');
      }
      return result.data;
    },
    onSuccess: (newSession) => {
      qc.setQueryData<FocusSession | null>(
        focusSessionKeys.active(),
        newSession
      );
    },
    onError: () => {
      // Invalidate so the query re-fetches the real server state
      qc.invalidateQueries({ queryKey: focusSessionKeys.active() });
    },
  });

  // ── Complete session ───────────────────────────────────────────────────────

  const { mutate: completeSession, isPending: isCompleting } = useMutation({
    mutationFn: async () => {
      if (!activeSession) throw new Error('No active session to complete');
      // Guard against double completion (e.g. timer + manual click, or poll refetch)
      if (activeSession.completed) return;
      await api.post(
        `/api/v1/focus-sessions/${activeSession.id}/complete`,
        {},
        { showSuccessToast: false } // We show a custom toast below
      );
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: focusSessionKeys.active() });
      const previous = qc.getQueryData<FocusSession | null>(
        focusSessionKeys.active()
      );
      // Optimistically clear the active session
      qc.setQueryData<FocusSession | null>(focusSessionKeys.active(), null);
      return { previous };
    },
    onSuccess: () => {
      toast.success('🎉 Focus session completed! Time added to calendar.');
      // Invalidate stats so they refresh with the new completed session
      qc.invalidateQueries({ queryKey: focusSessionKeys.stats() });
    },
    onError: (_error, _vars, context) => {
      // Roll back optimistic clear on failure
      if (context?.previous !== undefined) {
        qc.setQueryData(focusSessionKeys.active(), context.previous);
      }
      toast.error('Failed to complete session');
    },
  });

  // ── Cancel session ─────────────────────────────────────────────────────────

  const { mutate: cancelSession, isPending: isCancelling } = useMutation({
    mutationFn: async () => {
      if (!activeSession) throw new Error('No active session to cancel');
      await api.post(
        `/api/v1/focus-sessions/${activeSession.id}/cancel`,
        {},
        { showErrorToast: true }
      );
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: focusSessionKeys.active() });
      const previous = qc.getQueryData<FocusSession | null>(
        focusSessionKeys.active()
      );
      qc.setQueryData<FocusSession | null>(focusSessionKeys.active(), null);
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous !== undefined) {
        qc.setQueryData(focusSessionKeys.active(), context.previous);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: focusSessionKeys.stats() });
    },
  });

  return {
    // State
    activeSession,
    isLoading: isLoadingActive,
    isMutating: isStarting || isCompleting || isCancelling,

    // Granular loading flags (useful for button states)
    isStarting,
    isCompleting,
    isCancelling,

    // Actions
    startSession,
    completeSession,
    cancelSession,

    // Manual refetch escape hatch (matches checkActiveSession usage)
    refetchActiveSession: () =>
      qc.invalidateQueries({ queryKey: focusSessionKeys.active() }),
  };
}

// ─── Stats Hook (separate concern) ───────────────────────────────────────────

export function useFocusSessionStats() {
  return useQuery({
    queryKey: focusSessionKeys.stats(),
    queryFn: fetchFocusSessionStats,
    staleTime: 60_000, // Stats are less time-sensitive
  });
}