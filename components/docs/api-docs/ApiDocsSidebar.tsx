'use client';

import { API_SECTIONS, HttpMethod, METHOD_DOT } from '@/lib/apiData';
import { cn }             from '@/lib/utils';

interface ApiDocsSidebarProps {
  activeSection  : string;
  activeEndpoint : string;
  onSectionClick : (id: string) => void;
  onEndpointClick: (sectionId: string, endpointId: string) => void;
}

export const ApiDocsSidebar = ({
  activeSection,
  activeEndpoint,
  onSectionClick,
  onEndpointClick,
}: ApiDocsSidebarProps) => {
  return (
    <nav className='sticky top-20 h-[calc(100vh-3rem)] overflow-y-auto pr-2 space-y-0.5 scrollbar-thin'>
      {/* Fixed sections at top */}
      <div className='mb-3'>
        <p className='text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 px-3 mb-1.5'>
          Overview
        </p>
        {[
          { id: 'authentication-guide', label: 'Authentication' },
          { id: 'rate-limits',          label: 'Rate Limits' },
          { id: 'sse-guide',            label: 'Real-time (SSE)' },
          { id: 'errors',               label: 'Errors' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onSectionClick(id)}
            className={cn(
              'w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              activeSection === id
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className='border-t border-neutral-100 dark:border-neutral-800 pt-3'>
        <p className='text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 px-3 mb-1.5'>
          Endpoints
        </p>

        {API_SECTIONS.map((section) => (
          <div key={section.id} className='mb-2'>
            {/* Section header */}
            <button
              onClick={() => onSectionClick(section.id)}
              className={cn(
                'w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                activeSection === section.id
                  ? 'text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              )}
            >
              {section.title}
            </button>

            {/* Endpoint list — shown when section is active */}
            {activeSection === section.id && (
              <div className='ml-3 mt-0.5 space-y-0.5 border-l border-neutral-200 dark:border-neutral-700'>
                {section.endpoints.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => onEndpointClick(section.id, ep.id)}
                    className={cn(
                      'w-full text-left flex items-center gap-2 pl-3 pr-2 py-1 rounded-r-lg text-[11px] transition-colors',
                      activeEndpoint === ep.id
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                        : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                    )}
                  >
                    <span
                      className={cn(
                        'shrink-0 w-1.5 h-1.5 rounded-full',
                        METHOD_DOT[ep.method as HttpMethod]
                      )}
                    />
                    <span className='truncate leading-tight'>{ep.summary}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};