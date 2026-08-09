'use client';

import { Sparkles } from 'lucide-react';
import { Template, TemplateAccessTier } from '@/types/templates.types';
import TemplateCard from './TemplatesCard';

interface TemplatesFeaturedProps {
  templates  : Template[];
  accessTier : TemplateAccessTier;
  onUse      : (template: Template) => void;
  onUpgrade  : (template: Template) => void;
  onRate?    : (template: Template, stars: number) => void;
  ratePending?: boolean;
}

/**
 * TemplatesFeatured
 *
 * A horizontal, scrollable strip of curated "featured" templates shown at the
 * top of the gallery. Featured templates are flagged server-side (seed +
 * author/admin toggle) and sorted here by rating, then usage — so the strip
 * always surfaces the community's favourites first. Hidden entirely when the
 * catalog has no featured templates (e.g. offline fallback without flags).
 */
const TemplatesFeatured = ({
  templates,
  accessTier,
  onUse,
  onUpgrade,
  onRate,
  ratePending,
}: TemplatesFeaturedProps) => {
  if (templates.length === 0) return null;

  const sorted = [...templates].sort(
    (a, b) =>
      (b.rating?.average ?? 0) - (a.rating?.average ?? 0) ||
      (b.usageCount ?? 0) - (a.usageCount ?? 0),
  );

  return (
    <section className='mb-12' aria-label='Featured templates'>
      <div className='flex items-center gap-2 mb-5'>
        <span className='w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-200 dark:border-amber-800/50 flex items-center justify-center shrink-0'>
          <Sparkles className='w-4 h-4 text-amber-500' strokeWidth={2} />
        </span>
        <div>
          <h2 className='text-sm font-bold text-neutral-900 dark:text-neutral-100'>
            Featured templates
          </h2>
          <p className='text-[11px] text-neutral-400 dark:text-neutral-500'>
            The community&apos;s highest-rated picks — sorted by rating and usage.
          </p>
        </div>
      </div>

      <div className='flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-1 px-1'>
        {sorted.map((template) => (
          <div key={template.id} className='w-72 shrink-0 snap-start'>
            <TemplateCard
              template={template}
              accessTier={accessTier}
              onUse={onUse}
              onUpgrade={onUpgrade}
              onRate={onRate}
              ratePending={ratePending}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TemplatesFeatured;
