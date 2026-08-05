'use client';

import { useParams, useRouter } from 'next/navigation';
import { Lock, Sparkles } from 'lucide-react';

interface UpgradeSectionCardProps {
  /** Name of the locked section, e.g. "Member Leaderboard" */
  title: string;
  /** Short upsell copy — tells the user what upgrading unlocks */
  description: string;
  /** Optional icon to render in the lock badge */
  icon?: React.ReactNode;
  /** Button label — defaults to "Upgrade to Business" */
  ctaLabel?: string;
}

/**
 * Inline upgrade card used to upsell the Business plan on pages that are
 * available to PRO (member leaderboard, storage breakdown, etc.).
 * Rendered in place of the locked section — it's a soft upsell, not a hard
 * "locked" screen.
 */
export function UpgradeSectionCard({
  title,
  description,
  icon,
  ctaLabel = "Upgrade to Business",
}: UpgradeSectionCardProps) {
  const router = useRouter();
  const params = useParams();
  const slug = params.workspaceSlug as string;

  return (
    <section
      aria-label={`${title} — upgrade to Business`}
      className="relative overflow-hidden rounded-2xl border bg-card h-full"
    >
      {/* Top accent strip */}
      <div
        className="h-1 w-full bg-linear-to-r from-primary via-primary/60 to-primary/20"
        aria-hidden="true"
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 sm:p-6">
        {/* Lock badge */}
        <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-primary/10 text-primary">
          {icon ?? <Lock className="w-5 h-5" aria-hidden="true" />}
        </div>

        {/* Copy */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push(`/dashboard/workspaces/${slug}/billing/upgrade`)}
          className="shrink-0 inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg
                     bg-primary text-primary-foreground text-sm font-medium
                     hover:bg-primary/90 active:scale-[0.98] transition-colors transition-transform"
        >
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          {ctaLabel}
        </button>
      </div>
    </section>
  );
}
