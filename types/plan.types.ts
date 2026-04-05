// types/plan.ts
export type PlanName = 'free' | 'pro' | 'enterprise' | string;

export interface WorkspacePlan {
  planName: PlanName | null;
  isLoading: boolean;
  isFree: boolean;
  isPro: boolean;
  isEnterprise: boolean;
  hasPlan: (name: PlanName) => boolean;
}