'use client';

import { useState }           from 'react';
import TemplatesHero          from './TemplatesHero';
import TemplatesCategories    from './TemplatesCategories';
import TemplatesGrid          from './TemplatesGrid';
import TemplatesHowItWorks    from './TemplateshowItWorks';
import TemplatesForCreators   from './TemplatesForCreators';
import TemplatesNotifyBanner  from './TemplatesNotifyBanner';
import TemplatesCTA           from './TemplatesCTA';
import { CategoryFilter } from '@/lib/templatesData';

/**
 * TemplatesPageClient
 *
 * Single 'use client' root for the templates page.
 * Owns:
 *   - search query state (passed down to hero + grid)
 *   - category filter state (passed down to category bar + grid)
 *
 * All heavy content sections (HowItWorks, ForCreators, etc.) are
 * plain React components with no client state — they could be RSCs.
 */
const TemplatesPageClient = () => {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');

  return (
    <div className='min-h-screen bg-white dark:bg-neutral-950'>
      {/* Search-aware hero */}
      <TemplatesHero onSearch={setSearch} />

      {/* Sticky category filter */}
      <TemplatesCategories active={category} onChange={setCategory} />

      {/* Main grid */}
      <section className='max-w-6xl mx-auto px-6 py-12'>
        <TemplatesGrid category={category} search={search} />
      </section>

      {/* Informational sections */}
      <TemplatesHowItWorks />
      <TemplatesForCreators />
      <TemplatesNotifyBanner />
      <TemplatesCTA />
    </div>
  );
};

export default TemplatesPageClient;