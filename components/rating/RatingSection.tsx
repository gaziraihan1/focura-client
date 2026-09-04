'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRatings, useMyRating } from '@/hooks/useRatings';
import { RatingStats } from './RatingStats';
import { RatingForm } from './RatingForm';
import { RatingList } from './RatingList';
import { MessageSquareText } from 'lucide-react';

interface RatingSectionProps {
  className?: string;
}

export function RatingSection({ className }: RatingSectionProps) {
  const [page, setPage] = useState(1);
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const { data: ratingsData, isLoading: ratingsLoading } = useRatings(page, 10);
  const { data: myRating, isLoading: myRatingLoading } = useMyRating();

  if (ratingsLoading || myRatingLoading) {
    return (
      <section className={className}>
        <SectionHeader />
        <div className="mt-6 space-y-4">
          <div className="h-32 animate-pulse rounded-lg bg-muted" />
          <div className="h-20 animate-pulse rounded-lg bg-muted" />
          <div className="h-20 animate-pulse rounded-lg bg-muted" />
        </div>
      </section>
    );
  }

  return (
    <section className={className}>
      <SectionHeader />

      {/* Stats */}
      {ratingsData?.stats && (
        <RatingStats stats={ratingsData.stats} className="mt-6" />
      )}

      {/* User's own rating form */}
      {isAuthenticated && (
        <div className="mt-6">
          <RatingForm existingRating={myRating ?? null} />
        </div>
      )}

      {!isAuthenticated && (
        <div className="mt-6 rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Sign in to leave a review.
          </p>
        </div>
      )}

      {/* All ratings list */}
      {ratingsData && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            All Reviews
          </h3>
          <RatingList
            ratings={ratingsData.ratings}
            pagination={ratingsData.pagination}
            currentUserId={session?.user?.id as string | undefined}
            onPageChange={setPage}
          />
        </div>
      )}
    </section>
  );
}

function SectionHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
        <MessageSquareText className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-foreground">Reviews</h2>
        <p className="text-sm text-muted-foreground">
          See what others think about Gablura
        </p>
      </div>
    </div>
  );
}
