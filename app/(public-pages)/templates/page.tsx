import TemplatesPageClient from '@/components/Templates/TemplatesPageClient';
import type { Metadata }     from 'next';

export const metadata: Metadata = {
  title      : 'Templates | Focura',
  description: 'Pre-built project templates for engineering, product, marketing, HR, and more. Import a full project structure — tasks, labels, sections, views, and milestones — into your Focura workspace in one click.',
  openGraph  : {
    title      : 'Focura Templates',
    description: 'Start fast with pre-built project templates for every team. Engineering sprints, product roadmaps, content calendars, hiring pipelines, and more.',
    url        : 'https://focura-client.vercel.app/templates',
    siteName   : 'Focura',
    type       : 'website',
  },
  twitter    : {
    card       : 'summary_large_image',
    title      : 'Focura Templates',
    description: 'Pre-built project templates for engineering, product, marketing, HR, startups, and personal productivity.',
  },
  alternates : {
    canonical  : 'https://focura-client.vercel.app/templates',
  },
};

/**
 * /templates — Public page
 *
 * Pure server component — only metadata and a single client root.
 * All state (search, category filter) lives inside TemplatesPageClient.
 *
 * Component tree:
 *   TemplatesPageClient       ← 'use client' root — owns search + category state
 *     TemplatesHero           ← Search input, stat pills
 *     TemplatesCategories     ← Sticky horizontal category filter bar
 *     TemplatesGrid           ← Filtered card grid + empty state
 *       TemplateCard × N      ← Individual card: preview, tags, notify CTA
 *     TemplatesHowItWorks     ← 3-step explainer + what gets cloned table
 *     TemplatesForCreators    ← User-created templates roadmap + feature cards
 *     TemplatesNotifyBanner   ← Email waitlist signup form
 *     TemplatesCTA            ← Final links: Try Focura, Request, Guides
 *
 * Data layer:
 *   templates-data.ts         ← Typed Template registry (9 templates, 8 categories)
 */
const TemplatesPage = () => {
  return <TemplatesPageClient />;
};

export default TemplatesPage;