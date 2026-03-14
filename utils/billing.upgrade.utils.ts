// utils/workspace-upgrade.util.ts
import type { BillingCycle } from '@/types/billing.upgrade.types';

export function formatPrice(cents: number, cycle: BillingCycle): string {
  if (cents === 0) return '$0';
  const perMonth = cycle === 'yearly' ? Math.round(cents / 12) : cents;
  return `$${(perMonth / 100).toFixed(0)}`;
}

export function calculateYearlyDiscount(
  monthlyPrice: number,
  yearlyPrice: number
): number {
  if (!monthlyPrice || !yearlyPrice) return 0;
  return Math.round(100 - (yearlyPrice / (monthlyPrice * 12)) * 100);
}

export function formatCents(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
    new Date(date)
  );
}

export function getInvoiceBadgeClass(status: string): string {
  const INVOICE_STATUS_STYLES: Record<string, string> = {
    PAID: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    OPEN: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
    VOID: 'bg-muted text-muted-foreground',
    UNCOLLECTIBLE: 'bg-destructive/10 text-destructive',
    DRAFT: 'bg-muted text-muted-foreground',
  };
  return INVOICE_STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground';
}