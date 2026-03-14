// components/WorkspaceBilling/PlanCard.tsx
import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, CreditCard, ExternalLink } from 'lucide-react';
import { PLAN_META } from '@/constants/billing.upgrade.constants';
import { formatDate } from '@/utils/billing.upgrade.utils';
import { BillingCancelConfirmation } from './BillingCancelConfirmation';
import type { PlanCardProps } from '@/types/billing.upgrade.types';
import { BillingStatusBadge } from './BillingStatusBadge';
import { useParams } from 'next/navigation';

export function BillingPlanCard({
  sub,
  onPortal,
  portalPending,
  onCancel,
  cancelPending,
  onReactivate,
  reactivatePending,
}: PlanCardProps) {
  const params = useParams();
  const workspaceSlug = params.workspaceSlug as string;
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const isFree = !sub || sub.planName === 'FREE';
  const meta = PLAN_META[sub?.planName ?? 'FREE'];
  const Icon = meta.icon;

  const handleCancelConfirm = () => {
    onCancel();
    setCancelConfirm(false);
  };

  return (
    <section className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Current plan</h2>
        <Link
          href={`/dashboard/workspaces/${workspaceSlug}/billing/upgrade`}
          className="inline-flex items-center gap-1 text-sm text-primary hover:opacity-80 font-medium transition-opacity"
        >
          {isFree ? 'Upgrade' : 'Change plan'}
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Plan + status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-foreground text-lg">
                {meta.label}
              </span>
              {sub && !isFree && <BillingStatusBadge status={sub.status} />}
            </div>
            {sub?.billingCycle && !isFree && (
              <p className="text-xs text-muted-foreground capitalize mt-0.5">
                {sub.billingCycle.toLowerCase()} billing
              </p>
            )}
          </div>
        </div>

        {/* Period info */}
        {sub && !isFree && (
          <div className="rounded-xl bg-muted px-4 py-3 text-sm space-y-1">
            {sub.cancelAtPeriodEnd ? (
              <p className="text-destructive font-medium">
                ⚠ Cancels on {formatDate(sub.currentPeriodEnd)} — workspace
                reverts to Free
              </p>
            ) : (
              <p className="text-muted-foreground">
                Next billing:{' '}
                <span className="font-medium text-foreground">
                  {formatDate(sub.currentPeriodEnd)}
                </span>
              </p>
            )}
            {sub.trialEnd && new Date(sub.trialEnd) > new Date() && (
              <p className="text-blue-600 dark:text-blue-400 font-medium">
                Trial ends {formatDate(sub.trialEnd)} — add a payment method to
                continue
              </p>
            )}
          </div>
        )}

        {/* Free plan message */}
        {isFree && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            This workspace is on the Free plan. Upgrade to unlock more members,
            storage, meetings, and analytics.
          </p>
        )}

        {/* Actions */}
        {!isFree && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onPortal}
              disabled={portalPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              {portalPending ? 'Opening…' : 'Manage payment'}
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </button>

            {!sub?.cancelAtPeriodEnd && (
              <button
                onClick={() => setCancelConfirm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors"
              >
                Cancel plan
              </button>
            )}

            {sub?.cancelAtPeriodEnd && (
              <button
                onClick={onReactivate}
                disabled={reactivatePending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
              >
                {reactivatePending
                  ? 'Reactivating…'
                  : 'Keep subscription active'}
              </button>
            )}
          </div>
        )}

        {/* Cancel confirmation */}
        {cancelConfirm && (
          <BillingCancelConfirmation
            onConfirm={handleCancelConfirm}
            onCancel={() => setCancelConfirm(false)}
            isLoading={cancelPending}
          />
        )}
      </div>
    </section>
  );
}