'use client';

import { cn } from '@/lib/utils';
import type { FeatureStatus } from '@/types/feature.types';

const STATUS_CONFIG: Record<FeatureStatus, { label: string; className: string }> = {
  PENDING:   { label: 'Pending',   className: 'bg-muted text-muted-foreground border-border' },
  APPROVED:  { label: 'Approved',  className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  REJECTED:  { label: 'Rejected',  className: 'bg-destructive/10 text-destructive border-destructive/20' },
  PLANNED:   { label: 'Planned',   className: 'bg-primary/10 text-primary border-primary/20' },
  COMPLETED: { label: 'Completed', className: 'bg-violet-500/10 text-violet-600 border-violet-500/20' },
};

export function FeatureStatusBadge({ status }: { status: FeatureStatus }) {
  const { label, className } = STATUS_CONFIG[status];
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border',
      className,
    )}>
      {label}
    </span>
  );
}