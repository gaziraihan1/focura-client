import { CareersHero } from '@/components/Careers/CareersHero';
import CareersJobList from '@/components/Careers/CareersJobList';
import { CareersValues } from '@/components/Careers/CareersValues';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title      : 'Careers | Focura',
  description: 'Join the Focura team. We are building the productivity platform for focused teams. See open roles and learn what it is like to work here.',
  openGraph  : {
    title      : 'Careers at Focura',
    description: 'Build the future of focused work. See our open roles.',
    url        : 'https://focura-client.vercel.app/careers',
    siteName   : 'Focura',
    type       : 'website',
  },
};

// Fetch open job count server-side for the hero badge
async function getOpenCount(): Promise<number> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/jobs?limit=1`,
      { next: { revalidate: 60 } } // revalidate every 60 s
    );
    if (!res.ok) return 0;
    const data = await res.json();
    return data.pagination?.total ?? 0;
  } catch {
    return 0;
  }
}

/**
 * /careers — Public page
 *
 * Sections:
 * 1. CareersHero   — headline, culture pills, open count (SSR)
 * 2. CareersValues — 6 culture/values cards
 * 3. CareersJobList — client: fetches jobs, filters, renders cards + apply modal
 */
const CareersPage = async () => {
  const openCount = await getOpenCount();

  return (
    <div className='min-h-screen bg-white dark:bg-neutral-950'>
      <CareersHero openCount={openCount} />

      <CareersValues />

      {/* Open roles */}
      <section id='open-roles' className='border-t border-neutral-100 dark:border-neutral-800/60'>
        <div className='max-w-4xl mx-auto px-6 py-16 md:py-20'>
          <div className='mb-8'>
            <p className='text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3'>
              Open Roles
            </p>
            <h2 className='text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50'>
              {openCount > 0
                ? `${openCount} open ${openCount === 1 ? 'position' : 'positions'}`
                : 'Current openings'}
            </h2>
          </div>

          <CareersJobList />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className='border-t border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/20'>
        <div className='max-w-3xl mx-auto px-6 py-16 text-center'>
          <h2 className='text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3'>
            Don&apos;t see the right role?
          </h2>
          <p className='text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6 max-w-md mx-auto'>
            We occasionally hire for roles we haven&apos;t listed yet. If you&apos;re
            exceptional at what you do and think you&apos;d be a great fit for Focura,
            we&apos;d love to hear from you.
          </p>
          <a
            href='mailto:focurabusiness@gmail.com?subject=General Application — Focura'
            className='inline-flex items-center gap-2 rounded-xl bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 text-sm font-bold px-5 py-3 hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors'
          >
            Send a general application
          </a>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;