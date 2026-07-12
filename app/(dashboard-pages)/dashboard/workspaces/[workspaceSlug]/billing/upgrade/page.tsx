"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useWorkspaceUpgrade } from "@/hooks/useWorkspaceUpgrade";
import { useQueryClient } from "@tanstack/react-query";
import { billingKeys } from "@/hooks/useBilling";
import { calculateYearlyDiscount } from "@/utils/billing.upgrade.utils";
import { PLANS } from "@/constants/billing.upgrade.constants";
import { LoadingPlanInfo } from "@/components/Dashboard/Workspaces/billing/Upgrade/LoadingPlanInfo";
import { UpgradePageHeader } from "@/components/Dashboard/Workspaces/billing/Upgrade/UpgradePageHeader";
import { UpgradeCycleToggle } from "@/components/Dashboard/Workspaces/billing/Upgrade/UpgradeCycleToggle";
import { UpgradePlanCard } from "@/components/Dashboard/Workspaces/billing/Upgrade/UpgradePlanCard";
import { UpgradePageFooter } from "@/components/Dashboard/Workspaces/billing/Upgrade/UpgradePageFooter";

export default function WorkspaceUpgradePage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: workspace } = useWorkspace(workspaceSlug);
  const workspaceId = workspace?.id as string;
  const router = useRouter();
  const qc = useQueryClient();

  // Invalidate billing queries on mount to get fresh subscription data
  useEffect(() => {
    qc.invalidateQueries({ queryKey: billingKeys.all(workspaceId) });
  }, [qc, workspaceId]);

  const {
    cycle,
    setCycle,
    currentPlan,
    hasActiveSub,
    isLoading,
    isPending,
    handleSelect,
  } = useWorkspaceUpgrade(workspaceId, workspaceSlug);

  const discount = calculateYearlyDiscount(
    PLANS[1].price.monthly,
    PLANS[1].price.yearly,
  );

  if (isPending) {
    return <LoadingPlanInfo />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <UpgradePageHeader onBack={() => router.back()} />

        <UpgradeCycleToggle
          cycle={cycle}
          discount={discount}
          onCycleChange={setCycle}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan) => (
            <UpgradePlanCard
              key={plan.name}
              plan={plan}
              cycle={cycle}
              currentPlan={currentPlan}
              hasActiveSub={hasActiveSub}
              isLoading={isLoading}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <UpgradePageFooter />
      </div>
    </div>
  );
}
