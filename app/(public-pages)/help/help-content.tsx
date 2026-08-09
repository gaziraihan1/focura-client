'use client';

import { HelpCategories } from '@/components/Help/HelpCategories';
import { HelpContactCard } from '@/components/Help/HelpContactCard';
import { HelpFAQ } from '@/components/Help/HelpFaq';
import { HelpFeaturesGuide } from '@/components/Help/HelpFeaturesGuide';
import { HelpGettingStarted } from '@/components/Help/HelpGettingStarted';
import { HelpHero } from '@/components/Help/HelpHero';
import { HelpSearchResults } from '@/components/Help/HelpSearchResults';
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
