'use client';

import { Crown, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TIER_META, type TemplateTier } from '@/types/templates.types';

interface TemplateTierBadgeProps {
  tier: TemplateTier;
  locked?: boolean;
  className?: string;
}

/** Small pill showing a template's plan tier, with a lock when gated. */
const TemplateTierBadge = ({ tier, locked = false, className }: TemplateTierBadgeProps) => {
  const meta = TIER_META[tier];
  return (
    <span
      className={cn(
        'shrink-0 inline-flex items-center gap-1 text-[10px] font-bold rounded-full px-2 py-0.5 h-fit',
        meta.badgeStyle,
        className,
      )}
      title={locked ? meta.description : undefined}
    >
      {locked ? (
        <Lock className='w-2.5 h-2.5' strokeWidth={2.5} aria-hidden />
      ) : (
        <Crown className='w-2.5 h-2.5' strokeWidth={2.5} aria-hidden />
      )}
      {meta.label}
    </span>
  );
};

export default TemplateTierBadge;
