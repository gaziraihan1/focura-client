// types/billing-success.types.ts
import { LucideIcon } from 'lucide-react';

export type PlanName = 'FREE' | 'PRO' | 'BUSINESS';

export interface PlanFeatures {
  members: string;
  storage: string;
  projects: string;
  meetings: string;
  analytics: boolean;
  api: boolean;
  support: boolean;
}

export interface PlanMeta {
  label: string;
  icon: LucideIcon | null;
  color: string;
  bgColor: string;
  borderColor: string;
  features: PlanFeatures;
}

export interface GainedFeature {
  icon: LucideIcon;
  label: string;
  detail: string;
}

export interface CounterProps {
  to: number;
  suffix?: string;
}

export interface SubscriptionDetail {
  label: string;
  value: string;
}