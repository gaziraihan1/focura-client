"use client";

import { useWorkspace } from "@/hooks/useWorkspace";
import { useBillingSuccess } from "@/hooks/useBillingSuccess";
import { BillingSuccessHeader } from "@/components/Dashboard/Workspaces/billing/Success/BillingSuccessHeader";
import { SuccessPlanCard } from "@/components/Dashboard/Workspaces/billing/Success/SuccessPlanCard";
import { FeaturesGained } from "@/components/Dashboard/Workspaces/billing/Success/FeaturesGained";
import { ActionButtons } from "@/components/Dashboard/Workspaces/billing/Success/ActionButtons";
import { SubscriptionDetails } from "@/components/Dashboard/Workspaces/billing/Success/SubscriptionDetails";

interface BillingSuccessPageContentProps {
  workspaceSlug: string;
}

export function BillingSuccessPageContent({ workspaceSlug }: BillingSuccessPageContentProps) {
  const { data: workspace } = useWorkspace(workspaceSlug);
  const workspaceId = workspace?.id ?? "";

  const {
    visible,
    planName,
    meta,
    prevMeta,
    gainedFeatures,
    isTrialing,
    trialDays,
    daysLeft,
    billingCycle,
    subscriptionDetails,
    sub,
  } = useBillingSuccess(
    workspaceId,
    workspace?.name ?? workspaceSlug,
    workspaceSlug,
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <BillingSuccessHeader
          planLabel={meta.label}
          workspaceName={workspace?.name ?? workspaceSlug}
          isTrialing={isTrialing}
          trialDays={trialDays}
          visible={visible}
        />

        <SuccessPlanCard
          meta={meta}
          isTrialing={isTrialing}
          trialDays={trialDays}
          daysLeft={daysLeft}
          billingCycle={billingCycle}
          trialEnd={sub?.trialEnd}
          periodEnd={sub?.currentPeriodEnd}
          visible={visible}
        />

        <FeaturesGained
          features={gainedFeatures}
          fromPlanLabel={prevMeta.label}
          toPlanLabel={meta.label}
          visible={visible}
        />

        <SubscriptionDetails details={subscriptionDetails} visible={visible} />

        <ActionButtons
          workspaceSlug={workspaceSlug}
          planName={planName}
          visible={visible}
        />

        <p className="text-center text-xs text-muted-foreground mt-8">
          A receipt has been sent to your email · Payments processed securely
        </p>
      </div>
    </div>
  );
}
