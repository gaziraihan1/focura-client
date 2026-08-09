'use client';

import { useState } from 'react';
import { Clock, Layers, CheckCircle2, ChevronDown, ChevronUp, Crown, ArrowRight, FolderPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORY_META, COMPLEXITY_META } from '@/lib/templatesData';
import { Template, TemplateAccessTier, TIER_META, canAccessTemplate } from '@/types/templates.types';
import TemplateTierBadge from './TemplateTierBadge';
import TemplateRatingStars from './TemplateRatingStars';

interface TemplateCardProps {
  template    : Template;
  accessTier  : TemplateAccessTier;
  onUse       : (template: Template) => void;
  onUpgrade   : (template: Template) => void;
  onRate?     : (template: Template, stars: number) => void;
  ratePending?: boolean;
}

const VIEW_LABELS: Record<string, string> = {
  KANBAN  : 'Kanban',
  LIST    : 'List',
  CALENDAR: 'Calendar',
  TIMELINE: 'Timeline',
};

const TemplateCard = ({ template, accessTier, onUse, onUpgrade, onRate, ratePending }: TemplateCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const cat        = CATEGORY_META[template.category];
  const complexity = COMPLEXITY_META[template.complexity];
  const locked     = !canAccessTemplate(accessTier, template.tier);
  const tierMeta   = TIER_META[template.tier];

  return (
    <article className={cn(
      'group rounded-2xl border bg-white dark:bg-neutral-900 overflow-hidden transition-all hover:shadow-md flex flex-col',
      locked ? 'border-dashed border-neutral-300 dark:border-neutral-700' : cat.borderColor
    )}>
      {/* ── Colour strip + icon ───────────────────────────────────────────── */}
      <div
        className='h-1.5 w-full'
        style={{ backgroundColor: template.color, opacity: locked ? 0.25 : 0.7 }}
      />

      <div className='p-5 flex flex-col flex-1'>
        {/* Header row */}
        <div className='flex items-start justify-between gap-3 mb-3'>
          <div className='flex items-center gap-2.5 min-w-0'>
            <span className='text-2xl leading-none shrink-0'>{template.icon}</span>
            <div className='min-w-0'>
              <h3 className='text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-snug'>
                {template.title}
              </h3>
              <div className='flex items-center gap-1.5 mt-1 flex-wrap'>
                <span className={cn(
                  'inline-block text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5',
                  cat.bgColor, cat.color
                )}>
                  {cat.label}
                </span>
                <TemplateTierBadge tier={template.tier} locked={locked} />
              </div>
            </div>
          </div>

          {/* Status + complexity badges */}
          <div className='shrink-0 flex items-center gap-1.5'>
            {template.status === 'coming_soon' && (
              <span className='text-[10px] font-bold rounded-full px-2.5 py-0.5 h-fit bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'>
                Coming soon
              </span>
            )}
            <span className={cn(
              'text-[10px] font-bold rounded-full px-2.5 py-0.5 h-fit',
              complexity.style
            )}>
              {complexity.label}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className='text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4 flex-1'>
          {template.description}
        </p>

        {/* Meta row */}
        <div className='flex flex-wrap gap-2 mb-4'>
          <span className='inline-flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1'>
            <Layers className='w-3 h-3 shrink-0' strokeWidth={1.8} />
            {template.tasks.length} tasks
          </span>
          <span className='inline-flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1'>
            <Clock className='w-3 h-3 shrink-0' strokeWidth={1.8} />
            {template.estimatedSetupMinutes} min setup
          </span>
          <span className='inline-flex items-center text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1'>
            <TemplateRatingStars
              average={template.rating.average}
              count={template.rating.count}
              onRate={
                !locked && template.status === 'available' && onRate
                  ? (stars) => onRate(template, stars)
                  : undefined
              }
              pending={ratePending}
            />
          </span>
          {template.views.map((v) => (
            <span key={v} className='text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1'>
              {VIEW_LABELS[v] ?? v}
            </span>
          ))}
        </div>

        {/* Expand: preview tasks + labels (kept visible for locked templates so users see the value) */}
        {expanded && (
          <div className='mb-4 space-y-3 animate-in slide-in-from-top-2 duration-150'>
            {/* Sections */}
            <div>
              <p className='text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1.5'>
                Sections ({template.sections.length})
              </p>
              <div className='flex flex-wrap gap-1.5'>
                {template.sections.map((s) => (
                  <span key={s} className='text-[11px] border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-md px-2 py-0.5'>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Sample tasks */}
            <div>
              <p className='text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1.5'>
                Sample Tasks
              </p>
              <ul className='space-y-1'>
                {template.tasks.slice(0, 4).map((task) => (
                  <li key={task.title} className='flex items-start gap-2 text-xs text-neutral-500 dark:text-neutral-400'>
                    <CheckCircle2 className='w-3 h-3 shrink-0 text-neutral-300 dark:text-neutral-600 mt-0.5' strokeWidth={2} />
                    <span className='leading-relaxed'>{task.title}</span>
                  </li>
                ))}
                {template.tasks.length > 4 && (
                  <li className='text-[11px] text-neutral-400 dark:text-neutral-500 pl-5'>
                    +{template.tasks.length - 4} more tasks…
                  </li>
                )}
              </ul>
            </div>

            {/* Labels */}
            <div>
              <p className='text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1.5'>
                Labels ({template.labels.length})
              </p>
              <div className='flex flex-wrap gap-1.5'>
                {template.labels.map((label) => (
                  <span
                    key={label.name}
                    className='inline-flex items-center gap-1 text-[11px] rounded-full border px-2 py-0.5 text-neutral-700 dark:text-neutral-300'
                    style={{ borderColor: label.color + '60', backgroundColor: label.color + '18' }}
                  >
                    <span
                      className='w-1.5 h-1.5 rounded-full shrink-0'
                      style={{ backgroundColor: label.color }}
                    />
                    {label.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Milestones */}
            {template.milestones.length > 0 && (
              <div>
                <p className='text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1.5'>
                  Milestones
                </p>
                <ul className='space-y-1'>
                  {template.milestones.map((m) => (
                    <li key={m.title} className='flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400'>
                      <span className='shrink-0 w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600' />
                      {m.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Toggle expand */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className='flex items-center gap-1 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors mb-4 self-start'
        >
          {expanded ? (
            <><ChevronUp className='w-3.5 h-3.5 shrink-0' /> Hide preview</>
          ) : (
            <><ChevronDown className='w-3.5 h-3.5 shrink-0' /> Preview contents</>
          )}
        </button>

        {/* CTA */}
        <div className='border-t border-neutral-100 dark:border-neutral-800 pt-4'>
          {template.status === 'coming_soon' ? (
            <div className='w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold rounded-xl px-3.5 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'>
              <Clock className='w-3.5 h-3.5 shrink-0' /> Coming soon
            </div>
          ) : locked ? (
            <div className='flex items-center justify-between gap-3'>
              <div className='flex items-center gap-2 min-w-0'>
                <Crown className={cn('w-4 h-4 shrink-0', tierMeta.lockedStyle)} strokeWidth={2} />
                <span className={cn('text-xs font-semibold', tierMeta.lockedStyle)}>
                  {template.tier === 'BUSINESS' ? 'Business tier' : 'Pro tier'}
                </span>
              </div>
              <button
                onClick={() => onUpgrade(template)}
                className='inline-flex items-center gap-1.5 text-xs font-bold rounded-xl px-3.5 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors'
              >
                Unlock <ArrowRight className='w-3.5 h-3.5 shrink-0' />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onUse(template)}
              className='w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold rounded-xl px-3.5 py-2.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors'
            >
              <FolderPlus className='w-3.5 h-3.5 shrink-0' /> Use template
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default TemplateCard;
