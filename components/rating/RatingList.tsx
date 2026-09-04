'use client';

import { RatingCard } from './RatingCard';
import type { Rating, RatingPagination } from '@/types/rating.types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { Star } from 'lucide-react';

interface RatingListProps {
  ratings: Rating[];
  pagination: RatingPagination;
  currentUserId?: string;
  onPageChange: (page: number) => void;
  className?: string;
}

export function RatingList({
  ratings,
  pagination,
  currentUserId,
  onPageChange,
  className,
}: RatingListProps) {
  if (ratings.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title="No reviews yet"
        description="Be the first to share your experience with Gablura."
        className={className}
      />
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {ratings.map((rating) => (
        <RatingCard
          key={rating.id}
          rating={rating}
          isOwn={rating.userId === currentUserId}
        />
      ))}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
