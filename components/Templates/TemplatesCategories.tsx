'use client';

import { CATEGORY_META, CategoryFilter, TEMPLATES } from '@/lib/templatesData';
import { cn }                from '@/lib/utils';

interface TemplatesCategoriesProps {
  active   : CategoryFilter;
  onChange : (c: CategoryFilter) => void;
}

const TemplatesCategories = ({ active, onChange }: TemplatesCategoriesProps) => {
  const counts = Object.fromEntries(
    Object.keys(CATEGORY_META).map((cat) => [
      cat,
      TEMPLATES.filter((t) => t.category === cat).length,
    ])
  );

  return (
    <div className='sticky top-16 z-30 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800'>
      <div className='max-w-6xl mx-auto px-6'>
        <div className='flex items-center gap-1 overflow-x-auto py-3 scrollbar-none'>
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
              {TEMPLATES.length}
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