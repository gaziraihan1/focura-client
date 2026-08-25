'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateRatingStarsProps {
  /** Average rating (0–5). Rounded for display. */
  average : number;
  /** Total number of ratings. */
  count   : number;
  /** When provided, the stars become an interactive 1–5 picker. */
  onRate? : (stars: number) => void;
  /** Disables the picker while a rate request is in flight. */
  pending?: boolean;
  size?   : 'sm' | 'md';
}

const SIZES = {
  sm: { star: 'w-3.5 h-3.5', text: 'text-[11px]' },
  md: { star: 'w-4 h-4',     text: 'text-xs' },
} as const;

/**
 * TemplateRatingStars
 *
 * Readonly mode: shows the rounded average + rating count (e.g. ★★★★☆ 4.8 (160)).
 * Interactive mode (onRate provided): a 1–5 star picker with hover preview and
 * keyboard-accessible radio buttons. Used on the templates gallery, featured
 * strip, and anywhere a template's community rating is surfaced.
 */
const TemplateRatingStars = ({
  average,
  count,
  onRate,
  pending,
  size = 'sm',
}: TemplateRatingStarsProps) => {
  const [hover, setHover] = useState(0);
  const starRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const interactive = !!onRate;
  const active = hover > 0 ? hover : Math.round(average);
  const s = SIZES[size];

  // ARIA radiogroup pattern: arrow keys move between stars, Enter/Space rate.
  const handleKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (!interactive) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const next =
      e.key === 'ArrowRight' ? Math.min(5, active + 1) : Math.max(1, active - 1);
    setHover(next);
    starRefs.current[next - 1]?.focus();
  };

  const stars = [1, 2, 3, 4, 5].map((n) => {
    const filled = n <= active;
    const star = (
      <Star
        key={n}
        className={cn(
          s.star,
          'shrink-0 transition-colors',
          filled
            ? 'fill-amber-400 text-amber-400'
            : 'fill-transparent text-neutral-300 dark:text-neutral-600',
        )}
        strokeWidth={1.5}
      />
    );
    if (!interactive) return star;

    return (
      <button
        key={n}
        type='button'
        role='radio'
        aria-checked={active === n}
        aria-label={`${n} star${n > 1 ? 's' : ''}`}
        disabled={pending}
        className={cn(
          'p-0.5 -m-0.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60',
          pending && 'opacity-50 cursor-wait',
        )}
        ref={(el) => {
          starRefs.current[n - 1] = el;
        }}
        onClick={(e) => {
          e.stopPropagation();
          onRate(n);
        }}
        onMouseEnter={() => setHover(n)}
        onFocus={() => setHover(n)}
      >
        {star}
      </button>
    );
  });

  return (
    <span
      className={cn('inline-flex items-center gap-0.5', interactive && 'cursor-pointer select-none')}
      role={interactive ? 'radiogroup' : undefined}
      aria-label={interactive ? 'Rate this template' : `Rated ${average} out of 5`}
      title={interactive ? 'Tap a star to rate' : `${average} / 5`}
      onKeyDown={handleKeyDown}
      onMouseLeave={() => setHover(0)}
    >
      {stars}
      <span className={cn(s.text, 'font-semibold text-neutral-500 dark:text-neutral-400 ml-1')}>
        {count > 0 ? average.toFixed(1) : '—'}
      </span>
      {count > 0 && (
        <span className={cn(s.text, 'text-neutral-400 dark:text-neutral-500')}>
          ({count})
        </span>
      )}
    </span>
  );
};

export default TemplateRatingStars;
