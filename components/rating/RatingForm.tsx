'use client';

import { useState, useEffect } from 'react';
import { StarRating } from './StarRating';
import { useCreateRating, useUpdateRating, useDeleteRating } from '@/hooks/useRatings';
import type { Rating } from '@/types/rating.types';
import { cn } from '@/lib/utils';
import { Pencil, Trash2, Send } from 'lucide-react';

interface RatingFormProps {
  existingRating?: Rating | null;
  className?: string;
}

export function RatingForm({ existingRating, className }: RatingFormProps) {
  const [stars, setStars] = useState(existingRating?.stars ?? 0);
  const [comment, setComment] = useState(existingRating?.comment ?? '');
  const [isEditing, setIsEditing] = useState(false);

  const createMutation = useCreateRating();
  const updateMutation = useUpdateRating();
  const deleteMutation = useDeleteRating();

  useEffect(() => {
    if (existingRating) {
      setStars(existingRating.stars);
      setComment(existingRating.comment ?? '');
      setIsEditing(false);
    }
  }, [existingRating]);

  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (stars === 0) return;

    if (existingRating) {
      updateMutation.mutate(
        { id: existingRating.id, stars, comment: comment || null },
        { onSuccess: () => setIsEditing(false) },
      );
    } else {
      createMutation.mutate(
        { stars, comment: comment || null },
        { onSuccess: () => setIsEditing(false) },
      );
    }
  }

  function handleDelete() {
    if (!existingRating) return;
    deleteMutation.mutate(existingRating.id);
  }

  // Deleted state
  if (!existingRating && !isEditing) {
    return (
      <div className={cn('rounded-lg border border-border bg-card p-6 text-center', className)}>
        <p className="text-sm text-muted-foreground mb-3">
          You haven&apos;t rated this application yet.
        </p>
        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
        >
          <StarIcon className="h-4 w-4" />
          Write a Review
        </button>
      </div>
    );
  }

  // View mode
  if (!isEditing && existingRating) {
    return (
      <div className={cn('rounded-lg border border-border bg-card p-4', className)}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-foreground">Your Review</h4>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition"
              disabled={isPending}
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 transition"
              disabled={isPending}
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          </div>
        </div>
        <StarRating rating={existingRating.stars} size="md" />
        {existingRating.comment && (
          <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
            {existingRating.comment}
          </p>
        )}
      </div>
    );
  }

  // Edit / Create form
  return (
    <form
      onSubmit={handleSubmit}
      className={cn('rounded-lg border border-border bg-card p-4', className)}
    >
      <h4 className="text-sm font-medium text-foreground mb-3">
        {existingRating ? 'Edit Your Review' : 'Rate This Application'}
      </h4>

      <div className="mb-3">
        <StarRating
          rating={stars}
          size="lg"
          interactive
          onChange={setStars}
        />
        {stars === 0 && (
          <p className="mt-1 text-xs text-muted-foreground">Click a star to rate</p>
        )}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)"
        rows={3}
        maxLength={2000}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
      />

      <div className="mt-3 flex items-center gap-2">
        <button
          type="submit"
          disabled={stars === 0 || isPending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
          {existingRating ? 'Update Review' : 'Submit Review'}
        </button>
        {existingRating && (
          <button
            type="button"
            onClick={() => {
              setStars(existingRating.stars);
              setComment(existingRating.comment ?? '');
              setIsEditing(false);
            }}
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      />
    </svg>
  );
}
