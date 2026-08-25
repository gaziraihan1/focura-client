'use client';

import { HelpCategories } from '@/components/docs/help/HelpCategories';
import { HelpContactCard } from '@/components/docs/help/HelpContactCard';
import { HelpFAQ } from '@/components/docs/help/HelpFaq';
import { HelpFeaturesGuide } from '@/components/docs/help/HelpFeaturesGuide';
import { HelpGettingStarted } from '@/components/docs/help/HelpGettingStarted';
import { HelpHero } from '@/components/docs/help/HelpHero';
import { HelpSearchResults } from '@/components/docs/help/HelpSearchResults';
import { useState }          from 'react';

const scrollToCategory = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};
const HelpContent = () => {
  const [query, setQuery] = useState('');

  return (
    <div className='min-h-screen bg-white dark:bg-neutral-950'>
      {/* Hero is always visible — owns the search input */}
      <HelpHero onSearch={setQuery} />

      {query.trim() ? (
        /* ── Search mode ───────────────────────────────────────────────────── */
        <HelpSearchResults query={query} />
      ) : (
        /* ── Browse mode ───────────────────────────────────────────────────── */
        <>
          <HelpCategories onCategoryClick={scrollToCategory} />
          <HelpGettingStarted />
          <HelpFeaturesGuide />
          <HelpFAQ />
          <HelpContactCard />
        </>
      )}
    </div>
  );
};

export default HelpContent;
