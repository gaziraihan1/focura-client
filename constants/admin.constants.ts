// constants/admin-user-detail.constants.ts

export const TASK_STATUS_COLORS: Record<string, string> = {
  TODO: 'text-muted-foreground bg-muted',
  IN_PROGRESS: 'text-primary bg-primary/10',
  IN_REVIEW: 'text-amber-600 bg-amber-500/10',
  COMPLETED: 'text-emerald-600 bg-emerald-500/10',
  CANCELLED: 'text-destructive bg-destructive/10',
  BLOCKED: 'text-orange-600 bg-orange-500/10',
};

export const FEATURE_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-muted text-muted-foreground border-border',
  APPROVED: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  REJECTED: 'bg-destructive/10 text-destructive border-destructive/20',
  PLANNED: 'bg-primary/10 text-primary border-primary/20',
  COMPLETED: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
};

export const PLAN_COLORS: Record<string, string> = {
  FREE: 'text-muted-foreground bg-muted border-border',
  PRO: 'text-primary bg-primary/10 border-primary/20',
  BUSINESS: 'text-violet-600 bg-violet-500/10 border-violet-500/20',
  ENTERPRISE: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
};