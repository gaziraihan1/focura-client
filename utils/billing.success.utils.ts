// utils/billing-success.util.ts

import { formatDateLong } from '@/utils/date.utils';

export function daysUntil(date: string | null | undefined): number | null {
  if (!date) return null;
  const diff = new Date(date).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function formatDate(date: string | null | undefined): string {
  return formatDateLong(date);
}

export function getGainKey(fromPlan: string, toPlan: string): string {
  return `${fromPlan}→${toPlan}`;
}