import { MousePointerClick, Zap, Rocket, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon      : MousePointerClick,
    number    : '01',
    title     : 'Browse & choose',
    description:
      'Filter by category — Engineering, Product, Marketing, HR, and more. Preview each template\'s task list, sections, labels, and milestones before importing.',
    detail    : 'Every template shows you exactly what you\'ll get: the number of tasks, the sections structure, the colour-coded labels, and which Focura views (Kanban, List, Calendar) will be pre-configured.',
    color     : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50',
    iconBg    : 'bg-blue-100 dark:bg-blue-900/60',
    iconColor : 'text-blue-600 dark:text-blue-400',
  },
  {
    icon      : Zap,
    number    : '02',
    title     : 'Import in one click',
    description:
      'Hit "Use Template" and choose a destination workspace. Focura clones the entire project structure — all tasks, labels, sections, views, and milestones — instantly.',
    detail    : 'Import creates a new project in your workspace. Nothing from the template overwrites existing projects. You can import the same template multiple times (e.g. one sprint board per sprint cycle).',
    color     : 'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800/50',
    iconBg    : 'bg-violet-100 dark:bg-violet-900/60',
    iconColor : 'text-violet-600 dark:text-violet-400',
  },
  {
    icon      : Rocket,
    number    : '03',
    title     : 'Customise & ship',
    description:
      'The imported project is yours — rename tasks, reassign labels, invite team members, and start focus sessions. Everything is editable after import.',
    detail    : 'Templates are starting points, not constraints. Delete what you don\'t need, add what you do. You can also save your customised version as your own template (coming in v1.1).',
    color     : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50',
    iconBg    : 'bg-emerald-100 dark:bg-emerald-900/60',
    iconColor : 'text-emerald-600 dark:text-emerald-400',
  },
];

const TemplatesHowItWorks = () => {
  return (
    <section className='border-t border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/20'>
      <div className='max-w-5xl mx-auto px-6 py-16 md:py-20'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <p className='text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3'>
            How it works
          </p>
          <h2 className='text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-2'>
            From template to productive in minutes.
          </h2>
          <p className='text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed'>
            No manual setup. No blank-canvas paralysis. Just a structured project
            ready for your team to hit the ground running.
          </p>
        </div>

        {/* Steps */}
        <div className='grid md:grid-cols-3 gap-5 mb-12'>
          {steps.map(({ icon: Icon, number, title, description, detail, color, iconBg, iconColor }) => (
            <div
              key={number}
              className={`rounded-2xl border p-6 ${color}`}
            >
              {/* Number + Icon */}
              <div className='flex items-center gap-3 mb-5'>
                <span className='text-xs font-bold font-mono text-neutral-300 dark:text-neutral-600'>
                  {number}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
                  <Icon className={`w-4.5 h-4.5 ${iconColor}`} strokeWidth={1.8} />
                </div>
              </div>

              <h3 className='text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-2'>
                {title}
              </h3>
              <p className='text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3'>
                {description}
              </p>
              <p className='text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed italic'>
                {detail}
              </p>
            </div>
          ))}
        </div>

        {/* What gets cloned */}
        <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden'>
          <div className='px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80'>
            <p className='text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider'>
              What gets cloned when you import a template
            </p>
          </div>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100 dark:divide-neutral-800'>
            {[
              { emoji: '✅', label: 'Tasks & subtasks',       detail: 'All pre-built tasks with title, priority, and status' },
              { emoji: '🏷️', label: 'Labels & colours',       detail: 'Category labels with your template\'s colour palette'  },
              { emoji: '📂', label: 'Sections / columns',      detail: 'Workflow stages mapped to Kanban columns and list groups' },
              { emoji: '📅', label: 'Milestones',              detail: 'Key project checkpoints with relative due dates'       },
              { emoji: '👁️', label: 'View configurations',    detail: 'Kanban, List, Calendar views set up as defined'        },
              { emoji: '⚙️', label: 'Project settings',        detail: 'Name, colour, icon, and priority pre-configured'      },
            ].map(({ emoji, label, detail }) => (
              <div key={label} className='flex items-start gap-3 p-4'>
                <span className='text-lg shrink-0'>{emoji}</span>
                <div>
                  <p className='text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5'>{label}</p>
                  <p className='text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed'>{detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className='px-5 py-3.5 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex items-center gap-2'>
            <span className='w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 shrink-0' />
            <p className='text-[11px] text-neutral-400 dark:text-neutral-500'>
              Note: actual task assignees and real dates are not cloned — those are set by you after import.
            </p>
          </div>
        </div>

        {/* CTA to help */}
        <div className='mt-8 flex items-center justify-center'>
          <Link
            href='/help#getting-started'
            className='inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors'
          >
            Read the full Getting Started guide
            <ArrowRight className='w-4 h-4 shrink-0' strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TemplatesHowItWorks;