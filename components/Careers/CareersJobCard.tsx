import { MapPin, Clock, Briefcase, Pin, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEPARTMENT_LABELS, LOCATION_LABELS, TYPE_LABELS, EXPERIENCE_LABELS, JobListItem } from '@/types/job.types';

interface CareersJobCardProps {
  job     : JobListItem;
  isNew   : boolean;
  onClick : (job: JobListItem) => void;
  onApply : (job: JobListItem) => void;
}

function formatSalary(min: number | null, max: number | null, currency: string): string | null {
  if (!min && !max) return null;
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n / 100);
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min)        return `From ${fmt(min)}`;
  if (max)        return `Up to ${fmt(max)}`;
  return null;
}

const locationColors: Record<string, string> = {
  REMOTE : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40',
  ONSITE : 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40',
  HYBRID : 'bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800/40',
};

export const CareersJobCard = ({ job, isNew, onClick, onApply }: CareersJobCardProps) => {
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);

  return (
    <div
      onClick={() => onClick(job)}
      className={cn(
        'group rounded-2xl border bg-card p-5 md:p-6 transition-all hover:shadow-sm cursor-pointer',
        job.isPinned
          ? 'border-border'
          : 'border-border hover:border-muted-foreground/30'
      )}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(job);
        }
      }}
    >
      <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
        {/* Left — job info */}
        <div className='min-w-0 flex-1'>
          {/* Title row */}
          <div className='flex flex-wrap items-center gap-2 mb-2'>
            {job.isPinned && (
              <Pin className='w-3.5 h-3.5 text-muted-foreground shrink-0' strokeWidth={2} />
            )}
            <h3 className='text-base font-bold text-foreground leading-snug'>
              {job.title}
            </h3>
            {isNew && (
              <span className='text-[10px] font-bold uppercase tracking-wide bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-full px-2 py-0.5 shrink-0'>
                New
              </span>
            )}
          </div>

          {/* Department */}
          <p className='text-xs font-semibold text-muted-foreground mb-3'>
            {DEPARTMENT_LABELS[job.department]}
          </p>

          {/* Meta tags */}
          <div className='flex flex-wrap gap-2'>
            {/* Location type */}
            <span className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold',
              locationColors[job.locationType]
            )}>
              <MapPin className='w-3 h-3 shrink-0' strokeWidth={2} />
              {LOCATION_LABELS[job.locationType]}
            </span>

            {/* Location string */}
            <span className='inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground'>
              {job.location}
            </span>

            {/* Job type */}
            <span className='inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground'>
              <Clock className='w-3 h-3 shrink-0' strokeWidth={2} />
              {TYPE_LABELS[job.type]}
            </span>

            {/* Experience */}
            <span className='inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground'>
              <Briefcase className='w-3 h-3 shrink-0' strokeWidth={2} />
              {EXPERIENCE_LABELS[job.experienceLevel]}
            </span>

            {/* Salary */}
            {salary && (
              <span className='inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground'>
                <DollarSign className='w-3 h-3 shrink-0' strokeWidth={2} />
                {salary}
              </span>
            )}
          </div>

          {/* Closing date */}
          {job.closingDate && (
            <p className='text-[11px] text-muted-foreground mt-3'>
              Applications close{' '}
              {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(job.closingDate))}
            </p>
          )}
        </div>

        {/* Right — CTA */}
        <div className='shrink-0' onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onApply(job)}
            className='inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold px-4 py-2.5 hover:bg-primary/90 transition-colors group-hover:shadow-sm'
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};