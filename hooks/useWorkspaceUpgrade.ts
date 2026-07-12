// hooks/useWorkspaceUpgrade.ts
import { useState, useCallback } from "react";
import {
  useWorkspaceSubscription,
  useCreateCheckout,
  useChangePlan,
  useWorkspaceInvoices,
  useCreatePortal,
  useCancelSubscription,
  useReactivateSubscription
} from "@/hooks/useBilling";
import type { PlanName, BillingCycle } from "@/types/billing.upgrade.types";

const UPGRADE_PLAN_KEY = "focura:upgrade-plan";

export function useWorkspaceUpgrade(workspaceId: string, workspaceSlug?: string) {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  const { data: sub, isPending, isFetching } = useWorkspaceSubscription(workspaceId);
  const checkout = useCreateCheckout(workspaceId);
  const changePlan = useChangePlan(workspaceId, workspaceSlug);

  const currentPlan = (sub?.planName ?? "FREE") as PlanName;
  const hasActiveSub = currentPlan !== "FREE";
  const isLoading = checkout.isPending || changePlan.isPending;

  // Track both initial load and refetches
  const isPendingOrFetching = isPending || isFetching;

  const handleSelect = useCallback(
    (planName: PlanName) => {
      if (planName === currentPlan || isLoading) return;

      if (planName === "FREE") {
        changePlan.mutate({ newPlanName: "FREE" });
        return;
      }

      const billingCycle = cycle === "yearly" ? "YEARLY" : "MONTHLY";

      if (hasActiveSub) {
        changePlan.mutate({
          newPlanName: planName,
          billingCycle,
        });
        return;
      }

      // Store selected plan for success page (in case backend doesn't pass it in success_url)
      if (typeof window !== "undefined") {
        sessionStorage.setItem(UPGRADE_PLAN_KEY, planName);
      }

      checkout.mutate({
        planName,
        billingCycle,
      });
    },
    [currentPlan, isLoading, cycle, hasActiveSub, changePlan, checkout],
  );

  return {
    cycle,
    setCycle,
    currentPlan,
    hasActiveSub,
    isLoading,
    isPending: isPendingOrFetching,
    handleSelect,
  };
}


export function useWorkspaceBilling(workspaceId: string) {
  const { data: sub, isPending: subLoading, isFetching: subFetching } =
    useWorkspaceSubscription(workspaceId);
  const { data: invoices, isPending: invoicesLoading } =
    useWorkspaceInvoices(workspaceId);

  const portal = useCreatePortal(workspaceId);
  const cancel = useCancelSubscription(workspaceId);
  const reactivate = useReactivateSubscription(workspaceId);

  const handleOpenPortal = useCallback(() => {
    portal.mutate();
  }, [portal]);

  const handleCancelSubscription = useCallback(() => {
    cancel.mutate({ immediately: false });
  }, [cancel]);

  const handleReactivateSubscription = useCallback(() => {
    reactivate.mutate();
  }, [reactivate]);

  return {
    // Data
    sub,
    invoices: invoices ?? [],

    // Loading states
    subLoading: subLoading || subFetching,
    invoicesLoading,

    // Mutation states
    portalPending: portal.isPending,
    cancelPending: cancel.isPending,
    reactivatePending: reactivate.isPending,

    // Handlers
    handleOpenPortal,
    handleCancelSubscription,
    handleReactivateSubscription,
  };
}
