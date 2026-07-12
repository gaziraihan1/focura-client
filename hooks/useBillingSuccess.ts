import { useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWorkspaceSubscription } from '@/hooks/useBilling';
import { useQueryClient } from '@tanstack/react-query';
import { billingKeys } from '@/hooks/useBilling';
import { PLAN_META, GAINED_FEATURES } from '@/constants/billing.success.constants';
import { daysUntil, formatDate, getGainKey } from '@/utils/billing.success.utils';
import type { PlanName, SubscriptionDetail } from '@/types/billing.success.types';
import type { WorkspaceSubscription } from '@/hooks/useBilling';

const UPGRADE_PLAN_KEY = 'focura:upgrade-plan';

export function useBillingSuccess(
  workspaceId: string,
  workspaceName: string,
  workspaceSlug: string,
) {
  const searchParams = useSearchParams();
  const qc = useQueryClient();
  // Poll until backend subscription confirms the purchased plan (webhook may be delayed)
  const urlPlan = searchParams.get('plan') as PlanName | null;
  const storedPlan = (typeof window !== 'undefined' ? sessionStorage.getItem(UPGRADE_PLAN_KEY) : null) as PlanName | null;
  const expectedPlan = (urlPlan ?? storedPlan ?? 'PRO') as PlanName;
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: sub } = useWorkspaceSubscription(workspaceId);

  // Manually poll until backend confirms the plan we paid for (max 2 min)
  useEffect(() => {
    if (!workspaceId) return;
    const POLL_TIMEOUT_MS = 120_000;
    const start = Date.now();
    const subKey = billingKeys.subscription(workspaceId);
    pollRef.current = setInterval(() => {
      if (Date.now() - start > POLL_TIMEOUT_MS) {
        if (pollRef.current) clearInterval(pollRef.current);
        return;
      }
      // Stop polling once backend data matches what we paid for
      const cached = qc.getQueryData(subKey) as WorkspaceSubscription | undefined;
      if (cached?.planName === expectedPlan) {
        if (pollRef.current) clearInterval(pollRef.current);
        return;
      }
      qc.refetchQueries({ queryKey: subKey });
    }, 2000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [qc, workspaceId, expectedPlan]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Invalidate billing queries on mount to get fresh subscription data
  useEffect(() => {
    qc.invalidateQueries({ queryKey: billingKeys.all(workspaceId) });
  }, [qc, workspaceId]);

  // Clear sessionStorage after reading
  useEffect(() => {
    if (storedPlan && typeof window !== 'undefined') {
      sessionStorage.removeItem(UPGRADE_PLAN_KEY);
    }
  }, [storedPlan]);

  // Derive planName: prefer URL/Storage param, fall back to API data
  const planName = (urlPlan ?? storedPlan ?? sub?.planName ?? 'PRO') as PlanName;

  const prevPlan = (searchParams.get('from') ?? 'FREE') as PlanName;

  const meta     = PLAN_META[planName]  ?? PLAN_META.PRO;
  const prevMeta = PLAN_META[prevPlan]  ?? PLAN_META.FREE;

  const gainKey       = getGainKey(prevPlan, planName);
  const gainedFeatures = GAINED_FEATURES[gainKey] ?? GAINED_FEATURES['FREE→PRO'];

  // Create a virtual subscription with the correct plan name for derived values
  // This ensures components using sub?.planName get the right value even if real sub is stale
  const virtualSub: WorkspaceSubscription | null = useMemo(() => {
    if (!sub) return null;
    return {
      ...sub,
      planName,
    };
  }, [sub, planName]);

  const trialDays = virtualSub?.trialEnd ? daysUntil(virtualSub.trialEnd) : null;
  const isTrialing = virtualSub?.status === 'TRIALING' && trialDays !== null && trialDays > 0;
  const periodEnd  = virtualSub?.currentPeriodEnd;
  const daysLeft   = daysUntil(periodEnd);

  const billingCycle = virtualSub?.billingCycle
    ? virtualSub.billingCycle.charAt(0) + virtualSub.billingCycle.slice(1).toLowerCase()
    : 'Monthly';

  const subscriptionDetails: SubscriptionDetail[] = useMemo(() => {
    const details: SubscriptionDetail[] = [
      { label: 'Workspace',     value: workspaceName ?? workspaceSlug },
      { label: 'Plan',          value: meta.label },
      { label: 'Billing cycle', value: billingCycle },
      {
        label: 'Period start',
        value: formatDate(
          virtualSub?.currentPeriodEnd && daysLeft !== null
            ? new Date(
                new Date(virtualSub.currentPeriodEnd).getTime() - daysLeft * 86_400_000,
              ).toISOString()
            : null,
        ),
      },
      { label: 'Period end', value: formatDate(periodEnd) },
    ];

    if (isTrialing) {
      details.push({ label: 'Trial ends', value: formatDate(virtualSub?.trialEnd) });
    }

    return details;
  }, [workspaceName, workspaceSlug, meta.label, billingCycle, virtualSub, periodEnd, daysLeft, isTrialing]);

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
    sub: virtualSub,
  };
}