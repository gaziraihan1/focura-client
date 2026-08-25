import { Briefcase, ArrowDown } from 'lucide-react';

interface CareersHeroProps {
  openCount: number;
}

export const CareersHero = ({ openCount }: CareersHeroProps) => {
  return (
    <section className='relative bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 overflow-hidden'>
      {/* Grid texture */}
      <div
        className='absolute inset-0 opacity-[0.03] dark:opacity-[0.06]'
        style={{
          backgroundImage: `linear-gradient(var(--color-neutral-900,#171717) 1px,transparent 1px),
            linear-gradient(90deg,var(--color-neutral-900,#171717) 1px,transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-150 h-52 bg-violet-400/5 dark:bg-violet-300/5 rounded-full blur-3xl pointer-events-none' />

      <div className='relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center'>
        {/* Badge */}
        <div className='inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-8 shadow-sm'>
          <Briefcase className='w-3.5 h-3.5 text-violet-500' />
          We&apos;re hiring
          {openCount > 0 && (
            <>
              <span className='text-neutral-300 dark:text-neutral-600'>·</span>
              <span className='font-bold text-neutral-700 dark:text-neutral-300'>
                {openCount} open {openCount === 1 ? 'role' : 'roles'}
              </span>
            </>
          )}
        </div>

        <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-5 leading-[1.08]'>
          Build the future of
          <br />
          <span className='text-neutral-400 dark:text-neutral-500'>focused work.</span>
        </h1>

        <p className='text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10'>
          Focura is a small, ambitious team building the productivity platform we
          always wished existed. If you care deeply about craftsmanship, user
          experience, and making real teams more effective — we&apos;d love to meet you.
        </p>

        {/* Meta pills */}
        <div className='flex flex-wrap items-center justify-center gap-3 mb-12'>
          {[
            { dot: 'bg-emerald-500', label: 'Remote-first culture' },
            { dot: 'bg-blue-500',    label: 'Async-friendly' },
            { dot: 'bg-violet-500',  label: 'Small, focused team' },
            { dot: 'bg-amber-500',   label: 'Real ownership' },
          ].map(({ dot, label }) => (
            <span
              key={label}
              className='inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full px-3 py-1.5'
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
              {label}
            </span>
          ))}
        </div>

        {openCount > 0 && (
          <a
            href='#open-roles'
            className='inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors'
          >
            See open roles
            <ArrowDown className='w-4 h-4 shrink-0' strokeWidth={2} />
          </a>
        )}
      </div>
    </section>
  );
};