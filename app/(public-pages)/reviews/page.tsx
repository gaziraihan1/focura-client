import type { Metadata } from 'next';
import { ReviewsHero } from '@/components/public/reviews/ReviewsHero';
import { ReviewsContent } from '@/components/public/reviews/ReviewsContent';

export const metadata: Metadata = {
  title: 'Reviews | Focura',
  description:
    'See what users think about Focura — the productivity platform that helps teams stay focused, organized, and on track.',
  keywords: [
    'focura reviews',
    'focura ratings',
    'productivity app reviews',
    'team collaboration reviews',
  ],
  openGraph: {
    title: 'Focura Reviews – What Our Users Say',
    description:
      'Real reviews from real users. See how Focura helps teams stay focused and productive.',
    url: 'https://focura-client.vercel.app/reviews',
    siteName: 'Focura',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Focura Reviews – What Our Users Say',
    description:
      'Real reviews from real users. See how Focura helps teams stay focused and productive.',
  },
  alternates: {
    canonical: 'https://focura-client.vercel.app/reviews',
  },
};

/**
 * /reviews — Public page
 *
 * Sections:
 * 1. ReviewsHero    — headline, meta, quick stats (average + count)
 * 2. ReviewsContent — RatingSection (stats, form, list)
 */
export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-background">
      <ReviewsHero />
      <ReviewsContent />
    </div>
  );
}
