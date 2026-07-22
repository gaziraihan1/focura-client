'use client';

import { useEffect } from 'react';
import { X, MapPin, Clock, Briefcase, Pin, DollarSign, Calendar, Link as LinkIcon, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { JobPosting } from '@/types/job.types'; // ✅ Changed from JobListItem
import { DEPARTMENT_LABELS, LOCATION_LABELS, TYPE_LABELS, EXPERIENCE_LABELS } from '@/types/job.types';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface CareersJobDetailModalProps {
  job: JobPosting | null; // ✅ Changed from JobListItem | null
  onClose: () => void;
}

export const CareersJobDetailModal = ({ job, onClose }: CareersJobDetailModalProps) => {
  const trapRef = useFocusTrap(!!job);

  // Lock body scroll
  useEffect(() => {
    if (!job) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [job]);

  if (!job) return null;

  const formatSalary = (min: number | null, max: number | null, currency: string): string | null => {
    if (!min && !max) return null;
    const fmt = (n: number) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n / 100);
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    if (max) return `Up to ${fmt(max)}`;
    return null;
  };

  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);
  const closingDate = job.closingDate
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(job.closingDate))
    : null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6'
      role='dialog'
      aria-modal='true'
      aria-labelledby='job-detail-title'
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div className='absolute inset-0 bg-neutral-900/50 dark:bg-neutral-950/60 backdrop-blur-sm' />

      {/* Modal Content */}
      <div ref={trapRef} className='relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-background border border-border shadow-2xl overflow-hidden'>
        {/* Header */}
        <div className='flex items-start justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 border-b border-border shrink-0'>
          <div className='min-w-0'>
            <div className='flex flex-wrap items-center gap-2 mb-1'>
              {job.isPinned && (
                <Pin className='w-4 h-4 text-muted-foreground shrink-0' strokeWidth={2} />
              )}
              <h2 id='job-detail-title' className='text-lg sm:text-xl font-bold text-foreground leading-tight'>
                {job.title}
              </h2>
            </div>
            <p className='text-sm font-semibold text-muted-foreground'>
              {DEPARTMENT_LABELS[job.department]}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label='Close modal'
            className='w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0'
          >
            <X className='w-4 h-4' />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className='overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 space-y-6'>
          {/* Meta Tags */}
          <div className='flex flex-wrap gap-2'>
            <span className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold',
              job.locationType === 'REMOTE' && 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40',
              job.locationType === 'ONSITE' && 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40',
              job.locationType === 'HYBRID' && 'bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800/40'
            )}>
              <MapPin className='w-3.5 h-3.5 shrink-0' strokeWidth={2} />
              {LOCATION_LABELS[job.locationType]}
            </span>

            <span className='inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground'>
              {job.location}
            </span>

            <span className='inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground'>
              <Clock className='w-3.5 h-3.5 shrink-0' strokeWidth={2} />
              {TYPE_LABELS[job.type]}
            </span>

            <span className='inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground'>
              <Briefcase className='w-3.5 h-3.5 shrink-0' strokeWidth={2} />
              {EXPERIENCE_LABELS[job.experienceLevel]}
            </span>

            {salary && (
              <span className='inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground'>
                <DollarSign className='w-3.5 h-3.5 shrink-0' strokeWidth={2} />
                {salary}
              </span>
            )}
          </div>

          {/* Description */}
          <section>
            <h3 className='text-sm font-bold text-foreground mb-2'>About the Role</h3>
            <div className='text-muted-foreground leading-relaxed whitespace-pre-wrap'>
              {job.description || 'No description provided.'}
            </div>
          </section>

          {/* Requirements */}
          <section>
            <h3 className='text-sm font-bold text-foreground mb-2'>Requirements</h3>
            <div className='text-muted-foreground leading-relaxed whitespace-pre-wrap'>
              {job.requirements || 'No requirements listed.'}
            </div>
          </section>

          {/* Nice to Have */}
          {job.niceToHave && job.niceToHave.trim() && (
            <section>
              <h3 className='text-sm font-bold text-foreground mb-2'>Nice to Have</h3>
              <div className='text-muted-foreground leading-relaxed whitespace-pre-wrap'>
                {job.niceToHave}
              </div>
            </section>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.trim() && (
            <section>
              <h3 className='text-sm font-bold text-foreground mb-2'>Benefits</h3>
              <div className='text-muted-foreground leading-relaxed whitespace-pre-wrap'>
                {job.benefits}
              </div>
            </section>
          )}

          {/* Application Info */}
          <section className='pt-4 border-t border-border'>
            <h3 className='text-sm font-bold text-foreground mb-3'>How to Apply</h3>
            <div className='space-y-2 text-sm text-muted-foreground'>
              {job.applicationEmail && (
                <div className='flex items-center gap-2'>
                  <Mail className='w-4 h-4 shrink-0 text-muted-foreground' />
                  <a
                    href={`mailto:${job.applicationEmail}`}
                    className='hover:text-foreground underline underline-offset-2 transition-colors'
                  >
                    {job.applicationEmail}
                  </a>
                </div>
              )}
              {job.applicationUrl && (
                <div className='flex items-center gap-2'>
                  <LinkIcon className='w-4 h-4 shrink-0 text-muted-foreground' />
                  <a
                    href={job.applicationUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:text-foreground underline underline-offset-2 transition-colors break-all'
                  >
                    {job.applicationUrl}
                  </a>
                </div>
              )}
              {closingDate && (
                <div className='flex items-center gap-2 pt-1'>
                  <Calendar className='w-4 h-4 shrink-0 text-muted-foreground' />
                  <span>Applications close {closingDate}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div className='px-5 py-4 sm:px-6 sm:py-5 border-t border-border bg-muted/50 shrink-0'>
          <div className='flex flex-col sm:flex-row gap-3'>
            <button
              onClick={onClose}
              className='flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background text-foreground text-sm font-semibold px-4 py-2.5 hover:bg-muted transition-colors'
            >
              Close
            </button>
            <a
              href={job.applicationUrl || `mailto:${job.applicationEmail}`}
              target={job.applicationUrl ? '_blank' : undefined}
              rel={job.applicationUrl ? 'noopener noreferrer' : undefined}
              className='flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold px-4 py-2.5 hover:bg-primary/90 transition-colors'
            >
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};