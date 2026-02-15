// utils/calendar.utils.ts
import { BurnoutRisk } from '@/types/calendar.types';

export function getWorkloadColor(score: number, overCapacity: boolean): string {
  if (overCapacity) return 'bg-red-500/20 border-red-500/30';
  if (score > 1.2) return 'bg-amber-500/20 border-amber-500/30';
  if (score > 0.8) return 'bg-yellow-500/20 border-yellow-500/30';
  if (score > 0.3) return 'bg-blue-500/10 border-blue-500/20';
  return 'bg-background';
}

export function getBurnoutColor(risk: BurnoutRisk): string {
  switch (risk) {
    case 'CRITICAL':
      return 'text-red-600 dark:text-red-400';
    case 'HIGH':
      return 'text-orange-600 dark:text-orange-400';
    case 'MODERATE':
      return 'text-yellow-600 dark:text-yellow-400';
    default:
      return 'text-green-600 dark:text-green-400';
  }
}

export function getWorkloadBarColor(
  overCapacity: boolean,
  workloadScore: number
): string {
  if (overCapacity) return 'bg-gradient-to-r from-red-500 to-red-600';
  if (workloadScore > 0.8) return 'bg-gradient-to-r from-amber-500 to-amber-600';
  return 'bg-gradient-to-r from-blue-500 to-blue-600';
}

// ✅ Additional helper functions
export function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}