import { Briefcase, Mail } from 'lucide-react';

interface CareersEmptyProps {
  hasFilters: boolean;
  onClear   : () => void;
}

export const CareersEmpty = ({ hasFilters, onClear }: CareersEmptyProps) => {
  return (
    <div className='flex flex-col items-center justify-center py-20 text-center'>
      <div className='w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-5'>
        <Briefcase className='w-6 h-6 text-neutral-400 dark:text-neutral-500' strokeWidth={1.5} />
      </div>

      {hasFilters ? (
        <>
          <h3 className='text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2'>
            No roles match your filters
          </h3>
          <p className='text-sm text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed mb-6'>
            Try adjusting your search or filters — or clear them to see all open positions.
          </p>
          <button
            onClick={onClear}
            className='text-sm font-semibold text-neutral-700 dark:text-neutral-300 underline underline-offset-2 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors'
          >
            Clear filters
          </button>
        </>
      ) : (
        <>
          <h3 className='text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2'>
            No open roles right now
          </h3>
          <p className='text-sm text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed mb-6'>
            We don&apos;t have any open positions at the moment, but we&apos;re always
            interested in hearing from exceptional people.
          </p>
          <a
            href='mailto:focurabusiness@gmail.com?subject=General Application — Focura'
            className='inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-semibold text-neutral-700 dark:text-neutral-300 px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors'
          >
            <Mail className='w-4 h-4 shrink-0' strokeWidth={1.8} />
            Send a general application
          </a>
        </>
      )}
    </div>
  );
};