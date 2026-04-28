import Link         from 'next/link';
import {
  Mail, Github, MessageSquare, FileText,
  Shield, BookOpen, ArrowRight,
} from 'lucide-react';

const channels = [
  {
    icon       : MessageSquare,
    title      : 'Contact Support',
    description: 'Send us a message and we will reply within 2 business days.',
    label      : 'Open contact form',
    href       : '/contact',
    external   : false,
    accent     : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40',
    iconBg     : 'bg-blue-100 dark:bg-blue-900/60',
    iconColor  : 'text-blue-600 dark:text-blue-400',
  },
  {
    icon       : Mail,
    title      : 'Email Us Directly',
    description: 'For billing, general enquiries, or anything not covered here.',
    label      : 'focurabusiness@gmail.com',
    href       : 'mailto:focurabusiness@gmail.com',
    external   : true,
    accent     : 'bg-neutral-50 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800',
    iconBg     : 'bg-neutral-100 dark:bg-neutral-800',
    iconColor  : 'text-neutral-600 dark:text-neutral-300',
  },
  {
    icon       : Shield,
    title      : 'Security Issues',
    description: 'Found a vulnerability? Please disclose responsibly — not via public issues.',
    label      : 'focurabusiness@gmail.com',
    href       : 'mailto:focurabusiness@gmail.com',
    external   : true,
    accent     : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40',
    iconBg     : 'bg-red-100 dark:bg-red-950/50',
    iconColor  : 'text-red-600 dark:text-red-400',
  },
  {
    icon       : Github,
    title      : 'GitHub Issues',
    description: 'Report non-security bugs or follow along with open issues.',
    label      : 'View on GitHub',
    href       : 'https://github.com/gaziraihan1/focura-client/issues',
    external   : true,
    accent     : 'bg-neutral-50 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800',
    iconBg     : 'bg-neutral-100 dark:bg-neutral-800',
    iconColor  : 'text-neutral-600 dark:text-neutral-300',
  },
];

const docLinks = [
  {
    icon : FileText,
    label: 'Architecture Documentation',
    href : 'https://github.com/gaziraihan1/focura-client/blob/main/ARCHITECTURE.md',
  },
  {
    icon : Shield,
    label: 'Authentication & Security Docs',
    href : 'https://github.com/gaziraihan1/focura-client/blob/main/AUTHENTICATION.md',
  },
  {
    icon : BookOpen,
    label: 'Contributing Guidelines',
    href : 'https://github.com/gaziraihan1/focura-client/blob/main/CONTRIBUTING.md',
  },
  {
    icon : FileText,
    label: 'Code of Conduct',
    href : 'https://github.com/gaziraihan1/focura-client/blob/main/CODE_OF_CONDUCT.md',
  },
];

export const HelpContactCard = () => {
  return (
    <section className='border-t border-neutral-100 dark:border-neutral-800/60'>
      <div className='max-w-4xl mx-auto px-6 py-14 space-y-12'>

        {/* ── Still need help? ──────────────────────────────────────────────── */}
        <div>
          <div className='mb-8'>
            <p className='text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2'>
              Still need help?
            </p>
            <h2 className='text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1'>
              Get in touch with us.
            </h2>
            <p className='text-sm text-neutral-500 dark:text-neutral-400'>
              Can&apos;t find what you&apos;re looking for? Our team responds within 2 business days.
            </p>
          </div>

          <div className='grid sm:grid-cols-2 gap-3'>
            {channels.map(({ icon: Icon, title, description, label, href, external, accent, iconBg, iconColor }) => (
              <Link
                key={title}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className={`group flex items-start gap-4 rounded-2xl border p-5 transition-all hover:shadow-sm ${accent}`}
              >
                <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} strokeWidth={1.8} />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-0.5'>
                    {title}
                  </p>
                  <p className='text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-2'>
                    {description}
                  </p>
                  <span className='inline-flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 group-hover:gap-2 transition-all'>
                    {label}
                    <ArrowRight className='w-3 h-3 shrink-0' strokeWidth={2.5} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Developer & legal docs ────────────────────────────────────────── */}
        <div>
          <p className='text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4'>
            Developer & Legal Documentation
          </p>
          <div className='grid sm:grid-cols-2 gap-2'>
            {docLinks.map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm transition-all group'
              >
                <Icon
                  className='w-4 h-4 shrink-0 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors'
                  strokeWidth={1.8}
                />
                <span className='text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors'>
                  {label}
                </span>
                <ArrowRight className='w-3.5 h-3.5 shrink-0 text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors ml-auto' strokeWidth={2} />
              </Link>
            ))}
          </div>
        </div>

        {/* ── Policy links ─────────────────────────────────────────────────── */}
        <div className='rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 px-6 py-5'>
          <p className='text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3'>
            Legal & Policies
          </p>
          <div className='flex flex-wrap gap-x-5 gap-y-2'>
            {[
              { label: 'Privacy Policy',   href: '/privacy'  },
              { label: 'Terms & Conditions', href: '/terms'  },
              { label: 'Cookie Policy',    href: '/cookies'  },
              { label: 'Refund Policy',    href: '/refund'   },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className='text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 underline underline-offset-2 decoration-neutral-300 dark:decoration-neutral-600 hover:decoration-neutral-600 dark:hover:decoration-neutral-400 transition-colors'
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};