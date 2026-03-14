// utils/billing-success.util.ts

export function daysUntil(date: string | null | undefined): number | null {
  if (!date) return null;
  const diff = new Date(date).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(
    new Date(date)
  );
}

export function getGainKey(fromPlan: string, toPlan: string): string {
  return `${fromPlan}→${toPlan}`;
}