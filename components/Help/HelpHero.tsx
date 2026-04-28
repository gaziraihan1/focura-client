'use client';

import { useState }       from 'react';
import { Search, Zap }    from 'lucide-react';

interface HelpHeroProps {
  onSearch: (q: string) => void;
}

const quickLinks = [
  'Getting started',
  'Create a task',
  'Invite team members',
  'Kanban board',
  'Focus sessions',
  'Billing & plans',
  'Reset password',
  'File uploads',
];

export const HelpHero = ({ onSearch }: HelpHeroProps) => {
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
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-150 h-48 bg-blue-400/5 dark:bg-blue-300/5 rounded-full blur-3xl pointer-events-none' />

      <div className='relative max-w-3xl mx-auto px-6 py-16 md:py-24 text-center'>
        {/* Badge */}
        <div className='inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-6 shadow-sm'>
          <Zap className='w-3.5 h-3.5 text-blue-500' />
          Focura Help Center
        </div>

        <h1 className='text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-3'>
          How can we help?
        </h1>
        <p className='text-base text-neutral-500 dark:text-neutral-400 mb-8'>
          Search guides, answers, and documentation for every feature in Focura.
        </p>

        {/* Search */}
        <div className='relative max-w-xl mx-auto mb-7'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400 dark:text-neutral-500 shrink-0 pointer-events-none' strokeWidth={1.8} />
          <input
            type='search'
            placeholder='Search for anything…'
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            className='w-full pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 shadow-sm outline-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700 transition-colors'
          />
        </div>

        {/* Quick links */}
        <div className='flex flex-wrap justify-center gap-2'>
          {quickLinks.map((l) => (
            <button
              key={l}
              onClick={() => handleChange(l)}
              className='text-xs font-medium rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 px-3 py-1.5 hover:border-neutral-400 dark:hover:border-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors'
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};