// types/workspace-upgrade.types.ts
import { LucideIcon } from 'lucide-react';

export type BillingCycle = 'monthly' | 'yearly';

export interface PlanPrice {
  monthly: number;
  yearly: number;
}

export interface Plan {
  name: PlanName;
  displayName: string;
  icon: LucideIcon;
  price: PlanPrice;
  description: string;
  features: string[];
  highlight: boolean;
}

export interface WorkspaceUpgradePageProps {
  workspaceSlug: string;
}

// types/workspace-billing.types.ts
import { InvoiceData, WorkspaceSubscription } from '@/hooks/useBilling';

export interface WorkspaceBillingPageProps {
  workspaceSlug: string;
}

export interface PlanCardProps {
  sub: WorkspaceSubscription | null | undefined;
  workspaceId: string;
  onPortal: () => void;
  portalPending: boolean;
  onCancel: () => void;
  cancelPending: boolean;
  onReactivate: () => void;
  reactivatePending: boolean;
}

export interface InvoiceTableProps {
  invoices: InvoiceData[];
}

export interface StatusBadgeProps {
  status: string;
}

export type SubscriptionStatus = 
  | 'ACTIVE' 
  | 'TRIALING' 
  | 'PAST_DUE' 
  | 'CANCELED' 
  | 'PAUSED';

export type PlanName = 'FREE' | 'PRO' | 'BUSINESS';