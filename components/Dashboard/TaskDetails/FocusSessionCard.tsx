"use client";

import { useState, useEffect } from "react";
import { Play, Clock, Zap, CheckCircle2 } from "lucide-react";
import { useFocusSession } from "@/hooks/useFocusSession";

interface FocusSessionCardProps {
  taskId: string;
}

export function FocusSessionCard({ taskId }: FocusSessionCardProps) {
  const {
    activeSession,
    loading,
    startSession,
    completeSession,
    cancelSession,
  } = useFocusSession();

  // Calculate time remaining - derived state approach
  const calculateTimeRemaining = () => {
    if (!activeSession || activeSession.taskId !== taskId) {
      return 0;
    }

    const startTime = new Date(activeSession.startedAt).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000); // seconds
    const remaining = Math.max(0, activeSession.duration * 60 - elapsed);
    return remaining;
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining);

  // Update timer and handle auto-complete
  useEffect(() => {
    if (!activeSession || activeSession.taskId !== taskId) {
      return;
    }

    const updateTimer = () => {
      const startTime = new Date(activeSession.startedAt).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000); // seconds
      const remaining = Math.max(0, activeSession.duration * 60 - elapsed);
      setTimeRemaining(remaining);

      // Auto-complete when time runs out
      if (remaining === 0 && !activeSession.completed) {
        completeSession();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [activeSession, taskId, completeSession]);

  const isActiveForThisTask = activeSession?.taskId === taskId && !activeSession.completed;

  const handleStart = async (duration: number, type: 'POMODORO' | 'DEEP_WORK') => {
    await startSession(taskId, duration, type);
  };

  const handleComplete = async () => {
    await completeSession();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    if (!activeSession) return 0;
    const totalSeconds = activeSession.duration * 60;
    const elapsed = totalSeconds - timeRemaining;
    return (elapsed / totalSeconds) * 100;
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold">Focus Session</h3>
          <p className="text-xs text-muted-foreground">
            Deep work mode for this task
          </p>
        </div>
      </div>

      {!isActiveForThisTask ? (
        <div className="space-y-3">
          {/* Quick start buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleStart(25, 'POMODORO')}
              disabled={loading || !!activeSession}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              <div className="text-left">
                <div className="text-sm font-semibold">Pomodoro</div>
                <div className="text-xs opacity-75">25 min</div>
              </div>
            </button>

            <button
              onClick={() => handleStart(60, 'DEEP_WORK')}
              disabled={loading || !!activeSession}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Clock className="w-4 h-4" />
              <div className="text-left">
                <div className="text-sm font-semibold">Deep Work</div>
                <div className="text-xs opacity-75">60 min</div>
              </div>
            </button>
          </div>

          {activeSession && activeSession.taskId !== taskId && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>You have an active session on another task</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Timer display */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 tabular-nums">
              {formatTime(timeRemaining)}
            </div>
            <p className="text-sm text-muted-foreground">
              {activeSession.type === 'POMODORO' ? 'Pomodoro' : 'Deep Work'} in progress
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleComplete}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/20 font-medium transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Session
            </button>

            <button
              onClick={cancelSession}
              disabled={loading}
              className="px-4 py-2.5 rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>

          {/* Tips */}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              💡 Tip: Completing this session will add {activeSession.duration} minutes to your calendar&#39;s focus time
            </p>
          </div>
        </div>
      )}
    </div>
  );
}