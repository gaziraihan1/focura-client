'use client';

import { useParams } from 'next/navigation';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useWorkspaceBilling } from '@/hooks/useWorkspaceUpgrade';
import { InvoiceTableSkeleton, PlanCardSkeleton } from '@/components/Dashboard/Workspaces/billing/Billing/BillingLoadingSkeleton';
import { BillingPlanCard } from '@/components/Dashboard/Workspaces/billing/Billing/BillingPlanCard';
import { BillingInvoiceTable } from '@/components/Dashboard/Workspaces/billing/Billing/BillingInvoiceTable';

export default function WorkspaceBillingPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: workspace } = useWorkspace(workspaceSlug);
  const workspaceId = workspace?.id as string;

  const {
    sub,
    invoices,
    subLoading,
    invoicesLoading,
    portalPending,
    cancelPending,
    reactivatePending,
    handleOpenPortal,
    handleCancelSubscription,
    handleReactivateSubscription,
  } = useWorkspaceBilling(workspaceId);
  console.log(sub, invoices)

  console.log('workspaceId:', workspaceId)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage this workspace&apos;s plan and invoices
        </p>
      </div>

      {subLoading ? (
        <PlanCardSkeleton />
      ) : (
        <BillingPlanCard
          sub={sub}
          workspaceId={workspaceId}
          onPortal={handleOpenPortal}
          portalPending={portalPending}
          onCancel={handleCancelSubscription}
          cancelPending={cancelPending}
          onReactivate={handleReactivateSubscription}
          reactivatePending={reactivatePending}
        />
      )}

      <section className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="font-semibold text-foreground">Billing history</h2>
        </div>

        {invoicesLoading ? (
          <InvoiceTableSkeleton />
        ) : (
          <BillingInvoiceTable invoices={invoices} />
        )}
      </section>

      <p className="text-center text-xs text-muted-foreground pb-4">
        Payments processed by Stripe · This plan only applies to this workspace
      </p>
    </div>
  );
}