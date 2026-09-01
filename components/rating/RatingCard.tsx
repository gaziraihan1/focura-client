'use client';

import { StarRating } from './StarRating';
import type { Rating } from '@/types/rating.types';
import { cn } from '@/lib/utils';

interface RatingCardProps {
  rating: Rating;
  isOwn?: boolean;
  className?: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function RatingCard({ rating, isOwn = false, className }: RatingCardProps) {
  const { user, stars, comment, edited, createdAt } = rating;

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-4 transition-colors hover:border-border/80',
        isOwn && 'ring-2 ring-primary/20',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name ?? 'User'}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            getInitials(user.name)
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {user.name ?? 'Anonymous'}
            </span>
            {isOwn && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                You
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDate(createdAt)}
            </span>
            {edited && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
          </div>

          <div className="mt-1">
            <StarRating rating={stars} size="sm" />
          </div>

          {comment && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {comment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
