'use client';

import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCastVote } from '@/hooks/useFeatures';
import type { FeatureRequest, VoteType } from '@/types/feature.types';

interface Props {
  feature:  FeatureRequest;
  disabled?: boolean;
}

export function FeatureVoteButtons({ feature, disabled }: Props) {
  const { mutate: castVote, isPending } = useCastVote();

  const canVote = feature.status === 'APPROVED' || feature.status === 'PLANNED';

  const handleVote = (type: VoteType) => {
    if (!canVote || isPending) return;
    castVote({ id: feature.id, type });
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        disabled={disabled || !canVote || isPending}
        onClick={() => handleVote('UP')}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all',
          feature.userVote === 'UP'
            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
            : 'border-border text-muted-foreground hover:text-emerald-600 hover:border-emerald-500/30 hover:bg-emerald-500/5',
          (!canVote || disabled) && 'opacity-40 cursor-not-allowed',
        )}
      >
        {isPending
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : <ThumbsUp className={cn('w-3.5 h-3.5', feature.userVote === 'UP' && 'fill-emerald-500/30')} />}
        <span>{feature._count.upvotes}</span>
      </button>

      <button
        type="button"
        disabled={disabled || !canVote || isPending}
        onClick={() => handleVote('DOWN')}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all',
          feature.userVote === 'DOWN'
            ? 'bg-destructive/10 text-destructive border-destructive/30'
            : 'border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5',
          (!canVote || disabled) && 'opacity-40 cursor-not-allowed',
        )}
      >
        <ThumbsDown className={cn('w-3.5 h-3.5', feature.userVote === 'DOWN' && 'fill-destructive/30')} />
        <span>{feature._count.downvotes}</span>
      </button>
    </div>
  );
}