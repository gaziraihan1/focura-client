'use client';

import { useState } from 'react';
import { StarRating } from './StarRating';
import { useCreateRating, useUpdateRating, useDeleteRating } from '@/hooks/useRatings';
import type { Rating } from '@/types/rating.types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Pencil, Trash2, Send } from 'lucide-react';

interface RatingFormProps {
  existingRating?: Rating | null;
  className?: string;
}

export function RatingForm({ existingRating, className }: RatingFormProps) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const createMutation = useCreateRating();
  const updateMutation = useUpdateRating();
  const deleteMutation = useDeleteRating();

  // Use existing rating values when not editing, otherwise use local state
  const currentStars = isEditing ? stars : (existingRating?.stars ?? 0);
  const currentComment = isEditing ? comment : (existingRating?.comment ?? '');

  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (currentStars === 0) return;

    if (existingRating) {
      updateMutation.mutate(
        { id: existingRating.id, stars: currentStars, comment: currentComment || null },
        { onSuccess: () => setIsEditing(false) },
      );
    } else {
      createMutation.mutate(
        { stars: currentStars, comment: currentComment || null },
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
        <Button
          onClick={() => setIsEditing(true)}
          leftIcon={<StarIcon className="h-4 w-4" />}
        >
          Write a Review
        </Button>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStars(existingRating.stars);
                setComment(existingRating.comment ?? '');
                setIsEditing(true);
              }}
              leftIcon={<Pencil className="h-3 w-3" />}
              disabled={isPending}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              leftIcon={<Trash2 className="h-3 w-3" />}
              className="text-destructive hover:bg-destructive/10"
              disabled={isPending}
            >
              Delete
            </Button>
          </div>
        </div>
        <StarRating rating={currentStars} size="md" />
        {currentComment && (
          <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
            {currentComment}
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
          rating={currentStars}
          size="lg"
          interactive
          onChange={setStars}
        />
        {currentStars === 0 && (
          <p className="mt-1 text-xs text-muted-foreground">Click a star to rate</p>
        )}
      </div>

      <textarea
        value={currentComment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)"
        rows={3}
        maxLength={2000}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
      />

      <div className="mt-3 flex items-center gap-2">
        <Button
          type="submit"
          disabled={currentStars === 0 || isPending}
          leftIcon={<Send className="h-3.5 h-3.5" />}
        >
          {existingRating ? 'Update Review' : 'Submit Review'}
        </Button>
        {existingRating && (
          <Button
            variant="ghost"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
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
