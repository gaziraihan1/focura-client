import type { Metadata } from 'next';
import { ReviewsHero } from '@/components/public/reviews/ReviewsHero';
import { ReviewsContent } from '@/components/public/reviews/ReviewsContent';

export const metadata: Metadata = {
  title: 'Reviews | Gablura',
  description:
    'See what users think about Gablura — the productivity platform that helps teams stay focused, organized, and on track.',
  keywords: [
    'gablura reviews',
    'gablura ratings',
    'productivity app reviews',
    'team collaboration reviews',
  ],
  openGraph: {
    title: 'Gablura Reviews – What Our Users Say',
    description:
      'Real reviews from real users. See how Gablura helps teams stay focused and productive.',
    url: 'https://gablura-client.vercel.app/reviews',
    siteName: 'Gablura',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gablura Reviews – What Our Users Say',
    description:
      'Real reviews from real users. See how Gablura helps teams stay focused and productive.',
  },
  alternates: {
    canonical: 'https://gablura-client.vercel.app/reviews',
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
