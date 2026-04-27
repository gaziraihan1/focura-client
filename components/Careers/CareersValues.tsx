import { Zap, Globe, MessageSquare, Code2, Heart, Clock } from 'lucide-react';

const values = [
  {
    icon       : Code2,
    title      : 'Craft over velocity',
    description: `We ship thoughtfully. Every feature we build should genuinely make someone's work life better — not just close a ticket.`,
  },
  {
    icon       : Globe,
    title      : 'Remote-first by design',
    description: 'The team works async across time zones. We write clearly, document decisions, and trust people to manage their own time.',
  },
  {
    icon       : Zap,
    title      : 'Real ownership',
    description: 'You own your domain end-to-end — from spec to deploy. No committees. No second-guessing from above. Just you and the work.',
  },
  {
    icon       : MessageSquare,
    title      : 'Honest communication',
    description: 'We share context openly, disagree directly and respectfully, and write things down so everyone can stay aligned without meetings.',
  },
  {
    icon       : Heart,
    title      : 'Users first, always',
    description: 'Every decision starts with the user. We obsess over the details that make Focura feel fast, reliable, and genuinely pleasant to use.',
  },
  {
    icon       : Clock,
    title      : 'Sustainable pace',
    description: 'We are building a lasting product, not sprinting to burnout. Good work requires rest, focus time, and room to think.',
  },
];

export const CareersValues = () => {
  return (
    <section className='border-t border-neutral-100 dark:border-neutral-800/60'>
      <div className='max-w-5xl mx-auto px-6 py-16 md:py-20'>
        <div className='mb-10'>
          <p className='text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3'>
            Why Focura
          </p>
          <h2 className='text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50'>
            What it&apos;s like to work here.
          </h2>
        </div>

        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {values.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className='group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors'
            >
              <div className='w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform'>
                <Icon className='w-4.5 h-4.5 text-neutral-600 dark:text-neutral-300' strokeWidth={1.8} />
              </div>
              <p className='text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1.5'>{title}</p>
              <p className='text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed'>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};