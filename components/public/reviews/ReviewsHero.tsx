'use client';

import { StarRating } from '@/components/rating/StarRating';
import { useRatings } from '@/hooks/useRatings';
import { MessageSquareText, Star } from 'lucide-react';

export function ReviewsHero() {
  const { data } = useRatings(1, 1);
  const stats = data?.stats;

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-background to-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <MessageSquareText className="h-7 w-7 text-primary" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            What Our Users{' '}
            <span className="text-primary">Say</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground">
            Real reviews from real users. See how Focura helps teams stay focused
            and productive every day.
          </p>

          {/* Quick stats */}
          {stats && stats.totalRatings > 0 && (
            <div className="mt-8 flex items-center gap-4 rounded-xl border border-border/60 bg-card/60 px-6 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-1.5">
                <StarRating rating={Math.round(stats.averageStars)} size="sm" />
                <span className="text-sm font-semibold text-foreground">
                  {stats.averageStars.toFixed(1)}
                </span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-muted-foreground">
                  {stats.totalRatings} {stats.totalRatings === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
