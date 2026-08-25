'use client';

import Link from 'next/link';
import { Crown, Sparkles, ArrowRight } from 'lucide-react';

/**
 * TemplatesNotifyBanner — renamed purpose: now a tier-value banner.
 * Explains the Free / Pro / Business template tiers and funnels visitors
 * to the pricing page (or workspace billing for logged-in users).
 */
const TemplatesNotifyBanner = () => {
  return (
    <section className='border-t border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/20'>
      <div className='max-w-4xl mx-auto px-6 py-16 md:py-20'>
        <div className='rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden relative'>
          {/* Subtle grid */}
          <div
            className='absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none'
            style={{
              backgroundImage: `linear-gradient(var(--color-neutral-900,#171717) 1px,transparent 1px),
                linear-gradient(90deg,var(--color-neutral-900,#171717) 1px,transparent 1px)`,
              backgroundSize: '28px 28px',
            }}
          />

          <div className='relative px-8 py-12 md:px-14 md:py-14 text-center'>
            {/* Icon */}
            <div className='w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center mx-auto mb-6'>
              <Sparkles className='w-6 h-6 text-violet-600 dark:text-violet-400' strokeWidth={1.8} />
            </div>

            <h2 className='text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-4'>
              Every plan starts with free templates.
            </h2>

            <p className='text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed mb-8'>
              Free templates are included with every plan. Upgrade to Pro for the
              full engineering, product, marketing, and HR catalog — and Business
              unlocks flagship launch checklists for teams shipping at scale.
            </p>

            {/* Tier cards */}
            <div className='grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8 text-left'>
              {[
                { tier: 'Free', desc: '2 starter templates included with every plan', style: 'border-emerald-200 dark:border-emerald-800/50', chip: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400' },
                { tier: 'Pro', desc: '9 templates — sprint boards, roadmaps, pipelines & more', style: 'border-violet-200 dark:border-violet-800/50', chip: 'bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400' },
                { tier: 'Business', desc: '1 flagship launch checklist + everything in Pro', style: 'border-amber-200 dark:border-amber-800/50', chip: 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400' },
              ].map(({ tier, desc, style, chip }) => (
                <div key={tier} className={`rounded-2xl border bg-white dark:bg-neutral-900 p-4 ${style}`}>
                  <div className='flex items-center gap-1.5 mb-2'>
                    <Crown className='w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400' strokeWidth={2} />
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5 ${chip}`}>
                      {tier}
                    </span>
                  </div>
                  <p className='text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed'>{desc}</p>
                </div>
              ))}
            </div>

            <Link
              href='/pricing'
              className='inline-flex items-center gap-2 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 rounded-xl px-6 py-3 text-sm font-bold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors'
            >
              Compare plans <ArrowRight className='w-4 h-4' />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TemplatesNotifyBanner;
