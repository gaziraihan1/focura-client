'use client';

import { useState }   from 'react';
import { Clock, Layers, CheckCircle2, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import { cn }         from '@/lib/utils';
import { CATEGORY_META, COMPLEXITY_META } from '@/lib/templatesData';
import { Template } from '@/types/templates.types';
interface TemplateCardProps {
  template   : Template;
  onNotify   : (template: Template) => void;
}

const VIEW_LABELS: Record<string, string> = {
  KANBAN  : 'Kanban',
  LIST    : 'List',
  CALENDAR: 'Calendar',
  TIMELINE: 'Timeline',
};

const TemplateCard = ({ template, onNotify }: TemplateCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [notified, setNotified] = useState(false);

  const cat        = CATEGORY_META[template.category];
  const complexity = COMPLEXITY_META[template.complexity];

  const handleNotify = () => {
    onNotify(template);
    setNotified(true);
    setTimeout(() => setNotified(false), 3000);
  };

  return (
    <article className={cn(
      'group rounded-2xl border bg-white dark:bg-neutral-900 overflow-hidden transition-all hover:shadow-sm flex flex-col',
      cat.borderColor
    )}>
      {/* ── Colour strip + icon ───────────────────────────────────────────── */}
      <div
        className='h-1.5 w-full'
        style={{ backgroundColor: template.color, opacity: 0.7 }}
      />

      <div className='p-5 flex flex-col flex-1'>
        {/* Header row */}
        <div className='flex items-start justify-between gap-3 mb-3'>
          <div className='flex items-center gap-2.5'>
            <span className='text-2xl leading-none'>{template.icon}</span>
            <div>
              <h3 className='text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-snug'>
                {template.title}
              </h3>
              <span className={cn(
                'inline-block text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5 mt-0.5',
                cat.bgColor, cat.color
              )}>
                {cat.label}
              </span>
            </div>
          </div>

          {/* Complexity badge */}
          <span className={cn(
            'shrink-0 text-[10px] font-bold rounded-full px-2.5 py-0.5 h-fit',
            complexity.style
          )}>
            {complexity.label}
          </span>
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
          {template.views.map((v) => (
            <span key={v} className='text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1'>
              {VIEW_LABELS[v] ?? v}
            </span>
          ))}
        </div>

        {/* Expand: preview tasks + labels */}
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
          <div className='flex items-center justify-between gap-3'>
            <div className='flex items-center gap-2'>
              <span className='w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0' />
              <span className='text-xs font-semibold text-amber-700 dark:text-amber-400'>
                Coming soon
              </span>
            </div>
            <button
              onClick={handleNotify}
              className={cn(
                'inline-flex items-center gap-1.5 text-xs font-bold rounded-xl px-3.5 py-2 transition-colors',
                notified
                  ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                  : 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-300'
              )}
            >
              {notified ? (
                <><CheckCircle2 className='w-3.5 h-3.5 shrink-0' /> Notified!</>
              ) : (
                <><Bell className='w-3.5 h-3.5 shrink-0' /> Notify me</>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default TemplateCard;