'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, X, FolderPlus, ArrowRight, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkspaces } from '@/hooks/useWorkspaceQueries';
import { useTemplateImport } from '@/hooks/useTemplates';
import type { Template, TemplateAccessTier } from '@/types/templates.types';
import { TIER_META, tierRequirement, canAccessTemplate } from '@/types/templates.types';

interface TemplateImportModalProps {
  template: Template;
  accessTier: TemplateAccessTier;
  onClose: () => void;
}

const TemplateImportModal = ({ template, accessTier, onClose }: TemplateImportModalProps) => {
  const router = useRouter();
  const { data: workspaces = [], isLoading: workspacesLoading } = useWorkspaces();
  const importTemplate = useTemplateImport();

  const [workspaceId, setWorkspaceId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState('');

  const locked = !canAccessTemplate(accessTier, template.tier);

  const tierMeta = TIER_META[template.tier];

  // Default to the first workspace until the user picks one explicitly.
  const effectiveWorkspaceId = workspaceId || workspaces[0]?.id || '';

  const canSubmit = !!effectiveWorkspaceId && !importTemplate.isPending && !locked;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError('');
    try {
      const result = await importTemplate.mutateAsync({
        slug: template.slug,
        workspaceId: effectiveWorkspaceId,
        projectName: projectName.trim() || undefined,
      });
      onClose();
      router.push(`/dashboard/workspaces/${result.workspaceSlug}/projects/${result.projectSlug}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed. Please try again.');
    }
  };

  const selectedWorkspace = useMemo(
    () => workspaces.find((w) => w.id === effectiveWorkspaceId),
    [workspaces, effectiveWorkspaceId],
  );

  return (
    <div
      className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'
      role='dialog'
      aria-modal='true'
      aria-label={`Import ${template.title} template`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className='w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
        {/* Header */}
        <div className='flex items-start justify-between gap-3 px-6 pt-6 pb-4'>
          <div className='flex items-center gap-3 min-w-0'>
            <span className='text-2xl leading-none shrink-0'>{template.icon}</span>
            <div className='min-w-0'>
              <h2 className='text-base font-bold text-neutral-900 dark:text-neutral-50 truncate'>
                Use “{template.title}”
              </h2>
              <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                Creates a new project from this template
              </p>
            </div>
          </div>
          <button
            aria-label='Close'
            onClick={onClose}
            className='shrink-0 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
          >
            <X className='w-4 h-4' />
          </button>
        </div>

        <div className='px-6 pb-6 space-y-5'>
          {/* Tier notice */}
          <div className={cn('flex items-center gap-2.5 rounded-xl border px-3.5 py-3', tierMeta.badgeStyle)}>
            <span className={cn('w-2 h-2 rounded-full shrink-0', tierMeta.dot)} />
            <div className='text-xs leading-relaxed'>
              <span className='font-bold'>{tierRequirement(template.tier)}</span>
              {' — '}
              {locked ? (
                <span>Upgrade your workspace to unlock this template.</span>
              ) : (
                <span>{tierMeta.description}</span>
              )}
            </div>
          </div>

          {locked ? (
            <div className='text-center py-4'>
              <Lock className='w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-600 mb-3' strokeWidth={1.5} />
              <p className='text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1'>
                {template.tier === 'BUSINESS' ? 'Business plan required' : 'Pro plan required'}
              </p>
              <p className='text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto leading-relaxed mb-4'>
                Upgrade your workspace to unlock this template and the rest of the {template.tier === 'BUSINESS' ? 'Business' : 'Pro'} catalog.
              </p>
              <button
                onClick={() => {
                  onClose();
                  const target = selectedWorkspace
                    ? `/dashboard/workspaces/${selectedWorkspace.slug}/billing/upgrade`
                    : '/pricing';
                  router.push(target);
                }}
                className='inline-flex items-center gap-2 rounded-xl bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 px-5 py-2.5 text-sm font-bold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors'
              >
                Upgrade plan <ArrowRight className='w-4 h-4' />
              </button>
            </div>
          ) : (
            <>
              {/* Workspace picker */}
              <div>
                <label className='block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5'>
                  Destination workspace
                </label>
                {workspacesLoading ? (
                  <div className='flex items-center gap-2 text-xs text-neutral-400 py-2'>
                    <Loader2 className='w-3.5 h-3.5 animate-spin' /> Loading workspaces…
                  </div>
                ) : workspaces.length === 0 ? (
                  <a
                    href='/dashboard/create-workspace'
                    className='flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline'
                  >
                    <FolderPlus className='w-4 h-4' /> Create a workspace to import into
                  </a>
                ) : (
                  <select
                    aria-label='Destination workspace'
                    value={effectiveWorkspaceId}
                    onChange={(e) => setWorkspaceId(e.target.value)}
                    className='w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-shadow'
                  >
                    {workspaces.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Project name */}
              <div>
                <label className='block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5'>
                  Project name <span className='text-neutral-400 font-normal'>(optional)</span>
                </label>
                <input
                  type='text'
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder={template.title}
                  className='w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-shadow'
                />
              </div>

              {error && (
                <p role='alert' className='text-xs text-red-600 dark:text-red-400'>
                  {error}
                </p>
              )}

              {/* CTA */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={cn(
                  'w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-colors',
                  canSubmit
                    ? 'bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
                )}
              >
                {importTemplate.isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' /> Importing…
                  </>
                ) : (
                  <>
                    <FolderPlus className='w-4 h-4' /> Import template
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateImportModal;
