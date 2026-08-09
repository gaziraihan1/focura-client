'use client';

import { CATEGORY_META, CategoryFilter, TierFilter, ALL_TIERS, TIER_LABELS } from '@/lib/templatesData';
import { Template } from '@/types/templates.types';
import { cn } from '@/lib/utils';

interface TemplatesCategoriesProps {
  active     : CategoryFilter;
  onChange   : (c: CategoryFilter) => void;
  activeTier : TierFilter;
  onTierChange: (t: TierFilter) => void;
  templates  : Template[];
}

const TemplatesCategories = ({ active, onChange, activeTier, onTierChange, templates }: TemplatesCategoriesProps) => {
  const counts = Object.fromEntries(
    Object.keys(CATEGORY_META).map((cat) => [
      cat,
      templates.filter((t) => t.category === cat).length,
    ])
  );

  const tierCounts: Record<TierFilter, number> = {
    all: templates.length,
    FREE: templates.filter((t) => t.tier === 'FREE').length,
    PRO: templates.filter((t) => t.tier === 'PRO').length,
    BUSINESS: templates.filter((t) => t.tier === 'BUSINESS').length,
  };

  return (
    <div className='sticky top-16 z-30 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800'>
      <div className='max-w-6xl mx-auto px-6 py-3 space-y-2.5'>
        {/* Tier filter */}
        <div className='flex items-center gap-1 overflow-x-auto scrollbar-none' aria-label='Filter by plan tier'>
          {ALL_TIERS.map((tier) => (
            <button
              key={tier}
              onClick={() => onTierChange(tier)}
              className={cn(
                'shrink-0 flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors',
                activeTier === tier
                  ? 'bg-violet-600 dark:bg-violet-500 text-white'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              )}
            >
              {TIER_LABELS[tier]}
              <span className={cn(
                'text-[10px] font-bold rounded-full px-1.5 py-0.5',
                activeTier === tier
                  ? 'bg-white/20 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
              )}>
                {tierCounts[tier] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className='flex items-center gap-1 overflow-x-auto scrollbar-none'>
          {/* All */}
          <button
            onClick={() => onChange('all')}
            className={cn(
              'shrink-0 flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors',
              active === 'all'
                ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            )}
          >
            All
            <span className={cn(
              'text-[10px] font-bold rounded-full px-1.5 py-0.5',
              active === 'all'
                ? 'bg-white/20 dark:bg-neutral-900/20 text-white dark:text-neutral-900'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
            )}>
              {templates.length}
            </span>
          </button>

          {/* Category tabs */}
          {(Object.entries(CATEGORY_META) as [CategoryFilter, typeof CATEGORY_META[keyof typeof CATEGORY_META]][]).map(
            ([key, meta]) => (
              <button
                key={key}
                onClick={() => onChange(key)}
                className={cn(
                  'shrink-0 flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors',
                  active === key
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                )}
              >
                {meta.label}
                <span className={cn(
                  'text-[10px] font-bold rounded-full px-1.5 py-0.5',
                  active === key
                    ? 'bg-white/20 dark:bg-neutral-900/20 text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                )}>
                  {counts[key] ?? 0}
                </span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplatesCategories;
