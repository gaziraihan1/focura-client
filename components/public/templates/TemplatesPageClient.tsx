'use client';

import { useMemo, useState } from 'react';
import TemplatesHero          from './TemplatesHero';
import TemplatesCategories    from './TemplatesCategories';
import TemplatesGrid          from './TemplatesGrid';
import TemplatesHowItWorks    from './TemplateshowItWorks';
import TemplatesForCreators   from './TemplatesForCreators';
import TemplatesNotifyBanner  from './TemplatesNotifyBanner';
import TemplatesCTA           from './TemplatesCTA';
import TemplateImportModal    from './TemplateImportModal';
import TemplatesFeatured       from './TemplatesFeatured';
import { CategoryFilter, TierFilter, catalogItemToTemplate, TEMPLATES } from '@/lib/templatesData';
import { useTemplateCatalog, useTemplateRate } from '@/hooks/useTemplates';
import { useIsAuthenticated } from '@/hooks/useUser';
import { useWorkspaces }      from '@/hooks/useWorkspaceQueries';
import { useRouter }          from 'next/navigation';
import { Loader2 }            from 'lucide-react';
import type { Template, TemplateAccessTier } from '@/types/templates.types';

/**
 * TemplatesPageClient
 *
 * Single 'use client' root for the templates page.
 *   - Fetches the live catalog from GET /api/v1/templates/catalog
 *   - Owns search / category / tier filter state
 *   - Opens the import modal for unlocked templates
 *   - Routes upgrade CTAs to the workspace billing upgrade page
 */
const TemplatesPageClient = () => {
  const router = useRouter();
  const { data: catalog, isLoading } = useTemplateCatalog();
  const rateMutation = useTemplateRate();
  const { isAuthenticated } = useIsAuthenticated();
  // Gate on auth so the protected /workspaces call never fires for logged-out
  // visitors — public pages must not surface "Authentication required" errors.
  const { data: workspaces = [] } = useWorkspaces({ enabled: isAuthenticated });

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [tier, setTier] = useState<TierFilter>('all');
  const [importing, setImporting] = useState<Template | null>(null);

  // Live catalog (backend) with static TEMPLATES as an offline fallback.
  const templates: Template[] = useMemo(() => {
    const live = (catalog?.templates ?? []).map(catalogItemToTemplate);
    return live.length > 0 ? live : TEMPLATES;
  }, [catalog]);

  const accessTier: TemplateAccessTier = catalog?.access?.tier ?? 'FREE';

  // Curated strip at the top of the gallery — sorted inside TemplatesFeatured.
  const featured: Template[] = useMemo(
    () => templates.filter((t) => t.featured),
    [templates],
  );

  const handleRate = (template: Template, stars: number) => {
    rateMutation.mutate({ slug: template.slug, stars });
  };

  const handleUpgrade = () => {
    // Upgrade CTA → workspace billing upgrade page; fall back to pricing.
    if (isAuthenticated && workspaces.length > 0) {
      router.push(`/dashboard/workspaces/${workspaces[0].slug}/billing/upgrade`);
    } else {
      router.push('/pricing');
    }
  };

  return (
    <div className='min-h-screen bg-white dark:bg-neutral-950'>
      <TemplatesHero onSearch={setSearch} />

      {isLoading ? (
        <section className='max-w-6xl mx-auto px-6 py-16 flex flex-col items-center justify-center gap-3 text-neutral-400 dark:text-neutral-500'>
          <Loader2 className='w-6 h-6 animate-spin' />
          <p className='text-xs font-semibold'>Loading the template catalog…</p>
        </section>
      ) : (
        <>
          <TemplatesCategories
            active={category}
            onChange={setCategory}
            activeTier={tier}
            onTierChange={setTier}
            templates={templates}
          />

          <section className='max-w-6xl mx-auto px-6 py-12'>
            <TemplatesFeatured
              templates={featured}
              accessTier={accessTier}
              onUse={setImporting}
              onUpgrade={handleUpgrade}
              onRate={handleRate}
              ratePending={rateMutation.isPending}
            />
            <TemplatesGrid
              templates={templates}
              category={category}
              tier={tier}
              search={search}
              accessTier={accessTier}
              onUse={setImporting}
              onUpgrade={handleUpgrade}
              onRate={handleRate}
              ratePending={rateMutation.isPending}
            />
          </section>
        </>
      )}

      <TemplatesHowItWorks />
      <TemplatesForCreators />
      <TemplatesNotifyBanner />
      <TemplatesCTA />

      {importing && (
        <TemplateImportModal
          template={importing}
          accessTier={accessTier}
          onClose={() => setImporting(null)}
        />
      )}
    </div>
  );
};

export default TemplatesPageClient;
