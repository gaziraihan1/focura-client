import { Sparkles, GitFork, Share2, Star, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon       : GitFork,
    title      : 'Save any project as a template',
    description: 'Once you have a project structure you love, hit "Save as Template" from the project settings menu. Your tasks, sections, labels, views, and milestones are captured exactly as-is.',
    status     : 'Planned for v1.1',
    statusColor: 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400',
  },
  {
    icon       : Lock,
    title      : 'Private workspace templates',
    description: 'Save templates privately inside your workspace. Perfect for repeated processes — sprint boards, onboarding checklists, or campaign plans your team runs every cycle.',
    status     : 'Planned for v1.1',
    statusColor: 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400',
  },
  {
    icon       : Share2,
    title      : 'Share publicly with the community',
    description: 'Opt-in to publish your template to the Focura public gallery. Other teams can discover and import it. You\'ll be credited as the template author.',
    status     : 'Planned for v1.2',
    statusColor: 'bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400',
  },
  {
    icon       : Star,
    title      : 'Ratings and usage stats',
    description: 'Published templates will show usage count and star ratings from other teams. The most-used community templates will be featured on this page.',
    status     : 'Planned for v1.2',
    statusColor: 'bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400',
  },
];

const TemplatesForCreators = () => {
  return (
    <section className='border-t border-neutral-100 dark:border-neutral-800/60'>
      <div className='max-w-5xl mx-auto px-6 py-16 md:py-20'>
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12'>
          <div>
            <div className='inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-violet-800/50 bg-violet-50 dark:bg-violet-950/30 px-3 py-1 text-xs font-semibold text-violet-700 dark:text-violet-400 mb-4'>
              <Sparkles className='w-3.5 h-3.5 shrink-0' />
              Coming in v1.1 & v1.2
            </div>
            <h2 className='text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-2'>
              Build your own templates.
              <br />
              <span className='text-neutral-400 dark:text-neutral-500'>
                Share with the world.
              </span>
            </h2>
            <p className='text-sm text-neutral-500 dark:text-neutral-400 max-w-lg leading-relaxed'>
              The official templates are just the beginning. Soon you&apos;ll be able
              to turn any Focura project into a reusable template — privately for
              your team or publicly for the whole community.
            </p>
          </div>

          <div className='shrink-0'>
            <Link
              href='/contact'
              className='inline-flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors'
            >
              Request a template
              <ArrowRight className='w-4 h-4 shrink-0' strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className='grid sm:grid-cols-2 gap-4 mb-10'>
          {features.map(({ icon: Icon, title, description, status, statusColor }) => (
            <div
              key={title}
              className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-4'
            >
              <div className='flex items-start justify-between gap-3'>
                <div className='w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0'>
                  <Icon className='w-4.5 h-4.5 text-neutral-600 dark:text-neutral-300' strokeWidth={1.8} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide rounded-full px-2.5 py-0.5 h-fit shrink-0 ${statusColor}`}>
                  {status}
                </span>
              </div>
              <div>
                <p className='text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1.5'>
                  {title}
                </p>
                <p className='text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed'>
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 p-6'>
          <p className='text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-5'>
            Delivery Roadmap
          </p>
          <div className='relative space-y-4'>
            {/* Connector line */}
            <div className='absolute left-2.75 top-3 bottom-3 w-px bg-neutral-200 dark:bg-neutral-700 pointer-events-none' />
            {[
              { version: 'v1.0 (Now)',     desc: 'Official template library — browse, preview, and get notified',           done: true  },
              { version: 'v1.1',           desc: 'One-click import into workspace — clone all tasks, labels, and sections', done: false },
              { version: 'v1.1',           desc: 'Save any project as a private workspace template',                       done: false },
              { version: 'v1.2',           desc: 'Publish templates publicly — community gallery + author credits',         done: false },
              { version: 'v1.2',           desc: 'Ratings, usage counts, and featured templates section',                   done: false },
            ].map(({ version, desc, done }, i) => (
              <div key={i} className='flex items-start gap-4 relative z-10'>
                <div className={`shrink-0 w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  done
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900'
                }`}>
                  {done && (
                    <svg className='w-3 h-3 text-white' viewBox='0 0 12 12' fill='none'>
                      <path d='M2 6l3 3 5-5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                    </svg>
                  )}
                </div>
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    done ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400 dark:text-neutral-500'
                  }`}>
                    {version}
                  </span>
                  <p className='text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed'>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TemplatesForCreators;