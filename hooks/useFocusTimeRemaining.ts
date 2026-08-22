"use client";

import { useSyncExternalStore } from "react";
import { FocusSession } from "./useFocusSession";

let timeRemaining = 0;
const listeners = new Set<() => void>();
let intervalId: ReturnType<typeof setInterval> | null = null;
let onExpire: (() => void) | null = null;
let activeSessionId: string | null = null;
let expiredForSession: string | null = null;

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): number {
  return timeRemaining;
}

function getServerSnapshot(): number {
  return 0;
}

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

function computeRemaining(session: FocusSession): number {
  const startedAt = new Date(session.startedAt).getTime();
  const elapsed = Math.floor((Date.now() - startedAt) / 1000);
  return Math.max(0, session.duration * 60 - elapsed);
}

function stopTicker(): void {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  activeSessionId = null;
  onExpire = null;
}

/**
 * Keeps the module-level countdown in sync with the active focus session.
 * Runs a single shared 1s ticker regardless of how many components
 * subscribe via `useFocusTimeRemaining`, and fires `handleExpire` at most
 * once per session when the countdown reaches zero.
 */
export function syncFocusTimer(
  session: FocusSession | null,
  handleExpire?: () => void
): void {
  if (!session || !session.taskId) {
    stopTicker();
    expiredForSession = null;
    setSeconds(0);
    return;
  }

  onExpire = handleExpire ?? null;

  if (intervalId !== null && activeSessionId === session.id) {
    return;
  }

  stopTicker();
  activeSessionId = session.id;
  expiredForSession = null;
  setSeconds(computeRemaining(session));

  intervalId = setInterval(() => {
    const remaining = computeRemaining(session);
    setSeconds(remaining);

    if (remaining === 0 && expiredForSession !== session.id) {
      expiredForSession = session.id;
      stopTicker();
      const callback = onExpire;
      onExpire = null;
      callback?.();
    }
  }, 1000);
}

function setSeconds(seconds: number): void {
  if (seconds !== timeRemaining) {
    timeRemaining = seconds;
    notify();
  }
}

/**
 * Subscribes to the shared focus countdown. Re-renders only the calling
 * component once per second while a focus session is active.
 */
export function useFocusTimeRemaining(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
