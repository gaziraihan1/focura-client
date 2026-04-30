import { Copy, Globe, Lock, Zap } from 'lucide-react';
import { FULL_BASE, API_VERSION }  from '@/lib/apiData';

export const ApiDocsHero = () => {
  return (
    <section className='relative bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 overflow-hidden'>
      {/* Grid texture */}
      <div
        className='absolute inset-0 opacity-[0.025] dark:opacity-[0.05]'
        style={{
          backgroundImage: `linear-gradient(var(--color-neutral-900,#171717) 1px,transparent 1px),
            linear-gradient(90deg,var(--color-neutral-900,#171717) 1px,transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      <div className='absolute top-0 left-1/4 w-96 h-40 bg-emerald-400/5 dark:bg-emerald-300/5 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute top-0 right-1/4 w-64 h-32 bg-blue-400/5 dark:bg-blue-300/5 rounded-full blur-3xl pointer-events-none' />

      <div className='relative max-w-6xl mx-auto px-6 py-14 md:py-18'>
        <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-8'>

          {/* Left — title + description */}
          <div className='max-w-xl'>
            {/* Badge */}
            <div className='inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-5 shadow-sm'>
              <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse' />
              REST API · {API_VERSION} · Live
            </div>

            <h1 className='text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-3 leading-tight'>
              Focura API Reference
            </h1>
            <p className='text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed'>
              The Focura REST API lets you programmatically access workspaces,
              projects, tasks, focus sessions, files, notifications, and more.
              All endpoints return JSON. Authentication uses RS256 JWT Bearer tokens.
            </p>

            {/* Quick info pills */}
            <div className='flex flex-wrap gap-2 mt-5'>
              {[
                { icon: Globe, label: 'REST over HTTPS' },
                { icon: Lock,  label: 'RS256 JWT Auth' },
                { icon: Zap,   label: 'SSE Real-time' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className='inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-full px-3 py-1.5'
                >
                  <Icon className='w-3 h-3 shrink-0' strokeWidth={1.8} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Right — base URL card */}
          <div className='md:w-80 shrink-0'>
            <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm'>
              {/* Card header */}
              <div className='px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80'>
                <p className='text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider'>
                  Base URL
                </p>
              </div>

              {/* URL rows */}
              <div className='divide-y divide-neutral-100 dark:divide-neutral-800'>
                {[
                  { label: 'Production',  url: FULL_BASE,     dot: 'bg-emerald-500' },
                  { label: 'Local dev',   url: 'http://localhost:5000/api', dot: 'bg-blue-500' },
                ].map(({ label, url, dot }) => (
                  <div key={label} className='px-4 py-3 group'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                      <span className='text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500'>
                        {label}
                      </span>
                    </div>
                    <div className='flex items-center justify-between gap-2'>
                      <code className='text-xs font-mono text-neutral-800 dark:text-neutral-200 break-all'>
                        {url}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(url)}
                        className='shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                        title='Copy URL'
                      >
                        <Copy className='w-3.5 h-3.5' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Version row */}
              <div className='px-4 py-3 bg-neutral-50 dark:bg-neutral-900/60 border-t border-neutral-100 dark:border-neutral-800'>
                <div className='flex items-center justify-between text-xs'>
                  <span className='text-neutral-400 dark:text-neutral-500'>API Version</span>
                  <span className='font-mono font-semibold text-neutral-700 dark:text-neutral-300'>
                    {API_VERSION}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HTTP method legend */}
        <div className='mt-10 flex flex-wrap items-center gap-3'>
          <span className='text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider'>
            Methods:
          </span>
          {[
            { m: 'GET',    c: 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50' },
            { m: 'POST',   c: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' },
            { m: 'PUT',    c: 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50' },
            { m: 'PATCH',  c: 'bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800/50' },
            { m: 'DELETE', c: 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50' },
          ].map(({ m, c }) => (
            <span key={m} className={`inline-block rounded-md border px-2.5 py-0.5 text-[11px] font-bold font-mono ${c}`}>
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};