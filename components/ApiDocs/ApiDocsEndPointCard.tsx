'use client';

import { useState }      from 'react';
import { Copy, Check, ChevronDown, Lock, Globe, ShieldAlert } from 'lucide-react';
import { cn }            from '@/lib/utils';
import { AUTH_BADGE, Endpoint, METHOD_COLORS } from '@/lib/apiData';

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={copy}
      className='inline-flex items-center gap-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors'
      title='Copy'
    >
      {copied
        ? <Check className='w-3.5 h-3.5 text-emerald-500' strokeWidth={2.5} />
        : <Copy className='w-3.5 h-3.5' />}
    </button>
  );
}

// ─── Tab bar ─────────────────────────────────────────────────────────────────
type Tab = 'params' | 'body' | 'responses' | 'examples';

const TAB_LABELS: Record<Tab, string> = {
  params   : 'Parameters',
  body     : 'Request Body',
  responses: 'Responses',
  examples : 'Code Examples',
};

// ─── Params table ─────────────────────────────────────────────────────────────
function ParamsTable({ params, title }: {
  params: NonNullable<Endpoint['pathParams']>;
  title : string;
}) {
  return (
    <div className='mb-4 last:mb-0'>
      <p className='text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2'>
        {title}
      </p>
      <div className='rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden'>
        <table className='w-full text-xs border-collapse'>
          <thead>
            <tr className='bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-100 dark:border-neutral-800'>
              {['Name', 'Type', 'Required', 'Description'].map((h) => (
                <th key={h} className='text-left px-3 py-2 text-neutral-500 dark:text-neutral-400 font-semibold whitespace-nowrap'>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {params.map((p, i) => (
              <tr
                key={p.name}
                className={i < params.length - 1 ? 'border-b border-neutral-100 dark:border-neutral-800/60' : ''}
              >
                <td className='px-3 py-2.5 align-top'>
                  <code className='font-mono font-semibold text-violet-700 dark:text-violet-400'>
                    {p.name}
                  </code>
                </td>
                <td className='px-3 py-2.5 align-top'>
                  <code className='font-mono text-neutral-500 dark:text-neutral-400'>
                    {p.type}
                  </code>
                </td>
                <td className='px-3 py-2.5 align-top'>
                  <span className={cn(
                    'inline-block rounded-full px-2 py-0.5 text-[10px] font-bold',
                    p.required
                      ? 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                  )}>
                    {p.required ? 'required' : 'optional'}
                  </span>
                </td>
                <td className='px-3 py-2.5 align-top text-neutral-500 dark:text-neutral-400 leading-relaxed'>
                  {p.description}
                  {p.example && (
                    <span className='block mt-0.5 text-neutral-400 dark:text-neutral-500'>
                      e.g. <code className='font-mono'>{String(p.example)}</code>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Response list ────────────────────────────────────────────────────────────
function ResponseList({ responses }: { responses: Endpoint['responses'] }) {
  return (
    <div className='space-y-3'>
      {responses.map(({ status, description, shape }) => (
        <div key={status} className='rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden'>
          <div className='flex items-center gap-3 px-3 py-2.5 bg-neutral-50 dark:bg-neutral-900/60'>
            <span className={cn(
              'font-mono font-bold text-sm',
              status >= 200 && status < 300 ? 'text-emerald-600 dark:text-emerald-400' :
              status >= 400 && status < 500 ? 'text-amber-600 dark:text-amber-400' :
              'text-red-600 dark:text-red-400'
            )}>
              {status}
            </span>
            <span className='text-xs text-neutral-600 dark:text-neutral-400'>{description}</span>
          </div>
          {shape && (
            <table className='w-full text-xs border-collapse border-t border-neutral-100 dark:border-neutral-800'>
              <tbody>
                {shape.map((field, i) => (
                  <tr
                    key={field.name}
                    className={i < shape.length - 1 ? 'border-b border-neutral-100 dark:border-neutral-800/60' : ''}
                  >
                    <td className='px-3 py-2 align-top w-1/3'>
                      <code className='font-mono text-violet-700 dark:text-violet-400'>{field.name}</code>
                    </td>
                    <td className='px-3 py-2 align-top w-1/6'>
                      <code className='font-mono text-neutral-500 dark:text-neutral-400'>{field.type}</code>
                    </td>
                    <td className='px-3 py-2 align-top text-neutral-500 dark:text-neutral-400 leading-relaxed'>
                      {field.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Code examples ────────────────────────────────────────────────────────────
function CodeExamples({ examples }: { examples: Endpoint['examples'] }) {
  const [active, setActive] = useState(examples[0]?.label ?? '');
  const current = examples.find((e) => e.label === active);

  return (
    <div className='rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden'>
      {/* Tab bar */}
      <div className='flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60'>
        {examples.map((ex) => (
          <button
            key={ex.label}
            onClick={() => setActive(ex.label)}
            className={cn(
              'px-4 py-2 text-xs font-semibold transition-colors border-b-2 -mb-px',
              active === ex.label
                ? 'border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100'
                : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            )}
          >
            {ex.label}
          </button>
        ))}
        <div className='ml-auto flex items-center pr-3'>
          {current && <CopyButton text={current.code} />}
        </div>
      </div>

      {/* Code block */}
      {current && (
        <pre className='overflow-x-auto p-4 text-[12px] font-mono text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-950/60 leading-relaxed'>
          <code>{current.code}</code>
        </pre>
      )}
    </div>
  );
}

// ─── Auth icon ────────────────────────────────────────────────────────────────
const AUTH_ICONS = {
  public: Globe,
  auth  : Lock,
  admin : ShieldAlert,
};

// ─── Main component ───────────────────────────────────────────────────────────
interface ApiDocsEndpointCardProps {
  endpoint  : Endpoint;
  defaultOpen?: boolean;
}

export const ApiDocsEndpointCard = ({
  endpoint,
  defaultOpen = false,
}: ApiDocsEndpointCardProps) => {
  const [open, setOpen]   = useState(defaultOpen);
  const [tab, setTab]     = useState<Tab>('examples');

  const hasParams    = (endpoint.pathParams?.length ?? 0) + (endpoint.queryParams?.length ?? 0) > 0;
  const hasBody      = (endpoint.bodyFields?.length ?? 0) > 0;
  const AuthIcon     = AUTH_ICONS[endpoint.auth];
  const authBadge    = AUTH_BADGE[endpoint.auth];

  // Determine which tabs to show
  const availableTabs: Tab[] = [
    ...(hasParams     ? ['params'    as Tab] : []),
    ...(hasBody       ? ['body'      as Tab] : []),
    'responses',
    'examples',
  ];

  return (
    <div
      id={endpoint.id}
      className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden scroll-mt-24'
    >
      {/* ── Header (always visible) ─────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className='w-full text-left flex items-start justify-between gap-4 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors'
      >
        <div className='flex items-start gap-3 min-w-0 flex-1'>
          {/* Method badge */}
          <span className={cn(
            'shrink-0 inline-block rounded-md border px-2 py-0.5 text-[11px] font-bold font-mono mt-0.5',
            METHOD_COLORS[endpoint.method]
          )}>
            {endpoint.method}
          </span>

          {/* Path + summary */}
          <div className='min-w-0'>
            <code className='text-sm font-mono text-neutral-800 dark:text-neutral-200 break-all leading-snug'>
              {endpoint.path}
            </code>
            <p className='text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug'>
              {endpoint.summary}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2 shrink-0 mt-0.5'>
          {/* Auth badge */}
          <span className={cn(
            'hidden sm:inline-flex items-center gap-1 text-[10px] font-bold rounded-full px-2.5 py-0.5',
            authBadge.style
          )}>
            <AuthIcon className='w-2.5 h-2.5 shrink-0' strokeWidth={2} />
            {authBadge.label}
          </span>

          {/* Deprecated */}
          {endpoint.deprecated && (
            <span className='text-[10px] font-bold bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 rounded-full px-2 py-0.5'>
              Deprecated
            </span>
          )}

          <ChevronDown
            className={cn(
              'w-4 h-4 text-neutral-400 transition-transform duration-200',
              open && 'rotate-180'
            )}
          />
        </div>
      </button>

      {/* ── Expanded body ────────────────────────────────────────────────── */}
      {open && (
        <div className='border-t border-neutral-100 dark:border-neutral-800'>
          {/* Description */}
          <div className='px-5 pt-4 pb-3'>
            <p className='text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed'>
              {endpoint.description}
            </p>
          </div>

          {/* Tab bar */}
          <div className='flex gap-0 border-y border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 overflow-x-auto'>
            {availableTabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors',
                  tab === t
                    ? 'border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100'
                    : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                )}
              >
                {TAB_LABELS[t]}
                {t === 'params' && hasParams && (
                  <span className='ml-1.5 text-[10px] bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-full px-1.5 py-0.5 font-bold'>
                    {(endpoint.pathParams?.length ?? 0) + (endpoint.queryParams?.length ?? 0)}
                  </span>
                )}
                {t === 'body' && hasBody && (
                  <span className='ml-1.5 text-[10px] bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-full px-1.5 py-0.5 font-bold'>
                    {endpoint.bodyFields?.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className='p-5'>
            {tab === 'params' && (
              <div>
                {(endpoint.pathParams?.length ?? 0) > 0 && (
                  <ParamsTable params={endpoint.pathParams!} title='Path Parameters' />
                )}
                {(endpoint.queryParams?.length ?? 0) > 0 && (
                  <ParamsTable params={endpoint.queryParams!} title='Query Parameters' />
                )}
              </div>
            )}

            {tab === 'body' && hasBody && (
              <ParamsTable params={endpoint.bodyFields!.map((f) => ({
                name       : f.name,
                type       : f.type,
                required   : f.required,
                description: f.description,
                example    : f.example !== undefined ? String(f.example) : undefined,
              }))} title='Request Body Fields' />
            )}

            {tab === 'responses' && (
              <ResponseList responses={endpoint.responses} />
            )}

            {tab === 'examples' && (
              <CodeExamples examples={endpoint.examples} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};