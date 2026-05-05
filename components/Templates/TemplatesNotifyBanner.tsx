'use client';

import { useState } from 'react';
import { Bell, CheckCircle2, Loader2, Mail } from 'lucide-react';

type State = 'idle' | 'loading' | 'success' | 'error';

const TemplatesNotifyBanner = () => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (state === 'loading') return;

    if (!email.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setState('loading');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/templates`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setState('error');
        setError(data?.message || 'Failed to subscribe.');
        return;
      }

      // success
      setState('success');
      setEmail('');

    } catch (err) {
      console.error(err);
      setState('error');
      setError('Network error. Please try again.');
    }
  };

  return (
    <section className='border-t border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/20'>
      <div className='max-w-4xl mx-auto px-6 py-16 md:py-20'>
        <div className='rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden relative'>
          {/* Subtle grid */}
          <div
            className='absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none'
            style={{
              backgroundImage: `linear-gradient(var(--color-neutral-900,#171717) 1px,transparent 1px),
                linear-gradient(90deg,var(--color-neutral-900,#171717) 1px,transparent 1px)`,
              backgroundSize: '28px 28px',
            }}
          />

          <div className='relative px-8 py-12 md:px-14 md:py-16 text-center'>
            {/* Icon */}
            <div className='w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-6'>
              <Bell className='w-6 h-6 text-neutral-600 dark:text-neutral-300' strokeWidth={1.8} />
            </div>

            <h2 className='text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-3'>
              Be first when templates launch.
            </h2>

            <p className='text-sm text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed mb-8'>
              Templates are in active development. Drop your email and we&apos;ll
              notify you the moment they&apos;re available in your workspace — no
              spam, one email only.
            </p>

            {state === 'success' ? (
              /* Success state */
              <div className='flex flex-col items-center gap-3'>
                <div className='w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center'>
                  <CheckCircle2
                    className='w-6 h-6 text-emerald-600 dark:text-emerald-400'
                    strokeWidth={2}
                  />
                </div>

                <p className='text-sm font-bold text-neutral-900 dark:text-neutral-100'>
                  You&apos;re on the list!
                </p>

                <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                  We&apos;ll notify you when templates go live.
                </p>
              </div>
            ) : (
              /* Form */
              <form
                onSubmit={handleSubmit}
                className='flex flex-col sm:flex-row items-stretch gap-3 max-w-md mx-auto'
                noValidate
              >
                <div className='relative flex-1'>
                  <Mail
                    className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 pointer-events-none'
                    strokeWidth={1.8}
                  />

                  <input
                    type='email'
                    placeholder='your@email.com'
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                      if (state !== 'idle') setState('idle');
                    }}
                    disabled={state === 'loading'}
                    className='w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700 transition-colors disabled:opacity-60'
                  />
                </div>

                <button
                  type='submit'
                  disabled={state === 'loading' || !email.trim()}
                  className='inline-flex items-center justify-center gap-2 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 rounded-xl px-5 py-3 text-sm font-bold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
                >
                  {state === 'loading' ? (
                    <>
                      <Loader2 className='w-4 h-4 animate-spin' />
                      Saving…
                    </>
                  ) : (
                    'Notify me'
                  )}
                </button>
              </form>
            )}

            {/* Error */}
            {error && (
              <p className='mt-2 text-xs text-red-600 dark:text-red-400'>
                {error}
              </p>
            )}

            {/* Privacy note */}
            {state !== 'success' && (
              <p className='mt-4 text-[11px] text-neutral-400 dark:text-neutral-500'>
                One email only. No spam. Unsubscribe at any time.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TemplatesNotifyBanner;