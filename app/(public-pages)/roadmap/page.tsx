'use client';

import { useState }                from 'react';
import { motion } from 'framer-motion';
import {
  FILTER_OPTIONS,
  ROADMAP_ITEMS,
  STATUS_CONFIG,
  type RoadmapItem,
  type RoadmapStatus,
} from '@/lib/roadmapData';
import { cn }                              from '@/lib/utils';
import RoadmapCard from '@/components/Roadmap/RoadmapCard';
import DetailModal from '@/components/Roadmap/DetailModal';
import QuarterLabel from '@/components/Roadmap/QuarterLabel';

export default function RoadmapPage() {
  const [activeFilter, setActiveFilter] = useState<RoadmapStatus | 'all'>('all');
  const [selected,     setSelected]     = useState<RoadmapItem | null>(null);

  const filtered =
    activeFilter === 'all'
      ? ROADMAP_ITEMS
      : ROADMAP_ITEMS.filter((i) => i.status === activeFilter);

  const byQuarter = filtered.reduce<Record<string, RoadmapItem[]>>((acc, item) => {
    if (!acc[item.quarter]) acc[item.quarter] = [];
    acc[item.quarter].push(item);
    return acc;
  }, {});

  const quarters = Object.keys(byQuarter);

  const completed  = ROADMAP_ITEMS.filter((i) => i.status === 'completed').length;
  const inProgress = ROADMAP_ITEMS.filter((i) => i.status === 'in-progress').length;
  const planned    = ROADMAP_ITEMS.filter((i) => i.status === 'planned').length;
  const future     = ROADMAP_ITEMS.filter((i) => i.status === 'future').length;

  return (
    <div className='min-h-screen bg-white dark:bg-neutral-950'>

      <section className='relative bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 overflow-hidden'>
        <div
          className='absolute inset-0 opacity-[0.03] dark:opacity-[0.06]'
          style={{
            backgroundImage: `linear-gradient(var(--color-neutral-900,#171717) 1px,transparent 1px),
              linear-gradient(90deg,var(--color-neutral-900,#171717) 1px,transparent 1px)`,
            backgroundSize: '36px 36px',
          }}
        />
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-150 h-48 bg-emerald-400/5 dark:bg-emerald-300/5 rounded-full blur-3xl pointer-events-none' />

        <div className='relative max-w-5xl mx-auto px-6 py-16 md:py-24 text-center'>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className='inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-6 shadow-sm'
          >
            <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse' />
            Product Roadmap · Live
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className='text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-4 leading-[1.08]'
          >
            Where Focura is going.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='text-base text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed'
          >
            A transparent view of everything we&apos;ve shipped and everything
            we&apos;re building next. Click any item to see the full picture.
          </motion.p>
        </div>
      </section>

      <div className='max-w-5xl mx-auto px-6 py-12'>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10'
        >
          {[
            { label: 'Shipped',     value: completed,  textColor: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500',                      border: 'border-emerald-200 dark:border-emerald-800/50' },
            { label: 'In Progress', value: inProgress, textColor: 'text-blue-700 dark:text-blue-400',       dot: 'bg-blue-500',                          border: 'border-blue-200 dark:border-blue-800/50'     },
            { label: 'Planned',     value: planned,    textColor: 'text-violet-700 dark:text-violet-400',   dot: 'bg-violet-500',                        border: 'border-violet-200 dark:border-violet-800/50' },
            { label: 'Future',      value: future,     textColor: 'text-neutral-500 dark:text-neutral-400', dot: 'bg-neutral-400 dark:bg-neutral-500',   border: 'border-neutral-200 dark:border-neutral-700'  },
          ].map(({ label, value, textColor, dot, border }) => (
            <div
              key={label}
              className={`rounded-2xl border bg-white dark:bg-neutral-900 p-4 ${border}`}
            >
              <div className='flex items-center gap-1.5 mb-2'>
                <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                <span className='text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500'>
                  {label}
                </span>
              </div>
              <span className={`text-2xl font-bold ${textColor}`}>{value}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className='flex items-center gap-2 flex-wrap mb-12'
        >
          {FILTER_OPTIONS.map((opt) => {
            const isActive = activeFilter === opt.value;
            const cfg = opt.value !== 'all' ? STATUS_CONFIG[opt.value as RoadmapStatus] : null;

            return (
              <button
                key={opt.value}
                onClick={() => setActiveFilter(opt.value)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                  isActive
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-600'
                )}
              >
                {cfg && (
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full shrink-0',
                      cfg.dot
                    )}
                  />
                )}
                {opt.label}
              </button>
            );
          })}

          <span className='ml-auto text-xs text-neutral-400 dark:text-neutral-500'>
            {filtered.length}{' '}
            {filtered.length === 1 ? 'item' : 'items'}
          </span>
        </motion.div>

        <div className='relative'>
          <div className='absolute left-1/2 top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800 -translate-x-1/2 hidden md:block pointer-events-none' />
          <div className='absolute left-4 top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800 md:hidden pointer-events-none' />

          {quarters.map((quarter) => (
            <div key={quarter}>
              <QuarterLabel quarter={quarter} />
              {byQuarter[quarter].map((item, i) => {
                const side = i % 2 === 0 ? 'left' : 'right';
                return (
                  <div
                    key={item.id}
                    className='md:grid md:grid-cols-2 md:gap-0'
                  >
                    {side === 'left' ? (
                      <>
                        <RoadmapCard item={item} side='left' onClick={setSelected} />
                        <div />
                      </>
                    ) : (
                      <>
                        <div />
                        <RoadmapCard item={item} side='right' onClick={setSelected} />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          <div className='flex justify-center mt-6'>
            <div className='w-3 h-3 rounded-full bg-neutral-200 dark:bg-neutral-700 border-2 border-white dark:border-neutral-950' />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className='mt-16 text-center'
        >
          <p className='text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed'>
            Roadmap priorities shift based on user feedback.{' '}
            <a
              href='/dashboard/feature-requests'
              className='font-semibold text-neutral-700 dark:text-neutral-300 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-600 transition-colors'
            >
              Cast your vote
            </a>{' '}
            on the Feature Voting board inside Focura.
          </p>
        </motion.div>
      </div>

      {selected && (
        <DetailModal item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}