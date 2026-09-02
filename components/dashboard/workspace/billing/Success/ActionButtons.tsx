// components/BillingSuccess/ActionButtons.tsx
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
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
        className={buttonVariants({ variant: "primary", size: "lg" }) + " w-full group"}
      >
        Go to workspace
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>

      {/* Secondary row */}
      <div className="grid grid-cols-2 gap-3">
        {canUpgrade && (
          <Link
            href={`/dashboard/workspaces/${workspaceSlug}/billing/upgrade`}
            className={buttonVariants({ variant: "outline", size: "sm" }) + " w-full"}
          >
            <Zap className="w-3.5 h-3.5" />
            Upgrade plan
          </Link>
        )}
        {canDowngrade && (
          <Link
            href={`/dashboard/workspaces/${workspaceSlug}/billing`}
            className={buttonVariants({ variant: "outline", size: "sm" }) + " w-full text-muted-foreground hover:text-foreground"}
          >
            Manage billing
          </Link>
        )}
        {!canUpgrade && !canDowngrade && (
          <Link
            href={`/dashboard/workspaces/${workspaceSlug}/billing`}
            className={buttonVariants({ variant: "outline", size: "sm" }) + " col-span-2 w-full text-muted-foreground hover:text-foreground"}
          >
            Manage billing
          </Link>
        )}
      </div>
    </div>
  );
}