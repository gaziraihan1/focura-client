'use client';

import { useParams, useRouter } from 'next/navigation';
import { Sparkles, BarChart2, Users, Zap, Lock } from 'lucide-react';

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  Analytics:   <BarChart2 className="w-5 h-5" />,
  Members:     <Users className="w-5 h-5" />,
  Automations: <Zap className="w-5 h-5" />,
};

const PLAN_PERKS = [
  'More projects & members',
  'Advanced analytics & reporting',
  'Priority support',
  'More workspaces',
  'Storage management',
  'Workspace usage'
];

interface UpgradePlanCardProps {
  feature:     string;
  description: string;
}

export function UpgradePlanCard({ feature, description }: UpgradePlanCardProps) {
  const router = useRouter();
  const params = useParams();
  const slug   = params.workspaceSlug as string;

  const icon = FEATURE_ICONS[feature] ?? <Lock className="w-5 h-5" />;

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="w-full max-w-md">

        {/* Feature locked badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Pro feature
            </p>
            <h2 className="text-lg font-semibold leading-tight">{feature}</h2>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">

          {/* Top accent strip */}
          <div className="h-1 w-full bg-linear-to-r from-primary via-primary/70 to-primary/30" />

          <div className="p-6 space-y-5">

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description} Upgrade to <span className="font-medium text-foreground">Pro</span> to
              unlock this and all other premium features.
            </p>

            {/* Perks */}
            <ul className="space-y-2">
              {PLAN_PERKS.map((perk) => (
                <li key={perk} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <span className="shrink-0 w-4 h-4 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 10">
                      <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {perk}
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                onClick={() => router.push(`/dashboard/workspaces/${slug}/settings/billing`)}
                className="flex-1 flex items-center justify-center gap-2 h-9 px-4 rounded-lg
                           bg-primary text-primary-foreground text-sm font-medium
                           hover:bg-primary/90 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Upgrade to Pro
              </button>
              <button
                onClick={() => router.push(`/dashboard/workspaces/${slug}/settings/billing`)}
                className="h-9 px-4 rounded-lg border text-sm font-medium text-muted-foreground
                           hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                See plans
              </button>
            </div>
          </div>
        </div>

        {/* Sub-note */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Questions?{' '}
          <a href="mailto:support@yourapp.com"
             className="underline underline-offset-2 hover:text-foreground transition-colors">
            Contact support
          </a>
        </p>

      </div>
    </div>
  );
}