// components/AdminUserDetail/StatCard.tsx
import { cn } from '@/lib/utils';
import type { StatCardProps } from '@/types/admin.types';

export function StatCard({ icon: Icon, label, value, sub, className }: StatCardProps) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
      <div className={cn('p-2 rounded-lg shrink-0', className ?? 'bg-primary/10')}>
        <Icon className={cn('w-4 h-4', className ? '' : 'text-primary')} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold text-foreground tabular-nums">{value}</p>
        <p className="text-[11px] text-muted-foreground">{label}</p>
        {sub && <p className="text-[10px] text-muted-foreground/60">{sub}</p>}
      </div>
    </div>
  );
}