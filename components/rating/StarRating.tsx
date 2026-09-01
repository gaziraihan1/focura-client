'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
  disabled?: boolean;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
} as const;

export function StarRating({
  rating,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onChange,
  className,
  disabled = false,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const displayRating = hovered ?? rating;

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      onMouseLeave={() => interactive && setHovered(null)}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={`${rating} out of ${maxStars} stars`}
    >
      {Array.from({ length: maxStars }, (_, i) => {
        const starIndex = i + 1;
        const isFilled = starIndex <= displayRating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive || disabled}
            className={cn(
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm transition-colors',
              interactive && !disabled && 'cursor-pointer hover:scale-110',
              !interactive && 'cursor-default',
            )}
            onClick={() => interactive && onChange?.(starIndex)}
            onMouseEnter={() => interactive && !disabled && setHovered(starIndex)}
            aria-label={`${starIndex} star${starIndex !== 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                sizeMap[size],
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-transparent text-muted-foreground/40',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
