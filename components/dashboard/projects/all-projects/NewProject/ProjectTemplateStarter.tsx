'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, FolderPlus, Layers, Loader2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { catalogItemToTemplate, TEMPLATES } from '@/lib/templatesData';
import { useTemplateCatalog, useTemplateImport } from '@/hooks/useTemplates';
import TemplateTierBadge from '@/components/public/templates/TemplateTierBadge';
import {
  canAccessTemplate,
  TIER_META,
  type Template,
  type TemplateAccessTier,
} from '@/types/templates.types';

interface ProjectTemplateStarterProps {
  workspaceId: string;
  workspaceSlug: string;
  /** Workspace plan (FREE/PRO/BUSINESS/ENTERPRISE) — drives the tier gate. */
  plan?: string | null;
}

/** How many templates to surface in the horizontal strip (full list lives on /templates). */
const MAX_VISIBLE = 8;

/** Map a workspace plan onto a template access tier (ENTERPRISE ⊇ BUSINESS). */
const resolveAccessTier = (plan?: string | null): TemplateAccessTier => {
  if (plan === 'ENTERPRISE' || plan === 'BUSINESS') return 'BUSINESS';
  if (plan === 'PRO') return 'PRO';
  return 'FREE';
};

/**
 * ProjectTemplateStarter
 *
 * Rendered at the top of the New Project page so users can import a template
 * while creating, instead of having to visit the templates page first. The
 * classic blank-project form stays right below — this is an alternative, not a
 * replacement.
 *
 *   - Live catalog via useTemplateCatalog (static registry as offline fallback)
 *   - Tier-gated by the destination workspace's plan (same logic the backend
 *     import enforces), locked templates show an upgrade CTA
 *   - One click imports via POST /templates/:slug/use and deep-links to the
 *     created project
 */
const ProjectTemplateStarter = ({
  workspaceId,
  workspaceSlug,
  plan,
}: ProjectTemplateStarterProps) => {
  const router = useRouter();
  const { data: catalog, isLoading } = useTemplateCatalog();
  const importTemplate = useTemplateImport();
  const [importingSlug, setImportingSlug] = useState<string | null>(null);

  const templates: Template[] = useMemo(() => {
    const live = (catalog?.templates ?? []).map(catalogItemToTemplate);
    return live.length > 0 ? live : TEMPLATES;
  }, [catalog]);

  const available = useMemo(
    () => templates.filter((t) => t.status === 'available').slice(0, MAX_VISIBLE),
    [templates],
  );

  // While the catalog loads (or is unavailable/empty) keep the page clean —
  // the blank-project form below still works.
  if (isLoading || available.length === 0) return null;

  const handleUse = async (template: Template) => {
    if (importTemplate.isPending || importingSlug) return;
    setImportingSlug(template.slug);
    try {
      const result = await importTemplate.mutateAsync({
        slug: template.slug,
        workspaceId,
      });
      router.push(
        `/dashboard/workspaces/${result.workspaceSlug}/projects/${result.projectSlug}`,
      );
    } catch {
      // The api layer already surfaces the error toast.
    } finally {
      setImportingSlug(null);
    }
  };

  return (
    <section className='rounded-xl bg-card border border-border p-6 space-y-5'>
      {/* Header */}
      <div className='flex items-end justify-between gap-3'>
        <div className='min-w-0'>
          <h3 className='text-lg font-semibold text-foreground'>
            Start from a template
          </h3>
          <p className='text-sm text-muted-foreground mt-0.5'>
            Skip the setup — import a pre-built structure, or create a blank
            project below.
          </p>
        </div>
        <Link
          href='/templates'
          className='shrink-0 text-xs font-semibold text-primary hover:underline transition-colors'
        >
          Browse all templates
        </Link>
      </div>

      {/* Template strip */}
      <div className='flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none'>
        {available.map((template) => {
          const locked = !canAccessTemplate(resolveAccessTier(plan), template.tier);
          const busy = importingSlug === template.slug;
          const tierMeta = TIER_META[template.tier];

          return (
            <article
              key={template.id}
              className='group shrink-0 w-60 rounded-xl border border-border bg-background overflow-hidden transition-all hover:shadow-md flex flex-col'
            >
              {/* Colour strip + icon + tier */}
              <div
                className='h-1 w-full'
                style={{
                  backgroundColor: template.color,
                  opacity: locked ? 0.3 : 0.7,
                }}
              />
              <div className='p-4 flex flex-col flex-1 gap-3'>
                <div className='flex items-start justify-between gap-2'>
                  <span className='text-xl leading-none shrink-0'>
                    {template.icon}
                  </span>
                  <TemplateTierBadge tier={template.tier} locked={locked} />
                </div>

                <div className='flex-1'>
                  <h4 className='text-sm font-bold text-foreground leading-snug line-clamp-2'>
                    {template.title}
                  </h4>
                  <p className='text-[11px] text-muted-foreground mt-1 flex items-center gap-1'>
                    <Layers className='w-3 h-3 shrink-0' strokeWidth={1.8} />
                    {template.tasks.length} tasks · {template.estimatedSetupMinutes} min
                  </p>
                </div>

                {/* CTA */}
                <div className='pt-3 border-t border-border'>
                  {locked ? (
                    <div className='flex items-center justify-between gap-2'>
                      <span
                        className={cn(
                          'text-[11px] font-semibold flex items-center gap-1 min-w-0',
                          tierMeta.lockedStyle,
                        )}
                      >
                        <Lock className='w-3 h-3 shrink-0' strokeWidth={2} />
                        {template.tier === 'BUSINESS' ? 'Business' : 'Pro'} tier
                      </span>
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/workspaces/${workspaceSlug}/billing/upgrade`,
                          )
                        }
                        className='shrink-0 inline-flex items-center gap-1 text-[11px] font-bold rounded-lg px-2.5 py-1.5 bg-primary text-primary-foreground hover:opacity-90 transition-opacity'
                      >
                        Unlock <ArrowRight className='w-3 h-3 shrink-0' />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUse(template)}
                      disabled={importTemplate.isPending || !!importingSlug}
                      className='w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg px-3 py-2 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity'
                    >
                      {busy ? (
                        <Loader2 className='w-3.5 h-3.5 animate-spin' />
                      ) : (
                        <FolderPlus className='w-3.5 h-3.5 shrink-0' />
                      )}
                      {busy ? 'Importing…' : 'Use template'}
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectTemplateStarter;
