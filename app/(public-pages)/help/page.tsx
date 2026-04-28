'use client';

import { HelpCategories } from '@/components/Help/HelpCategories';
import { HelpContactCard } from '@/components/Help/HelpContactCard';
import { HelpFAQ } from '@/components/Help/HelpFaq';
import { HelpFeaturesGuide } from '@/components/Help/HelpFeaturesGuide';
import { HelpGettingStarted } from '@/components/Help/HelpGettingStarted';
import { HelpHero } from '@/components/Help/HelpHero';
import { HelpSearchResults } from '@/components/Help/HelpSearchResults';
import { useState }          from 'react';

/**
 * HelpPageClient
 *
 * Owns the search query state. When the user types, only
 * HelpSearchResults is shown. When empty, the full guide
 * (Categories → Getting Started → Feature Guide → FAQ → Contact)
 * is rendered.
 *
 * This is a single client root so the server page itself stays
 * a pure server component with metadata.
 */
const HelpPage = () => {
  const [query, setQuery] = useState('');

  const scrollToCategory = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

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

export default HelpPage;