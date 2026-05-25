import Link                    from 'next/link';
import { ArrowRight, Zap, MessageSquare, BookOpen } from 'lucide-react';

const links = [
  {
    icon       : Zap,
    label      : 'Try Focura free',
    sublabel   : 'Start a workspace in 30 seconds',
    href       : '/dashboard/create-workspace',
    external   : true,
    primary    : true,
  },
  {
    icon       : MessageSquare,
    label      : 'Request a template',
    sublabel   : 'Tell us what you need',
    href       : '/contact',
    external   : false,
    primary    : false,
  },
  {
    icon       : BookOpen,
    label      : 'Read the guides',
    sublabel   : 'How to set up your first project',
    href       : '/guides',
    external   : false,
    primary    : false,
  },
];

const TemplatesCTA = () => {
  return (
    <section className='border-t border-neutral-100 dark:border-neutral-800/60'>
      <div className='max-w-5xl mx-auto px-6 py-14 md:py-18'>
        <div className='text-center mb-10'>
          <h2 className='text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-3'>
            Ready to work smarter?
          </h2>
          <p className='text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed'>
            Templates are coming. In the meantime, your team can start building
            in Focura today — create projects from scratch and we&apos;ll import the
            template structure when it launches.
          </p>
        </div>

        <div className='flex flex-col sm:flex-row items-stretch justify-center gap-4 max-w-xl mx-auto'>
          {links.map(({ icon: Icon, label, sublabel, href, external, primary }) => (
            <Link
              key={label}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className={`flex-1 flex items-center gap-3 rounded-2xl border px-5 py-4 transition-all group ${
                primary
                  ? 'bg-neutral-900 dark:bg-neutral-50 border-neutral-900 dark:border-neutral-100 hover:bg-neutral-700 dark:hover:bg-neutral-200'
                  : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm'
              }`}
            >
              <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                primary
                  ? 'bg-white/15 dark:bg-neutral-900/20'
                  : 'bg-neutral-100 dark:bg-neutral-800'
              }`}>
                <Icon
                  className={`w-4.5 h-4.5 ${
                    primary
                      ? 'text-white dark:text-neutral-900'
                      : 'text-neutral-600 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100'
                  }`}
                  strokeWidth={1.8}
                />
              </div>
              <div className='min-w-0 flex-1 text-left'>
                <p className={`text-sm font-bold leading-tight ${
                  primary ? 'text-white dark:text-neutral-900' : 'text-neutral-900 dark:text-neutral-100'
                }`}>
                  {label}
                </p>
                <p className={`text-[11px] mt-0.5 ${
                  primary ? 'text-white/70 dark:text-neutral-900/60' : 'text-neutral-400 dark:text-neutral-500'
                }`}>
                  {sublabel}
                </p>
              </div>
              <ArrowRight
                className={`w-4 h-4 shrink-0 ${
                  primary ? 'text-white/70 dark:text-neutral-900/60' : 'text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 dark:group-hover:text-neutral-400'
                } transition-colors`}
                strokeWidth={2}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplatesCTA;