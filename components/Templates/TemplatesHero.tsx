'use client';

import { useState }    from 'react';
import { Search, Layers } from 'lucide-react';

interface TemplatesHeroProps {
  onSearch: (q: string) => void;
}

const TemplatesHero = ({ onSearch }: TemplatesHeroProps) => {
  const [query, setQuery] = useState('');

  const handleChange = (v: string) => {
    setQuery(v);
    onSearch(v);
  };

  return (
    <section className='relative bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 overflow-hidden'>
      {/* Grid texture */}
      <div
        className='absolute inset-0 opacity-[0.03] dark:opacity-[0.06]'
        style={{
          backgroundImage: `linear-gradient(var(--color-neutral-900,#171717) 1px,transparent 1px),
            linear-gradient(90deg,var(--color-neutral-900,#171717) 1px,transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-150 h-52 bg-violet-400/5 dark:bg-violet-300/5 rounded-full blur-3xl pointer-events-none' />

      <div className='relative max-w-5xl mx-auto px-6 py-16 md:py-24 text-center'>
        {/* Badge */}
        <div className='inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-7 shadow-sm'>
          <Layers className='w-3.5 h-3.5 text-violet-500' />
          Project Templates — Coming Soon
        </div>

        <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-5 leading-[1.07]'>
          Start fast.
          <br />
          <span className='text-neutral-400 dark:text-neutral-500'>
            Ship with confidence.
          </span>
        </h1>

        <p className='text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-9'>
          Pre-built project templates for engineering teams, product managers,
          marketers, and more. One click to import the full structure — tasks,
          labels, sections, views, and milestones — into your Focura workspace.
        </p>

        {/* Search */}
        <div className='relative max-w-lg mx-auto mb-8'>
          <Search
            className='absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400 dark:text-neutral-500 shrink-0 pointer-events-none'
            strokeWidth={1.8}
          />
          <input
            type='search'
            placeholder='Search templates by name, category, or tag…'
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            className='w-full pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 shadow-sm outline-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700 transition-colors'
          />
        </div>

        {/* Stat pills */}
        <div className='flex flex-wrap items-center justify-center gap-3'>
          {[
            { value: '8',   label: 'Categories'         },
            { value: '9+',  label: 'Templates planned'   },
            { value: '1',   label: 'Click to import'     },
            { value: '100%', label: 'Free for all plans' },
          ].map(({ value, label }) => (
            <div
              key={label}
              className='inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2 text-xs shadow-sm'
            >
              <span className='font-bold text-neutral-900 dark:text-neutral-100'>
                {value}
              </span>
              <span className='text-neutral-400 dark:text-neutral-500'>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplatesHero;