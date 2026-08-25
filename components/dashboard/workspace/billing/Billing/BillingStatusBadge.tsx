// components/WorkspaceBilling/StatusBadge.tsx
import { STATUS_CONFIGS } from '@/constants/billing.upgrade.constants';
import type { StatusBadgeProps } from '@/types/billing.upgrade.types';

export function BillingStatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIGS[status as keyof typeof STATUS_CONFIGS] ?? STATUS_CONFIGS.PAUSED;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.cls}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}