import { Gauge, AlertTriangle } from 'lucide-react';

const tiers = [
  {
    endpoint   : 'POST /api/v1/contact',
    limit      : '3 / hour per IP',
    limit2     : '2 / 24 h per email',
    backend    : 'Upstash Redis sliding window',
    auth       : 'Public',
    exceeded   : '429 + retryAfter timestamp',
  },
  {
    endpoint   : 'POST /api/v1/files/upload',
    limit      : '10 uploads / 10 min per user',
    limit2     : 'Plan file size limit',
    backend    : 'Upstash Redis + DB quota check',
    auth       : 'Auth',
    exceeded   : '429 or 413 / 507',
  },
  {
    endpoint   : 'POST /api/v1/auth/login',
    limit      : '10 attempts / 15 min per IP',
    limit2     : '—',
    backend    : 'Upstash Redis',
    auth       : 'Public',
    exceeded   : '429 with lockout duration',
  },
  {
    endpoint   : 'POST /api/v1/auth/register',
    limit      : '5 / hour per IP',
    limit2     : '—',
    backend    : 'Upstash Redis',
    auth       : 'Public',
    exceeded   : '429',
  },
  {
    endpoint   : 'All other endpoints',
    limit      : '300 / min per user',
    limit2     : '—',
    backend    : 'Express global limiter',
    auth       : 'Auth',
    exceeded   : '429',
  },
];

const responseHeaders = [
  { header: 'X-RateLimit-Limit',     description: 'Maximum requests allowed in the current window' },
  { header: 'X-RateLimit-Remaining', description: 'Requests remaining in the current window' },
  { header: 'X-RateLimit-Reset',     description: 'Unix timestamp (ms) when the window resets' },
  { header: 'Retry-After',           description: 'Seconds to wait before retrying (only on 429)' },
];

export const ApiDocsRateLimit = () => {
  return (
    <section id='rate-limits' className='scroll-mt-24'>
      <div className='flex items-start gap-3 mb-6'>
        <div className='shrink-0 w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center'>
          <Gauge className='w-4.5 h-4.5 text-neutral-600 dark:text-neutral-300' strokeWidth={1.8} />
        </div>
        <div>
          <h2 className='text-xl font-bold text-neutral-900 dark:text-neutral-100'>Rate Limits</h2>
          <p className='text-sm text-neutral-500 dark:text-neutral-400 mt-0.5'>
            Focura enforces per-endpoint rate limits via Upstash Redis sliding window
            counters. Limits are applied per IP for public routes and per user for
            authenticated routes.
          </p>
        </div>
      </div>

      {/* Limits table */}
      <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden mb-6'>
        <div className='px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80'>
          <p className='text-xs font-semibold text-neutral-600 dark:text-neutral-400'>Limit Tiers by Endpoint</p>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm border-collapse'>
            <thead>
              <tr className='border-b border-neutral-100 dark:border-neutral-800'>
                {['Endpoint', 'Primary Limit', 'Secondary Limit', 'Backend', 'Auth', 'On Exceeded'].map((h) => (
                  <th key={h} className='text-left px-4 py-2.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 whitespace-nowrap'>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tiers.map((row, i) => (
                <tr
                  key={row.endpoint}
                  className={i < tiers.length - 1 ? 'border-b border-neutral-100 dark:border-neutral-800/60' : ''}
                >
                  <td className='px-4 py-3 align-top'>
                    <code className='text-[11px] font-mono text-neutral-800 dark:text-neutral-200 whitespace-nowrap'>
                      {row.endpoint}
                    </code>
                  </td>
                  <td className='px-4 py-3 align-top text-xs text-neutral-600 dark:text-neutral-400 whitespace-nowrap'>
                    {row.limit}
                  </td>
                  <td className='px-4 py-3 align-top text-xs text-neutral-500 dark:text-neutral-500 whitespace-nowrap'>
                    {row.limit2}
                  </td>
                  <td className='px-4 py-3 align-top text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap'>
                    {row.backend}
                  </td>
                  <td className='px-4 py-3 align-top'>
                    <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                      row.auth === 'Public'
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                        : 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                    }`}>
                      {row.auth}
                    </span>
                  </td>
                  <td className='px-4 py-3 align-top text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap'>
                    {row.exceeded}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Response headers */}
      <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden mb-5'>
        <div className='px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80'>
          <p className='text-xs font-semibold text-neutral-600 dark:text-neutral-400'>Rate Limit Response Headers</p>
        </div>
        <div className='divide-y divide-neutral-100 dark:divide-neutral-800'>
          {responseHeaders.map(({ header, description }) => (
            <div key={header} className='flex items-start gap-4 px-5 py-3'>
              <code className='shrink-0 text-[11px] font-mono text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/40 rounded-md px-2 py-0.5 mt-0.5'>
                {header}
              </code>
              <p className='text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed'>{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 429 example */}
      <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden mb-5'>
        <div className='px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80'>
          <p className='text-xs font-semibold text-neutral-600 dark:text-neutral-400'>429 Response Shape</p>
        </div>
        <pre className='overflow-x-auto p-5 text-[12px] font-mono text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-950/60 leading-relaxed'>
{`HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit    : 3
X-RateLimit-Remaining: 0
X-RateLimit-Reset    : 1714483600000
Retry-After          : 3600

{
  "success"   : false,
  "error"     : "TOO_MANY_REQUESTS",
  "message"   : "You have sent too many messages. Please try again in 60 minutes.",
  "retryAfter": 1714483600000,
  "remaining" : 0
}`}
        </pre>
      </div>

      <div className='flex items-start gap-2.5 rounded-xl border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/20 px-4 py-3.5'>
        <AlertTriangle className='w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5' strokeWidth={2} />
        <p className='text-xs text-blue-800 dark:text-blue-300 leading-relaxed'>
          Rate limit state is stored in Upstash Redis with automatic TTL expiry — no manual cleanup required. Limits are enforced at the middleware layer before any business logic runs, so rejected requests do not create DB records.
        </p>
      </div>
    </section>
  );
};