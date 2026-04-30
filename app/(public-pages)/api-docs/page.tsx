'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X }                from 'lucide-react';
import { API_SECTIONS } from '@/lib/apiData';
import { ApiDocsHero } from '@/components/ApiDocs/ApiDocsHero';
import { ApiDocsSidebar } from '@/components/ApiDocs/ApiDocsSidebar';
import { ApiDocsAuthentication } from '@/components/ApiDocs/ApiDocsAuthentication';
import { ApiDocsRateLimit } from '@/components/ApiDocs/ApiDocsRateLimit';
import { ApiDocsSSE } from '@/components/ApiDocs/ApiDocsSSE';
import { ApiDocsErrors } from '@/components/ApiDocs/ApiDocsError';
import { ApiDocsSection } from '@/components/ApiDocs/ApiDocsSection';

const OVERVIEW_IDS = [
  'authentication-guide',
  'rate-limits',
  'sse-guide',
  'errors',
];

const ApiDocsPageClient = () => {
  const [activeSection,   setActiveSection]   = useState('authentication-guide');
  const [activeEndpoint,  setActiveEndpoint]  = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // ── IntersectionObserver: track active section as user scrolls ──────────────
  useEffect(() => {
    const allIds = [
      ...OVERVIEW_IDS,
      ...API_SECTIONS.map((s) => s.id),
      ...API_SECTIONS.flatMap((s) => s.endpoints.map((e) => e.id)),
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the first intersecting entry
        const visible = entries.find((e) => e.isIntersecting);
        if (!visible) return;

        const id = visible.target.id;

        // Check if it's an endpoint ID
        for (const section of API_SECTIONS) {
          const ep = section.endpoints.find((e) => e.id === id);
          if (ep) {
            setActiveSection(section.id);
            setActiveEndpoint(ep.id);
            return;
          }
        }

        // Otherwise it's a section / overview ID
        setActiveSection(id);
        setActiveEndpoint('');
      },
      { rootMargin: '-15% 0px -75% 0px', threshold: 0 }
    );

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // ── Smooth scroll helper ────────────────────────────────────────────────────
  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: 'smooth' });
    setMobileSidebarOpen(false);
  }, []);

  const handleSectionClick  = (id: string) => { setActiveSection(id); scrollToId(id); };
  const handleEndpointClick = (_: string, epId: string) => { setActiveEndpoint(epId); scrollToId(epId); };

  return (
    <div className='min-h-screen bg-white dark:bg-neutral-950'>
      {/* Hero */}
      <ApiDocsHero />

      {/* Mobile sidebar toggle */}
      <div className='lg:hidden sticky top-16 z-40 flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm'>
        <p className='text-sm font-semibold text-neutral-700 dark:text-neutral-300'>
          API Reference
        </p>
        <button
          onClick={() => setMobileSidebarOpen((v) => !v)}
          className='w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
        >
          {mobileSidebarOpen ? <X className='w-4 h-4' /> : <Menu className='w-4 h-4' />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className='lg:hidden fixed inset-0 z-50 flex'>
          <div
            className='flex-1 bg-neutral-900/50 dark:bg-neutral-950/60 backdrop-blur-sm'
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className='w-72 h-full bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 overflow-y-auto p-4 mt-16'>
            <ApiDocsSidebar
              activeSection={activeSection}
              activeEndpoint={activeEndpoint}
              onSectionClick={handleSectionClick}
              onEndpointClick={handleEndpointClick}
            />
          </div>
        </div>
      )}

      {/* Body layout */}
      <div className='max-w-7xl mx-auto flex'>

        {/* ── Desktop sidebar ──────────────────────────────────────────────── */}
        <aside className='hidden lg:block w-56 xl:w-64 shrink-0 border-r border-neutral-100 dark:border-neutral-800/60 px-4 py-8'>
          <ApiDocsSidebar
            activeSection={activeSection}
            activeEndpoint={activeEndpoint}
            onSectionClick={handleSectionClick}
            onEndpointClick={handleEndpointClick}
          />
        </aside>

        {/* ── Main content ──────────────────────────────────────────────────── */}
        <main ref={contentRef} className='flex-1 min-w-0 px-6 lg:px-10 py-10 space-y-16'>

          {/* Overview sections */}
          <ApiDocsAuthentication />
          <div className='border-t border-neutral-100 dark:border-neutral-800' />
          <ApiDocsRateLimit />
          <div className='border-t border-neutral-100 dark:border-neutral-800' />
          <ApiDocsSSE />
          <div className='border-t border-neutral-100 dark:border-neutral-800' />
          <ApiDocsErrors />

          {/* Endpoint sections */}
          {API_SECTIONS.map((section, i) => (
            <div key={section.id}>
              <div className='border-t border-neutral-100 dark:border-neutral-800 mb-16' />
              <ApiDocsSection
                section={section}
                firstOpen={i === 0}
              />
            </div>
          ))}

          {/* Footer CTA */}
          <div className='border-t border-neutral-100 dark:border-neutral-800 pt-10'>
            <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 p-8 text-center'>
              <p className='text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2'>
                Missing something?
              </p>
              <p className='text-sm text-neutral-500 dark:text-neutral-400 mb-5 max-w-md mx-auto leading-relaxed'>
                If you need an endpoint that isn&apos;t documented here or you found
                an issue with the docs, let us know.
              </p>
              <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
                <a
                  href='/contact'
                  className='inline-flex items-center gap-2 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors'
                >
                  Contact support
                </a>
                <a
                  href='https://github.com/gaziraihan1/focura-backend/issues'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors'
                >
                  Open a GitHub issue
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApiDocsPageClient;