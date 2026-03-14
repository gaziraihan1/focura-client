// components/BillingSuccess/ActionButtons.tsx
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import type { PlanName } from '@/types/billing.success.types';

interface ActionButtonsProps {
  workspaceSlug: string;
  planName: PlanName;
  visible: boolean;
}

export function ActionButtons({
  workspaceSlug,
  planName,
  visible,
}: ActionButtonsProps) {
  const canUpgrade = planName === 'FREE' || planName === 'PRO' || planName !== "BUSINESS";
  const canDowngrade = planName === 'PRO' || planName === 'BUSINESS';

  return (
    <div
      className={`space-y-3 transition-all duration-700 delay-[400ms] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Primary — go to workspace */}
      <Link
        href={`/dashboard/workspaces/${workspaceSlug}`}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        Go to workspace
        <ArrowRight className="w-4 h-4" />
      </Link>

      {/* Secondary row */}
      <div className="grid grid-cols-2 gap-3">
        {canUpgrade && (
          <Link
            href={`/dashboard/workspaces/${workspaceSlug}/billing/upgrade`}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            Upgrade plan
          </Link>
        )}
        {canDowngrade && (
          <Link
            href={`/dashboard/workspaces/${workspaceSlug}/billing`}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            Manage billing
          </Link>
        )}
        {!canUpgrade && !canDowngrade && (
          <Link
            href={`/dashboard/workspaces/${workspaceSlug}/billing`}
            className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Manage billing
          </Link>
        )}
      </div>
    </div>
  );
}