'use client';

import { StarRating } from './StarRating';
import type { RatingStats as RatingStatsType } from '@/types/rating.types';
import { cn } from '@/lib/utils';

interface RatingStatsProps {
  stats: RatingStatsType;
  className?: string;
}

function getBarWidth(count: number, total: number): number {
  if (total === 0) return 0;
  return (count / total) * 100;
}

export function RatingStats({ stats, className }: RatingStatsProps) {
  const { averageStars, totalRatings, distribution } = stats;

  return (
    <div className={cn('rounded-lg border border-border bg-card p-6', className)}>
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Left: Average score */}
        <div className="flex flex-col items-center justify-center sm:min-w-[120px]">
          <span className="text-4xl font-bold text-foreground">
            {averageStars.toFixed(1)}
          </span>
          <StarRating rating={Math.round(averageStars)} size="md" className="mt-1" />
          <span className="mt-1 text-xs text-muted-foreground">
            {totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        {/* Right: Distribution bars */}
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star as keyof typeof distribution] ?? 0;
            const width = getBarWidth(count, totalRatings);

            return (
              <div key={star} className="flex items-center gap-2">
                <span className="w-3 text-xs text-muted-foreground text-right">
                  {star}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="w-8 text-xs text-muted-foreground text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
