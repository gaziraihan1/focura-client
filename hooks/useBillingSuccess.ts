// hooks/useBillingSuccess.ts
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWorkspaceSubscription } from '@/hooks/useBilling';
import { PLAN_META, GAINED_FEATURES } from '@/constants/billing.success.constants';
import { daysUntil, formatDate, getGainKey } from '@/utils/billing.success.utils';
import type { PlanName, SubscriptionDetail } from '@/types/billing.success.types';

export function useBillingSuccess(workspaceId: string, workspaceName: string, workspaceSlug: string) {
  const searchParams = useSearchParams();
  const { data: sub } = useWorkspaceSubscription(workspaceId);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const planName = (sub?.planName ?? searchParams.get('plan') ?? 'PRO') as PlanName;
  const prevPlan = (searchParams.get('from') ?? 'FREE') as PlanName;
  
  const meta = PLAN_META[planName] ?? PLAN_META.PRO;
  const prevMeta = PLAN_META[prevPlan] ?? PLAN_META.FREE;
  
  const gainKey = getGainKey(prevPlan, planName);
  const gainedFeatures = GAINED_FEATURES[gainKey] ?? GAINED_FEATURES['FREE→PRO'];

  const trialDays = sub?.trialEnd ? daysUntil(sub.trialEnd) : null;
  const isTrialing = sub?.status === 'TRIALING' && trialDays !== null && trialDays > 0;
  const periodEnd = sub?.currentPeriodEnd;
  const daysLeft = daysUntil(periodEnd);

  const billingCycle = sub?.billingCycle 
    ? sub.billingCycle.charAt(0) + sub.billingCycle.slice(1).toLowerCase() 
    : 'Monthly';

  const subscriptionDetails: SubscriptionDetail[] = useMemo(() => {
    const details: SubscriptionDetail[] = [
      { label: 'Workspace', value: workspaceName ?? workspaceSlug },
      { label: 'Plan', value: meta.label },
      { label: 'Billing cycle', value: billingCycle },
      {
        label: 'Period start',
        value: formatDate(
          sub?.currentPeriodEnd && daysLeft !== null
            ? new Date(
                new Date(sub.currentPeriodEnd).getTime() -
                  daysLeft * 86400000
              ).toISOString()
            : null
        ),
      },
      { label: 'Period end', value: formatDate(periodEnd) },
    ];

    if (isTrialing) {
      details.push({ label: 'Trial ends', value: formatDate(sub?.trialEnd) });
    }

    return details;
  }, [workspaceName, workspaceSlug, meta.label, billingCycle, sub, periodEnd, daysLeft, isTrialing]);

  return {
    visible,
    planName,
    prevPlan,
    meta,
    prevMeta,
    gainedFeatures,
    isTrialing,
    trialDays,
    daysLeft,
    billingCycle,
    subscriptionDetails,
    sub,
  };
}