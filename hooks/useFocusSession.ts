// hooks/useFocusSession.ts
"use client";

import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

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
  taskId?: string;
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

export function useFocusSession() {
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for active session on mount
  useEffect(() => {
    checkActiveSession();
  }, []);

  const checkActiveSession = async () => {
    try {
      const result = await api.get<FocusSession>('/api/focus-sessions/active', {
        showErrorToast: false,
      });
      
      if (result?.success && result.data) {
        setActiveSession(result.data);
      }
    } catch (error) {
      // Silently fail - no active session is normal
      console.debug('No active session', error);
    }
  };

  const startSession = async (
    taskId: string,
    duration: number = 25,
    type: FocusType = 'POMODORO'
  ) => {
    setLoading(true);
    try {
      const result = await api.post<FocusSession>(
        '/api/focus-sessions/start',
        {
          taskId,
          type,
          duration,
        },
        { showSuccessToast: true }
      );

      if (result?.success && result.data) {
        setActiveSession(result.data);
        return result.data;
      }
    } catch (error) {
      console.error('Failed to start focus session:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeSession = async () => {
    if (!activeSession) return;

    setLoading(true);
    try {
      await api.post(
        `/api/focus-sessions/${activeSession.id}/complete`,
        {},
        { showSuccessToast: true }
      );
      
      setActiveSession(null);
      toast.success('🎉 Focus session completed! Time added to calendar.');
    } catch (error) {
      console.error('Failed to complete focus session:', error);
      toast.error('Failed to complete session');
    } finally {
      setLoading(false);
    }
  };

  const cancelSession = async () => {
    if (!activeSession) return;

    setLoading(true);
    try {
      await api.post(
        `/api/focus-sessions/${activeSession.id}/cancel`,
        {},
        { showErrorToast: true }
      );
      
      setActiveSession(null);
    } catch (error) {
      console.error('Failed to cancel focus session:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    activeSession,
    loading,
    startSession,
    completeSession,
    cancelSession,
    checkActiveSession,
  };
}