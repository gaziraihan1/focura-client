// components/BillingSuccess/PlanCard.tsx
import { CalendarDays, CreditCard, CheckCircle2 } from 'lucide-react';
import { Counter } from './Counter';
import { formatDate } from '@/utils/billing.success.utils';
import type { PlanMeta } from '@/types/billing.success.types';

interface PlanCardProps {
  meta: PlanMeta;
  isTrialing: boolean;
  trialDays: number | null;
  daysLeft: number | null;
  billingCycle: string;
  trialEnd: string | null | undefined;
  periodEnd: string | null | undefined;
  visible: boolean;
}

export function SuccessPlanCard({
  meta,
  isTrialing,
  trialDays,
  daysLeft,
  billingCycle,
  trialEnd,
  periodEnd,
  visible,
}: PlanCardProps) {
  const PlanIcon = meta.icon;

  return (
    <div
      className={`rounded-2xl border ${meta.borderColor} bg-card mb-5 overflow-hidden transition-all duration-700 delay-100 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          {PlanIcon && (
            <div
              className={`w-9 h-9 rounded-xl ${meta.bgColor} flex items-center justify-center`}
            >
              <PlanIcon className={`w-4.5 h-4.5 ${meta.color}`} />
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground">Active plan</p>
            <p className="font-bold text-foreground text-lg leading-tight">
              {meta.label}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Status</p>
          <p
            className={`text-sm font-semibold ${
              isTrialing
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-green-600 dark:text-green-400'
            }`}
          >
            {isTrialing ? 'Trial active' : 'Active'}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-border">
        {/* Days remaining */}
        <div className="px-5 py-4 text-center">
          <CalendarDays className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">
            {isTrialing && trialDays !== null ? (
              <Counter to={trialDays} />
            ) : daysLeft !== null ? (
              <Counter to={daysLeft} />
            ) : (
              '—'
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isTrialing ? 'trial days' : 'days left'}
          </p>
        </div>

        {/* Billing cycle */}
        <div className="px-5 py-4 text-center">
          <CreditCard className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground capitalize">
            {billingCycle}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            billing cycle
          </p>
        </div>

        {/* Next renewal */}
        <div className="px-5 py-4 text-center">
          <CheckCircle2 className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
          <p className="text-sm font-bold text-foreground leading-tight">
            {formatDate(isTrialing ? trialEnd : periodEnd)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isTrialing ? 'trial ends' : 'renews on'}
          </p>
        </div>
      </div>

      {/* Trial banner */}
      {isTrialing && trialDays !== null && (
        <div className="mx-5 mb-5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-3 text-sm text-blue-700 dark:text-blue-300">
          🎉 You&apos;re on a{' '}
          <span className="font-semibold">{trialDays}-day free trial</span>. No
          charge until {formatDate(trialEnd)} — cancel anytime before then.
        </div>
      )}
    </div>
  );
}