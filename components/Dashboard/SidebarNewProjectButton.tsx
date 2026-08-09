'use client';

import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  FolderPlus,
  Layers,
  Loader2,
  Lock,
  Plus,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { catalogItemToTemplate, TEMPLATES } from '@/lib/templatesData';
import { useTemplateCatalog, useTemplateImport } from '@/hooks/useTemplates';
import { useWorkspaces } from '@/hooks/useWorkspaceQueries';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import TemplateTierBadge from '@/components/Templates/TemplateTierBadge';
import {
  canAccessTemplate,
  TIER_META,
  type Template,
  type TemplateAccessTier,
} from '@/types/templates.types';

/** How many templates to surface in the quick-picker grid. */
const MAX_TEMPLATES = 8;

/** Map a workspace plan onto a template access tier (ENTERPRISE ⊇ BUSINESS). */
const resolveAccessTier = (plan?: string | null): TemplateAccessTier => {
  if (plan === 'ENTERPRISE' || plan === 'BUSINESS') return 'BUSINESS';
  if (plan === 'PRO') return 'PRO';
  return 'FREE';
};

/**
 * SidebarNewProjectButton
 *
 * A one-click "New project" entry point in the dashboard sidebar. Opens a
 * quick-picker modal that shows the live template catalog (tier-gated by the
 * selected destination workspace's plan) plus a "Start blank" path to the
 * regular New Project page.
 */
const SidebarNewProjectButton = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [workspaceId, setWorkspaceId] = useState('');
  const [importingSlug, setImportingSlug] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const trapRef = useFocusTrap(open);

  // Close on Escape
  const onEscape = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === 'Escape') close();
  });
  useEffect(() => {
    if (!open) return;
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [open]);

  const { data: workspaces = [], isLoading: workspacesLoading } = useWorkspaces();
  const { data: catalog, isLoading: catalogLoading } = useTemplateCatalog();
  const importTemplate = useTemplateImport();

  const templates: Template[] = useMemo(() => {
    const live = (catalog?.templates ?? []).map(catalogItemToTemplate);
    return live.length > 0 ? live : TEMPLATES;
  }, [catalog]);

  const available = useMemo(
    () => templates.filter((t) => t.status === 'available').slice(0, MAX_TEMPLATES),
    [templates],
  );

  const effectiveWorkspaceId = workspaceId || workspaces[0]?.id || '';
  const selectedWorkspace = workspaces.find((w) => w.id === effectiveWorkspaceId);

  const close = () => setOpen(false);

  const handleUse = async (template: Template) => {
    if (!selectedWorkspace || importTemplate.isPending || importingSlug) return;
    setImportingSlug(template.slug);
    try {
      const result = await importTemplate.mutateAsync({
        slug: template.slug,
        workspaceId: selectedWorkspace.id,
      });
      close();
      router.push(
        `/dashboard/workspaces/${result.workspaceSlug}/projects/${result.projectSlug}`,
      );
    } catch {
      // The api layer already surfaces the error toast.
    } finally {
      setImportingSlug(null);
    }
  };

  const handleBlank = () => {
    close();
    if (selectedWorkspace) {
      router.push(`/dashboard/workspaces/${selectedWorkspace.slug}/projects/new-project`);
    } else {
      router.push('/dashboard/workspaces');
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold border border-sidebar-border bg-sidebar-accent/40 text-sidebar-foreground hover:bg-sidebar-accent/70 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      >
        <FolderPlus className='text-sidebar-primary' size={17} strokeWidth={2} />
        <span>New project</span>
        <span className='ml-auto inline-flex items-center justify-center w-5 h-5 rounded-md bg-sidebar-accent text-sidebar-foreground'>
          <Plus size={13} strokeWidth={2.5} />
        </span>
      </button>

      {open && (
        <div
          ref={(node) => {
            modalRef.current = node;
            trapRef.current = node;
          }}
          className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4'
          role='dialog'
          aria-modal='true'
          aria-label='New project'
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className='w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
            {/* Header */}
            <div className='flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-border'>
              <div className='min-w-0'>
                <h2 className='text-base font-bold text-foreground'>New project</h2>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  Start from a template, or create a blank project.
                </p>
              </div>
              <button
                onClick={close}
                aria-label='Close'
                className='shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors'
              >
                <X className='w-4 h-4' />
              </button>
            </div>

            <div className='px-5 py-4 space-y-5 max-h-[70vh] overflow-y-auto'>
              {/* Workspace picker */}
              <div>
                <label className='block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5'>
                  Destination workspace
                </label>
                {workspacesLoading ? (
                  <div className='flex items-center gap-2 text-xs text-muted-foreground py-2'>
                    <Loader2 className='w-3.5 h-3.5 animate-spin' /> Loading workspaces…
                  </div>
                ) : workspaces.length === 0 ? (
                  <Link
                    href='/dashboard/workspaces/new-workspace'
                    className='text-xs font-semibold text-primary hover:underline'
                  >
                    Create a workspace to get started
                  </Link>
                ) : (
                  <select
                    aria-label='Destination workspace'
                    value={effectiveWorkspaceId}
                    onChange={(e) => setWorkspaceId(e.target.value)}
                    className='w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-shadow'
                  >
                    {workspaces.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Template grid */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                    From a template
                  </p>
                  <Link
                    href='/templates'
                    className='text-[11px] font-semibold text-primary hover:underline'
                  >
                    Browse all
                  </Link>
                </div>

                {catalogLoading ? (
                  <div className='flex items-center justify-center gap-2 text-xs text-muted-foreground py-6'>
                    <Loader2 className='w-4 h-4 animate-spin' /> Loading templates…
                  </div>
                ) : available.length === 0 ? (
                  <p className='text-xs text-muted-foreground py-4 text-center'>
                    No templates available right now.
                  </p>
                ) : (
                  <div className='grid sm:grid-cols-2 gap-2'>
                    {available.map((template) => {
                      const locked = !canAccessTemplate(
                        resolveAccessTier(selectedWorkspace?.plan),
                        template.tier,
                      );
                      const busy = importingSlug === template.slug;
                      const tierMeta = TIER_META[template.tier];

                      return (
                        <div
                          key={template.id}
                          className='rounded-xl border border-border bg-background p-3 space-y-2'
                        >
                          <div className='flex items-start justify-between gap-2'>
                            <span className='text-lg leading-none shrink-0'>
                              {template.icon}
                            </span>
                            <TemplateTierBadge tier={template.tier} locked={locked} />
                          </div>
                          <div>
                            <p className='text-[13px] font-bold text-foreground leading-snug line-clamp-2'>
                              {template.title}
                            </p>
                            <p className='text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1'>
                              <Layers className='w-3 h-3 shrink-0' strokeWidth={1.8} />
                              {template.tasks.length} tasks
                            </p>
                          </div>
                          {locked ? (
                            <div className='flex items-center justify-between gap-2 pt-1'>
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
                                  selectedWorkspace &&
                                  router.push(
                                    `/dashboard/workspaces/${selectedWorkspace.slug}/billing/upgrade`,
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
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className='px-5 py-4 border-t border-border flex items-center justify-between gap-3'>
              <p className='text-[11px] text-muted-foreground'>
                Templates import into your workspace instantly.
              </p>
              <button
                onClick={handleBlank}
                className='shrink-0 inline-flex items-center gap-1.5 text-xs font-bold rounded-xl px-4 py-2 bg-accent text-foreground hover:bg-accent/70 transition-colors'
              >
                Start blank <ArrowRight className='w-3.5 h-3.5 shrink-0' />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarNewProjectButton;
