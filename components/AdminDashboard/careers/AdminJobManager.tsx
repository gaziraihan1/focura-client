'use client';

import { useState } from 'react';
import { Plus, X, Loader2, AlertTriangle } from 'lucide-react';
import AdminJobTable from './AdminJobTable';
import type { JobPosting } from '@/types/job.types';
import { AdminJobForm, type AdminJobFormValues } from './AdminJobForm';
import {
  useAdminJobs,
  useCreateJob,
  useDeleteJob,
  useToggleJobPin,
  useToggleJobStatus,
  useUpdateJob,
} from '@/hooks/useJob';

type PanelMode = 'create' | 'edit';

interface Panel {
  mode: PanelMode;
  job?: JobPosting;
}

function toFormValues(job: JobPosting): Partial<AdminJobFormValues> {
  return {
    title: job.title,
    department: job.department,
    location: job.location,
    locationType: job.locationType,
    type: job.type,
    experienceLevel: job.experienceLevel,
    salaryMin: job.salaryMin ?? undefined,
    salaryMax: job.salaryMax ?? undefined,
    salaryCurrency: job.salaryCurrency,
    description: job.description,
    requirements: job.requirements,
    niceToHave: job.niceToHave ?? undefined,
    benefits: job.benefits ?? undefined,
    status: job.status,
    closingDate: job.closingDate
      ? new Date(job.closingDate).toISOString().slice(0, 10)
      : undefined,
    applicationUrl: job.applicationUrl ?? undefined,
    applicationEmail: job.applicationEmail ?? undefined,
    isPinned: job.isPinned,
  };
}

const AdminJobsManager = () => {
  const [panel, setPanel] = useState<Panel | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JobPosting | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data, isPending, isError, refetch } = useAdminJobs();
  const jobs = data?.jobs ?? [];

  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();
  const togglePin = useToggleJobPin();
  const toggleStatus = useToggleJobStatus();

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleCreate = async (formData: AdminJobFormValues) => {
    await createJob.mutateAsync(formData);
    setPanel(null);
  };

  const handleUpdate = async (formData: AdminJobFormValues) => {
    if (!panel?.job) return;
    await updateJob.mutateAsync({ jobId: panel.job.id, data: formData });
    setPanel(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteJob.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePin = (job: JobPosting) => {
    togglePin.mutate(job.id);
  };

  const handleToggleStatus = (job: JobPosting) => {
    toggleStatus.mutate({ jobId: job.id, currentStatus: job.status });
  };

  return (
    <div className='space-y-6'>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h1 className='text-lg font-bold text-neutral-900 dark:text-neutral-100'>
            Job Postings
          </h1>
          <p className='text-xs text-neutral-400 dark:text-neutral-500 mt-0.5'>
            Manage careers page listings. Drafts are hidden from public view.
          </p>
        </div>
        <button
          onClick={() => setPanel({ mode: 'create' })}
          className='inline-flex items-center gap-1.5 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 text-xs font-bold rounded-xl px-4 py-2.5 hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors'
        >
          <Plus className='w-3.5 h-3.5 shrink-0' strokeWidth={2.5} />
          New Role
        </button>
      </div>

      {isPending ? (
        <div className='flex justify-center py-16'>
          <Loader2 className='w-5 h-5 text-neutral-400 animate-spin' />
        </div>
      ) : isError ? (
        <div className='text-center py-12 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800'>
          <p className='text-sm text-neutral-500 dark:text-neutral-400 mb-3'>
            Failed to load job postings.
          </p>
          <button
            onClick={() => refetch()}
            className='text-sm font-semibold underline underline-offset-2 text-neutral-600 dark:text-neutral-300'
          >
            Retry
          </button>
        </div>
      ) : (
        <AdminJobTable
          jobs={jobs}
          onEdit={(job) => setPanel({ mode: 'edit', job })}
          onDelete={setDeleteTarget}
          onTogglePin={handleTogglePin}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* ── Create / Edit centered modal ─────────────────────────────────────── */}
      {panel && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center p-4'
          role='dialog'
          aria-modal='true'
        >
          {/* Backdrop with blur */}
          <div
            className='absolute inset-0 bg-neutral-900/50 dark:bg-neutral-950/60 backdrop-blur-sm'
            onClick={() => setPanel(null)}
          />
          {/* Modal */}
          <div className='relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl'>
            {/* Modal header */}
            <div className='flex items-center justify-between gap-3 px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0'>
              <p className='text-sm font-bold text-neutral-900 dark:text-neutral-100'>
                {panel.mode === 'create'
                  ? 'New Job Posting'
                  : `Edit: ${panel.job?.title}`}
              </p>
              <button
                onClick={() => setPanel(null)}
                aria-label='Close modal'
                className='w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
            {/* Scrollable form body */}
            <div className='overflow-y-auto px-6 py-6'>
              <AdminJobForm
                initial={panel.job ? toFormValues(panel.job) : undefined}
                onSubmit={panel.mode === 'create' ? handleCreate : handleUpdate}
                submitLabel={
                  panel.mode === 'create' ? 'Publish / Save as Draft' : 'Save Changes'
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm dialog ────────────────────────────────────────────── */}
      {deleteTarget && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 dark:bg-neutral-950/60 backdrop-blur-sm'
          role='dialog'
          aria-modal='true'
        >
          <div className='w-full max-w-sm rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl'>
            <div className='flex items-start gap-3 mb-5'>
              <div className='shrink-0 w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center'>
                <AlertTriangle className='w-4.5 h-4.5 text-red-500 dark:text-red-400' strokeWidth={1.8} />
              </div>
              <div>
                <p className='text-sm font-bold text-neutral-900 dark:text-neutral-100'>
                  Delete this posting?
                </p>
                <p className='text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed'>
                  <strong className='font-semibold text-neutral-700 dark:text-neutral-300'>
                    {deleteTarget.title}
                  </strong>{' '}
                  will be permanently removed and will no longer appear on the careers page. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className='flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white text-xs font-bold rounded-xl py-2.5 transition-colors disabled:opacity-60'
              >
                {deleting && <Loader2 className='w-3.5 h-3.5 shrink-0 animate-spin' />}
                Yes, delete
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className='flex-1 text-xs font-semibold border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-60'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobsManager;