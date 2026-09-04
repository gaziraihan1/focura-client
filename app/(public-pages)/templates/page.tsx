import TemplatesPageClient from '@/components/public/templates/TemplatesPageClient';
import type { Metadata }     from 'next';

export const metadata: Metadata = {
  title      : 'Templates | Gablura',
  description: 'Pre-built project templates for engineering, product, marketing, HR, and more. Import a full project structure — tasks, labels, sections, views, and milestones — into your Gablura workspace in one click.',
  openGraph  : {
    title      : 'Gablura Templates',
    description: 'Start fast with pre-built project templates for every team. Engineering sprints, product roadmaps, content calendars, hiring pipelines, and more.',
    url        : 'https://gablura-client.vercel.app/templates',
    siteName   : 'Gablura',
    type       : 'website',
  },
  twitter    : {
    card       : 'summary_large_image',
    title      : 'Gablura Templates',
    description: 'Pre-built project templates for engineering, product, marketing, HR, startups, and personal productivity.',
  },
  alternates : {
    canonical  : 'https://gablura-client.vercel.app/templates',
  },
};

/**
 * /templates — Public page
 *
 * Pure server component — only metadata and a single client root.
 * All state (search, category filter) lives inside TemplatesPageClient.
 *
 * Component tree:
 *   TemplatesPageClient       ← 'use client' root — owns search + category + tier state
 *     TemplatesHero           ← Search input, stat pills
 *     TemplatesCategories     ← Sticky filter bar (tier + category)
 *     TemplatesGrid           ← Filtered card grid + empty state
 *       TemplateCard × N      ← Individual card: preview, tier badge, Use/Unlock/Coming-soon CTA
 *     TemplatesHowItWorks     ← 3-step explainer + what gets cloned table
 *     TemplatesForCreators    ← User-created templates roadmap + feature cards
 *     TemplatesNotifyBanner   ← Tier-value banner (why upgrade)
 *     TemplatesCTA            ← Final links: Try Gablura, Request, Guides
 *
 * Data layer:
 *   useTemplates + templateKeys ← TanStack Query hooks hitting GET /templates/catalog
 *   templates-data.ts          ← Typed Template registry (offline fallback, 9 templates)
 */
const TemplatesPage = () => {
  return <TemplatesPageClient />;
};

export default TemplatesPage;