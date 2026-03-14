'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

// ---------------------------------------------------------------------------
// Query key factory — scoped per workspace (independent cache per workspace)
// ---------------------------------------------------------------------------

export const billingKeys = {
  all:          (workspaceId: string) => ['billing', workspaceId] as const,
  subscription: (workspaceId: string) => ['billing', workspaceId, 'subscription'] as const,
  invoices:     (workspaceId: string) => ['billing', workspaceId, 'invoices'] as const,
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WorkspaceSubscription {
  workspaceId:           string;
  planName:              'FREE' | 'PRO' | 'BUSINESS';
  status:                string;
  billingCycle:          'MONTHLY' | 'YEARLY';
  currentPeriodEnd:      string;
  cancelAtPeriodEnd:     boolean;
  trialEnd:              string | null;
  stripeSubscriptionId:  string;
}

export interface InvoiceData {
  id:            string;
  amount:        number;
  currency:      string;
  status:        string;
  pdfUrl:        string | null;
  hostedUrl:     string | null;
  invoiceNumber: string | null;
  periodStart:   string | null;
  periodEnd:     string | null;
  paidAt:        string | null;
  createdAt:     string;
}

export type PlanName    = 'FREE' | 'PRO' | 'BUSINESS';
export type BillingCycle = 'MONTHLY' | 'YEARLY';

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Fetch current subscription for a workspace. Returns null for FREE workspaces. */
export function useWorkspaceSubscription(workspaceId: string) {
  return useQuery({
    queryKey: billingKeys.subscription(workspaceId),
    queryFn:  async () => {
      const res = await api.get<WorkspaceSubscription>(
        `/api/workspaces/${workspaceId}/billing/subscription`,
      );
        console.log('sub raw res:', res);  // ← add this

      return res?.data ?? null;
    },
    enabled:   !!workspaceId,
    staleTime: 0,   // 5 min — matches backend Redis TTL
    retry:     false,            // 404 = FREE workspace, not an error
  });
}

/** Fetch invoices for a workspace. */
export function useWorkspaceInvoices(workspaceId: string) {
  return useQuery({
    queryKey: billingKeys.invoices(workspaceId),
    queryFn:  async () => {
      const res = await api.get<InvoiceData[]>(
        `/api/workspaces/${workspaceId}/billing/invoices`,
      );
        console.log('invoices raw res:', res);  // ← add this

      return res?.data;
    },
    enabled:   !!workspaceId,
    staleTime: 0,   // 2 min — matches backend Redis TTL
  });
}

/**
 * Create a Stripe checkout session.
 * On success, redirects the user to the Stripe-hosted checkout page.
 */
export function useCreateCheckout(workspaceId: string) {
  return useMutation({
    mutationFn: async (vars: { planName: Exclude<PlanName, 'FREE'>; billingCycle: BillingCycle }) => {
      const res = await api.post<{ url: string }>(
        `/api/workspaces/${workspaceId}/billing/create-checkout-session`,
        vars,
      );
            console.log('checkout res:', res); // ← add this temporarily

      return res?.data?.url;
    },
    onSuccess: (url) => {
      if (url) window.location.href = url;
    },
  });
}

/**
 * Open the Stripe customer portal (manage payment method, download invoices, cancel).
 * On success, redirects the user to the Stripe-hosted portal page.
 */
export function useCreatePortal(workspaceId: string) {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post<{ url: string }>(
        `/api/workspaces/${workspaceId}/billing/create-portal-session`,
      );
      return res?.data?.url;
    },
    onSuccess: (url) => {
      if (url) window.location.href = url;
    },
  });
}

/**
 * Change an existing subscription plan.
 * Downgrading to FREE cancels at period end.
 * Upgrading is prorated and invoiced immediately.
 */
export function useChangePlan(workspaceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { newPlanName: PlanName; billingCycle?: BillingCycle }) => {
      const res = await api.post(
        `/api/workspaces/${workspaceId}/billing/change-plan`,
        vars,
      );
      return res?.data;
    },
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: billingKeys.subscription(workspaceId) });
      const previous = qc.getQueryData(billingKeys.subscription(workspaceId));
      qc.setQueryData(billingKeys.subscription(workspaceId), (old: any) => {
        if (!old) return old;
        return { ...old, planName: vars.newPlanName };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        qc.setQueryData(billingKeys.subscription(workspaceId), context.previous);
      }
    },
   onSuccess: () => {
  setTimeout(() => {
    qc.invalidateQueries({ queryKey: billingKeys.all(workspaceId) });
  }, 3000);
},
  });
}
/** Cancel the workspace subscription. Defaults to cancel at period end. */
export function useCancelSubscription(workspaceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars?: { immediately?: boolean; reason?: string }) => {
      const res = await api.post(
        `/api/workspaces/${workspaceId}/billing/cancel-subscription`,
        vars ?? {},
      );
      return res?.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: billingKeys.subscription(workspaceId) });
    },
  });
}

/** Reactivate a subscription that was set to cancel at period end. */
export function useReactivateSubscription(workspaceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.post(
        `/api/workspaces/${workspaceId}/billing/reactivate-subscription`,
      );
      return res?.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: billingKeys.subscription(workspaceId) });
    },
  });
}