'use client';

import { Pin, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { cn }  from '@/lib/utils';
import { DEPARTMENT_LABELS, JobPosting, TYPE_LABELS } from '@/types/job.types';

interface AdminJobTableProps {
  jobs       : JobPosting[];
  onEdit     : (job: JobPosting) => void;
  onDelete   : (job: JobPosting) => void;
  onTogglePin: (job: JobPosting) => void;
  onToggleStatus: (job: JobPosting) => void;
}

const statusBadge: Record<string, string> = {
  DRAFT  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400',
  OPEN   : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400',
  PAUSED : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
  CLOSED : 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400',
};

const AdminJobTable = ({ jobs, onEdit, onDelete, onTogglePin, onToggleStatus }: AdminJobTableProps) => {
  if (jobs.length === 0) {
    return (
      <div className='text-center py-12 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800'>
        <p className='text-sm text-neutral-400 dark:text-neutral-500'>No job postings yet. Create your first one.</p>
      </div>
    );
  }

  return (
    <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm border-collapse'>
          <thead>
            <tr className='bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-100 dark:border-neutral-800'>
              <th className='text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400'>Role</th>
              <th className='text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 whitespace-nowrap'>Type</th>
              <th className='text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400'>Status</th>
              <th className='text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 whitespace-nowrap'>Posted</th>
              <th className='text-right px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, i) => (
              <tr
                key={job.id}
                className={cn(
                  i < jobs.length - 1 ? 'border-b border-neutral-100 dark:border-neutral-800/60' : '',
                  'hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors'
                )}
              >
                {/* Role */}
                <td className='px-4 py-3 align-middle'>
                  <div className='flex items-center gap-2'>
                    {job.isPinned && <Pin className='w-3 h-3 text-neutral-400 dark:text-neutral-500 shrink-0' strokeWidth={2} />}
                    <div>
                      <p className='text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-tight'>{job.title}</p>
                      <p className='text-xs text-neutral-400 dark:text-neutral-500 mt-0.5'>{DEPARTMENT_LABELS[job.department]}</p>
                    </div>
                  </div>
                </td>

                {/* Type */}
                <td className='px-4 py-3 align-middle whitespace-nowrap'>
                  <span className='text-xs text-neutral-500 dark:text-neutral-400'>{TYPE_LABELS[job.type]}</span>
                </td>

                {/* Status */}
                <td className='px-4 py-3 align-middle'>
                  <span className={cn('inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold', statusBadge[job.status])}>
                    {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                  </span>
                </td>

                {/* Posted */}
                <td className='px-4 py-3 align-middle whitespace-nowrap'>
                  <span className='text-xs text-neutral-400 dark:text-neutral-500'>
                    {job.publishedAt
                      ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(job.publishedAt))
                      : '—'}
                  </span>
                </td>

                {/* Actions */}
                <td className='px-4 py-3 align-middle'>
                  <div className='flex items-center justify-end gap-1'>
                    {/* Toggle status OPEN ↔ CLOSED */}
                    <button
                      onClick={() => onToggleStatus(job)}
                      title={job.status === 'OPEN' ? 'Pause listing' : 'Set to Open'}
                      className='w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
                    >
                      {job.status === 'OPEN'
                        ? <EyeOff className='w-3.5 h-3.5' strokeWidth={1.8} />
                        : <Eye    className='w-3.5 h-3.5' strokeWidth={1.8} />}
                    </button>

                    {/* Pin */}
                    <button
                      onClick={() => onTogglePin(job)}
                      title={job.isPinned ? 'Unpin' : 'Pin to top'}
                      className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                        job.isPinned
                          ? 'text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800'
                          : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      )}
                    >
                      <Pin className='w-3.5 h-3.5' strokeWidth={1.8} />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => onEdit(job)}
                      className='w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
                    >
                      <Pencil className='w-3.5 h-3.5' strokeWidth={1.8} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDelete(job)}
                      className='w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors'
                    >
                      <Trash2 className='w-3.5 h-3.5' strokeWidth={1.8} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminJobTable;