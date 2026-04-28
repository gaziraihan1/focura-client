import {
  Rocket, CheckSquare, Kanban, Timer, Users, BarChart2,
  Tag, FolderOpen, CreditCard, Bell, Shield, Settings2,
  LayoutGrid, Megaphone, HelpCircle, MonitorSmartphone,
} from 'lucide-react';

export interface HelpCategory {
  id      : string;
  icon    : React.ElementType;
  title   : string;
  description: string;
  articleCount: number;
  color   : string;
  iconBg  : string;
  iconColor: string;
}

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id         : 'getting-started',
    icon       : Rocket,
    title      : 'Getting Started',
    description: 'Account setup, workspace creation, onboarding steps, and first tasks.',
    articleCount: 8,
    color      : 'border-emerald-200 dark:border-emerald-800/50',
    iconBg     : 'bg-emerald-50 dark:bg-emerald-950/40',
    iconColor  : 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id         : 'tasks',
    icon       : CheckSquare,
    title      : 'Tasks & Subtasks',
    description: 'Create, assign, prioritise, filter, bulk-edit, and manage recurring tasks.',
    articleCount: 14,
    color      : 'border-blue-200 dark:border-blue-800/50',
    iconBg     : 'bg-blue-50 dark:bg-blue-950/40',
    iconColor  : 'text-blue-600 dark:text-blue-400',
  },
  {
    id         : 'views',
    icon       : Kanban,
    title      : 'Work Views',
    description: 'List, Kanban board, Calendar view, and Daily planner explained.',
    articleCount: 10,
    color      : 'border-violet-200 dark:border-violet-800/50',
    iconBg     : 'bg-violet-50 dark:bg-violet-950/40',
    iconColor  : 'text-violet-600 dark:text-violet-400',
  },
  {
    id         : 'focus',
    icon       : Timer,
    title      : 'Focus Sessions',
    description: 'Pomodoro, deep work, custom sessions, time tracking, and productivity stats.',
    articleCount: 7,
    color      : 'border-amber-200 dark:border-amber-800/50',
    iconBg     : 'bg-amber-50 dark:bg-amber-950/40',
    iconColor  : 'text-amber-600 dark:text-amber-400',
  },
  {
    id         : 'projects',
    icon       : LayoutGrid,
    title      : 'Projects',
    description: 'Create projects, set milestones, manage members, archive, and view analytics.',
    articleCount: 9,
    color      : 'border-cyan-200 dark:border-cyan-800/50',
    iconBg     : 'bg-cyan-50 dark:bg-cyan-950/40',
    iconColor  : 'text-cyan-600 dark:text-cyan-400',
  },
  {
    id         : 'collaboration',
    icon       : Users,
    title      : 'Collaboration',
    description: 'Comments, @mentions, announcements, activity feed, and real-time updates.',
    articleCount: 11,
    color      : 'border-rose-200 dark:border-rose-800/50',
    iconBg     : 'bg-rose-50 dark:bg-rose-950/40',
    iconColor  : 'text-rose-600 dark:text-rose-400',
  },
  {
    id         : 'analytics',
    icon       : BarChart2,
    title      : 'Analytics & Insights',
    description: 'Workspace dashboards, completion rates, focus metrics, and team activity.',
    articleCount: 6,
    color      : 'border-indigo-200 dark:border-indigo-800/50',
    iconBg     : 'bg-indigo-50 dark:bg-indigo-950/40',
    iconColor  : 'text-indigo-600 dark:text-indigo-400',
  },
  {
    id         : 'labels',
    icon       : Tag,
    title      : 'Labels & Organisation',
    description: 'Create custom labels, colour-code tasks, and filter by label.',
    articleCount: 4,
    color      : 'border-lime-200 dark:border-lime-800/50',
    iconBg     : 'bg-lime-50 dark:bg-lime-950/40',
    iconColor  : 'text-lime-600 dark:text-lime-500',
  },
  {
    id         : 'files',
    icon       : FolderOpen,
    title      : 'Files & Storage',
    description: 'Upload attachments, manage files with the browser, and track storage usage.',
    articleCount: 5,
    color      : 'border-orange-200 dark:border-orange-800/50',
    iconBg     : 'bg-orange-50 dark:bg-orange-950/40',
    iconColor  : 'text-orange-600 dark:text-orange-400',
  },
  {
    id         : 'billing',
    icon       : CreditCard,
    title      : 'Billing & Plans',
    description: 'Plan comparison, upgrade, downgrade, invoices, and cancellation.',
    articleCount: 8,
    color      : 'border-neutral-200 dark:border-neutral-700',
    iconBg     : 'bg-neutral-100 dark:bg-neutral-800',
    iconColor  : 'text-neutral-600 dark:text-neutral-300',
  },
  {
    id         : 'notifications',
    icon       : Bell,
    title      : 'Notifications',
    description: 'Real-time SSE notifications, mark as read, filter, and notification types.',
    articleCount: 5,
    color      : 'border-yellow-200 dark:border-yellow-800/50',
    iconBg     : 'bg-yellow-50 dark:bg-yellow-950/40',
    iconColor  : 'text-yellow-600 dark:text-yellow-500',
  },
  {
    id         : 'workspace-settings',
    icon       : Settings2,
    title      : 'Workspace Settings',
    description: 'Rename, roles (Owner/Admin/Member), invitations, and workspace limits.',
    articleCount: 7,
    color      : 'border-neutral-200 dark:border-neutral-700',
    iconBg     : 'bg-neutral-100 dark:bg-neutral-800',
    iconColor  : 'text-neutral-600 dark:text-neutral-300',
  },
  {
    id         : 'account-security',
    icon       : Shield,
    title      : 'Account & Security',
    description: 'Profile, password, Google OAuth, active sessions, and data export.',
    articleCount: 9,
    color      : 'border-teal-200 dark:border-teal-800/50',
    iconBg     : 'bg-teal-50 dark:bg-teal-950/40',
    iconColor  : 'text-teal-600 dark:text-teal-400',
  },
  {
    id         : 'announcements',
    icon       : Megaphone,
    title      : 'Announcements',
    description: 'Create workspace announcements, pin them, and target specific members.',
    articleCount: 3,
    color      : 'border-fuchsia-200 dark:border-fuchsia-800/50',
    iconBg     : 'bg-fuchsia-50 dark:bg-fuchsia-950/40',
    iconColor  : 'text-fuchsia-600 dark:text-fuchsia-400',
  },
  {
    id         : 'mobile',
    icon       : MonitorSmartphone,
    title      : 'Mobile & Responsive',
    description: 'Using Focura on phone, tablet, and desktop — tips and known limitations.',
    articleCount: 4,
    color      : 'border-sky-200 dark:border-sky-800/50',
    iconBg     : 'bg-sky-50 dark:bg-sky-950/40',
    iconColor  : 'text-sky-600 dark:text-sky-400',
  },
  {
    id         : 'troubleshooting',
    icon       : HelpCircle,
    title      : 'Troubleshooting',
    description: 'Common errors, login issues, sync problems, and how to report bugs.',
    articleCount: 10,
    color      : 'border-red-200 dark:border-red-800/50',
    iconBg     : 'bg-red-50 dark:bg-red-950/40',
    iconColor  : 'text-red-600 dark:text-red-400',
  },
];

interface HelpCategoriesProps {
  onCategoryClick: (id: string) => void;
}

export const HelpCategories = ({ onCategoryClick }: HelpCategoriesProps) => {
  return (
    <section className='max-w-6xl mx-auto px-6 py-14'>
      <div className='mb-8'>
        <p className='text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2'>
          Browse by topic
        </p>
        <h2 className='text-2xl font-bold text-neutral-900 dark:text-neutral-50'>
          All help categories
        </h2>
      </div>

      <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-3'>
        {HELP_CATEGORIES.map(({ id, icon: Icon, title, description, articleCount, color, iconBg, iconColor }) => (
          <button
            key={id}
            onClick={() => onCategoryClick(id)}
            className={`group text-left rounded-2xl border bg-white dark:bg-neutral-900 p-4 transition-all hover:shadow-sm hover:border-neutral-300 dark:hover:border-neutral-600 ${color}`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform ${iconBg}`}>
              <Icon className={`w-4.5 h-4.5 ${iconColor}`} strokeWidth={1.8} />
            </div>
            <p className='text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1 leading-tight'>
              {title}
            </p>
            <p className='text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3'>
              {description}
            </p>
            <span className='text-[11px] font-semibold text-neutral-400 dark:text-neutral-500'>
              {articleCount} articles
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};