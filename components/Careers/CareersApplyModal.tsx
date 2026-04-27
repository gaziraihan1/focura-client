'use client';

import { useEffect, useRef }    from 'react';
import { X, MapPin, Clock, Briefcase, ExternalLink, Mail, ChevronRight } from 'lucide-react';
import { DEPARTMENT_LABELS, LOCATION_LABELS, TYPE_LABELS, EXPERIENCE_LABELS,JobListItem  } from '@/types/job.types';

interface CareersApplyModalProps {
  job    : JobListItem | null;
  onClose: () => void;
}

export const CareersApplyModal = ({ job, onClose }: CareersApplyModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef   = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!job) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    closeRef.current?.focus();
    return () => document.removeEventListener('keydown', handler);
  }, [job, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = job ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [job]);

  if (!job) return null;

  const emailSubject = `Application: ${job.title} — Focura`;
  const mailtoHref   = `mailto:${job.applicationEmail ?? 'focurabusiness@gmail.com'}?subject=${encodeURIComponent(emailSubject)}`;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className='fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-900/60 dark:bg-neutral-950/70 backdrop-blur-sm'
      role='dialog'
      aria-modal='true'
      aria-label={`Apply for ${job.title}`}
    >
      <div className='relative w-full sm:max-w-lg max-h-[92dvh] sm:max-h-[85dvh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-2xl'>
        {/* Header */}
        <div className='sticky top-0 flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-10'>
          <div className='min-w-0'>
            <p className='text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1'>
              {DEPARTMENT_LABELS[job.department]}
            </p>
            <h2 className='text-base font-bold text-neutral-900 dark:text-neutral-100 leading-tight'>
              {job.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label='Close'
            className='shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
          >
            <X className='w-4 h-4' />
          </button>
        </div>

        {/* Body */}
        <div className='px-5 py-5 space-y-5'>
          {/* Meta tags */}
          <div className='flex flex-wrap gap-2'>
            {[
              { icon: MapPin,    label: job.location },
              { icon: MapPin,    label: LOCATION_LABELS[job.locationType] },
              { icon: Clock,     label: TYPE_LABELS[job.type] },
              { icon: Briefcase, label: EXPERIENCE_LABELS[job.experienceLevel] },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className='inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-2.5 py-1 text-xs text-neutral-600 dark:text-neutral-400'
              >
                <Icon className='w-3 h-3 shrink-0' strokeWidth={2} />
                {label}
              </span>
            ))}
          </div>

          {/* How to apply */}
          <div className='rounded-xl border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/20 px-4 py-4 space-y-3'>
            <p className='text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wide'>
              How to apply
            </p>
            <p className='text-xs text-blue-700 dark:text-blue-300 leading-relaxed'>
              Send your CV and a short note about why you&apos;re interested in this role and what makes you a great fit. There&apos;s no template — write like a human.
            </p>

            <div className='flex flex-col gap-2'>
              {/* Primary: email */}
              <a
                href={mailtoHref}
                className='flex items-center justify-between gap-3 rounded-lg bg-blue-600 dark:bg-blue-700 text-white px-4 py-2.5 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors'
              >
                <div className='flex items-center gap-2'>
                  <Mail className='w-4 h-4 shrink-0' strokeWidth={1.8} />
                  <span className='text-xs font-bold'>Apply via email</span>
                </div>
                <span className='text-[11px] opacity-80 font-mono truncate'>
                  {job.applicationEmail ?? 'focurabusiness@gmail.com'}
                </span>
              </a>

              {/* Optional: external ATS */}
              {job.applicationUrl && (
                <a
                  href={job.applicationUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors'
                >
                  <ExternalLink className='w-4 h-4 shrink-0' strokeWidth={1.8} />
                  <span className='text-xs font-semibold'>Apply on external portal</span>
                </a>
              )}
            </div>
          </div>

          {/* What to include */}
          <div>
            <p className='text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide mb-2'>
              What to include in your email
            </p>
            <ul className='space-y-1.5'>
              {[
                'Your CV or LinkedIn profile',
                `Subject line: "${emailSubject}"`,
                'A short paragraph on why you want to join Focura',
                'Links to relevant work, projects, or portfolio (if applicable)',
              ].map((item) => (
                <li key={item} className='flex items-start gap-2 text-xs text-neutral-500 dark:text-neutral-400'>
                  <ChevronRight className='w-3.5 h-3.5 shrink-0 text-neutral-300 dark:text-neutral-600 mt-0.5' strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Closing date */}
          {job.closingDate && (
            <p className='text-[11px] text-neutral-400 dark:text-neutral-500 border-t border-neutral-100 dark:border-neutral-800 pt-4'>
              Applications close{' '}
              <strong className='font-semibold text-neutral-600 dark:text-neutral-400'>
                {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(job.closingDate))}
              </strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};