// constants/workspace-upgrade.constants.ts
import { Rocket, Zap, Building2, CheckCircle2, AlertCircle, XCircle, Clock } from 'lucide-react';
import type { Plan } from '@/types/billing.upgrade.types';

export const PLANS: readonly Plan[] = [
  {
    name: 'FREE',
    displayName: 'Free',
    icon: Rocket,
    price: { monthly: 0, yearly: 0 },
    description: 'For individuals getting started',
    features: [
      '1 workspaces',
      '5 members per workspace',
      '3 projects',
      '1 GB storage',
      '5 MB max file size',
      '10 meetings / month',
    ],
    highlight: false,
  },
  {
    name: 'PRO',
    displayName: 'Pro',
    icon: Zap,
    price: { monthly: 1200, yearly: 12000 },
    description: 'For growing teams that need more',
    features: [
      '3 workspaces',
      '25 members per workspace',
      'Unlimited projects',
      '10 GB storage',
      '25 MB max file size',
      'Unlimited meetings',
      'Analytics access',
    ],
    highlight: true,
  },
  {
    name: 'BUSINESS',
    displayName: 'Business',
    icon: Building2,
    price: { monthly: 4900, yearly: 48000 },
    description: 'For large teams and organisations',
    features: [
      'Unlimited workspaces',
      'Unlimited members',
      'Unlimited projects',
      '100 GB storage',
      '100 MB max file size',
      'Unlimited meetings',
      'Analytics + reports',
      'Priority support',
      'API access',
    ],
    highlight: false,
  },
] as const;

export const PLAN_RANK = { FREE: 0, PRO: 1, BUSINESS: 2 } as const;

export const PLAN_META = {
  FREE: { label: 'Free', icon: Rocket },
  PRO: { label: 'Pro', icon: Zap },
  BUSINESS: { label: 'Business', icon: Building2 },
} as const;

export const STATUS_CONFIGS = {
  ACTIVE: {
    icon: CheckCircle2,
    label: 'Active',
    cls: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  },
  TRIALING: {
    icon: CheckCircle2,
    label: 'Trial',
    cls: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  },
  PAST_DUE: {
    icon: AlertCircle,
    label: 'Past due',
    cls: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  },
  CANCELED: {
    icon: XCircle,
    label: 'Canceled',
    cls: 'text-destructive bg-destructive/10 border-destructive/20',
  },
  PAUSED: {
    icon: Clock,
    label: 'Paused',
    cls: 'text-muted-foreground bg-muted border-border',
  },
} as const;

export const INVOICE_STATUS_STYLES: Record<string, string> = {
  PAID: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  OPEN: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  VOID: 'bg-muted text-muted-foreground',
  UNCOLLECTIBLE: 'bg-destructive/10 text-destructive',
  DRAFT: 'bg-muted text-muted-foreground',
};