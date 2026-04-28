'use client';

import { Search, ArrowRight }  from 'lucide-react';
import { HELP_CATEGORIES }     from './HelpCategories';

interface SearchResult {
  category  : string;
  article   : string;
  excerpt   : string;
}

// Flat search index built from category metadata + guide content
const SEARCH_INDEX: SearchResult[] = [
  // Getting started
  { category: 'Getting Started', article: 'Create your account',          excerpt: 'Sign up with email or Google OAuth. Verify your email within 24 hours.' },
  { category: 'Getting Started', article: 'Create your first workspace',  excerpt: 'A workspace is the top-level container for projects, tasks, and team members.' },
  { category: 'Getting Started', article: 'Invite your team',             excerpt: 'Settings → Members → Invite. Invitations expire after 7 days.' },
  { category: 'Getting Started', article: 'Create a project',             excerpt: 'Projects group related tasks. Set name, colour, start date, and due date.' },
  { category: 'Getting Started', article: 'Add your first task',          excerpt: 'Inside a project, click New Task. Press Shift+N for the quick-create dialog.' },
  { category: 'Getting Started', article: 'Start a focus session',        excerpt: 'Click Focus in the sidebar. Choose Pomodoro, Deep Work, or Custom mode.' },
  // Tasks
  { category: 'Tasks',           article: 'Creating a task',              excerpt: 'Every task has title, status, priority, assignees, labels, and due date.' },
  { category: 'Tasks',           article: 'Task statuses',                excerpt: 'Todo, In Progress, In Review, Blocked, Completed, Cancelled.' },
  { category: 'Tasks',           article: 'Assigning tasks',              excerpt: 'Open a task and click Assignees. Multiple members can be assigned.' },
  { category: 'Tasks',           article: 'Subtasks',                     excerpt: 'Scroll to the Subtasks section in a task and click Add subtask.' },
  { category: 'Tasks',           article: 'Task dependencies',            excerpt: 'Add blocking dependencies from the Dependencies tab inside a task.' },
  { category: 'Tasks',           article: 'Recurring tasks',              excerpt: 'Toggle Recurring in a task. Choose Daily, Weekly, Monthly, or Custom.' },
  { category: 'Tasks',           article: 'Bulk operations',              excerpt: 'In List view, check multiple tasks to bulk-change status, priority, or labels.' },
  { category: 'Tasks',           article: 'Filtering and sorting',        excerpt: 'Filter by status, priority, assignee, label, due date. Combine multiple filters.' },
  { category: 'Tasks',           article: 'Time entries',                 excerpt: 'Log time on a task from the Time Entries tab. Supports billable hours.' },
  // Views
  { category: 'Views',           article: 'List View',                    excerpt: 'Default view. Flat list with full metadata. Supports bulk selection.' },
  { category: 'Views',           article: 'Kanban Board',                 excerpt: 'Drag-and-drop cards between status columns. Configure WIP limits.' },
  { category: 'Views',           article: 'Calendar View',                excerpt: 'Tasks appear on the month calendar based on their due dates.' },
  { category: 'Views',           article: 'Daily Tasks View',             excerpt: 'Personal daily planning space. Mark tasks as Primary or Secondary.' },
  // Focus
  { category: 'Focus Sessions',  article: 'Starting a focus session',     excerpt: 'Click Focus in the sidebar. Choose Pomodoro, Deep Work, or Custom.' },
  { category: 'Focus Sessions',  article: 'Pomodoro mode',                excerpt: '25 min work, 5 min short break, 15 min long break after 4 rounds.' },
  { category: 'Focus Sessions',  article: 'Deep Work mode',               excerpt: '90-minute uninterrupted focus block with no scheduled breaks.' },
  { category: 'Focus Sessions',  article: 'Focus analytics',              excerpt: 'Analytics → Focus Stats: daily minutes, session type, streak.' },
  // Collaboration
  { category: 'Collaboration',   article: 'Commenting on tasks',          excerpt: 'Open a task and scroll to Comments. Markdown supported. Press Enter to post.' },
  { category: 'Collaboration',   article: '@mentions',                    excerpt: 'Type @ in any comment to mention a team member. They get a real-time notification.' },
  { category: 'Collaboration',   article: 'Announcements',                excerpt: 'Workspace → Announcements → New Announcement. Pin for visibility.' },
  { category: 'Collaboration',   article: 'Activity feed',                excerpt: 'Chronological log of all workspace actions. Filterable by entity type.' },
  { category: 'Collaboration',   article: 'Real-time updates (SSE)',      excerpt: 'No page refresh needed. Notifications appear instantly via Server-Sent Events.' },
  // Billing
  { category: 'Billing',         article: 'Available plans',              excerpt: 'Free, Pro, Business, Enterprise. Compare limits on the Pricing page.' },
  { category: 'Billing',         article: 'Upgrading your plan',          excerpt: 'Settings → Billing → Upgrade. Takes effect immediately, pro-rated.' },
  { category: 'Billing',         article: 'Billing history and invoices', excerpt: 'Settings → Billing → Invoices. PDF download available for each invoice.' },
  { category: 'Billing',         article: 'Cancelling a subscription',    excerpt: 'Settings → Billing → Cancel. Access remains until period end.' },
  { category: 'Billing',         article: 'Requesting a refund',          excerpt: '7-day window for first-time subscribers with minimal usage. Email focurabusiness@gmail.com.' },
  { category: 'Billing',         article: 'Updating payment method',      excerpt: 'Settings → Billing → Payment Method. New card takes effect next billing date.' },
  // Security & Account
  { category: 'Account',         article: 'Updating your profile',        excerpt: 'Settings → Account → Profile. Name, avatar, bio, timezone.' },
  { category: 'Account',         article: 'Changing your password',       excerpt: 'Settings → Account → Security → Change Password.' },
  { category: 'Account',         article: 'Reset password',               excerpt: 'Click Forgot password on the login page. Link expires in 1 hour.' },
  { category: 'Account',         article: 'Active sessions and logout',   excerpt: 'Settings → Account → Security → Active Sessions. Log out specific devices.' },
  { category: 'Account',         article: 'Deleting your account',        excerpt: 'Settings → Account → Danger Zone. Data purged within 30 days.' },
  { category: 'Account',         article: 'Data export',                  excerpt: 'Settings → Account → Privacy → Export Data. JSON file emailed within 24 hours.' },
  // Troubleshooting
  { category: 'Troubleshooting', article: 'Cannot log in',                excerpt: 'Reset password, check for typos, clear browser cache. Contact support if persists.' },
  { category: 'Troubleshooting', article: 'Notifications not working',    excerpt: 'SSE may be blocked by VPN or firewall. Try a different browser.' },
  { category: 'Troubleshooting', article: 'File upload fails',            excerpt: 'Check file size limit and remaining storage. Try a different browser.' },
  { category: 'Troubleshooting', article: 'Tasks not in Kanban',          excerpt: 'Tasks must be assigned to a project to appear in its Kanban view.' },
  { category: 'Troubleshooting', article: 'Invitation email not received', excerpt: 'Check spam folder. Resend from Settings → Members → Pending Invitations.' },
  { category: 'Troubleshooting', article: 'Reporting a bug',              excerpt: 'Contact form → Technical Issue. Include browser, OS, steps to reproduce, screenshots.' },
  { category: 'Troubleshooting', article: 'Reporting a security vulnerability', excerpt: 'Email security@focura.app. Do not open a public GitHub issue.' },
  // Workspace settings
  { category: 'Workspace',       article: 'Renaming your workspace',      excerpt: 'Settings → Workspace → General. Only Owner and Admins can edit.' },
  { category: 'Workspace',       article: 'Workspace plan limits',        excerpt: 'Free: 5 members, 3 projects, 500 MB storage. Settings → Usage.' },
  { category: 'Workspace',       article: 'Removing a member',            excerpt: 'Settings → Members → three-dot menu → Remove. Access is immediately revoked.' },
  { category: 'Workspace',       article: 'Deleting a workspace',         excerpt: 'Settings → Workspace → Danger Zone. Only Owner can delete. Cannot be undone.' },
];

interface HelpSearchResultsProps {
  query: string;
}

export const HelpSearchResults = ({ query }: HelpSearchResultsProps) => {
  if (!query.trim()) return null;

  const q = query.toLowerCase();

  // Match against article title, excerpt, and category
  const results = SEARCH_INDEX.filter(
    (r) =>
      r.article.toLowerCase().includes(q) ||
      r.excerpt.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
  ).slice(0, 12);

  // Also match categories
  const categoryMatches = HELP_CATEGORIES.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
  ).slice(0, 4);

  if (results.length === 0 && categoryMatches.length === 0) {
    return (
      <section className='border-t border-neutral-100 dark:border-neutral-800/60'>
        <div className='max-w-4xl mx-auto px-6 py-12 text-center'>
          <Search className='w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-3' strokeWidth={1.5} />
          <p className='text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1'>
            No results for &quot;{query}&quot;
          </p>
          <p className='text-xs text-neutral-400 dark:text-neutral-500 mb-5'>
            Try different keywords, or browse the categories above.
          </p>
          <a
            href='/contact'
            className='inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors underline underline-offset-2'
          >
            Ask our support team
            <ArrowRight className='w-3.5 h-3.5 shrink-0' strokeWidth={2.5} />
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className='border-t border-neutral-100 dark:border-neutral-800/60'>
      <div className='max-w-4xl mx-auto px-6 py-10'>
        <p className='text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-5'>
          {results.length + categoryMatches.length} result{results.length + categoryMatches.length !== 1 ? 's' : ''} for &quot;{query}&quot;
        </p>

        {/* Category hits */}
        {categoryMatches.length > 0 && (
          <div className='mb-6'>
            <p className='text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2'>
              Categories
            </p>
            <div className='grid sm:grid-cols-2 gap-2'>
              {categoryMatches.map(({ icon: Icon, id, title, description, iconBg, iconColor, color }) => (
                <div
                  key={id}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 bg-white dark:bg-neutral-900 ${color}`}
                >
                  <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} strokeWidth={1.8} />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-tight'>{title}</p>
                    <p className='text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5'>{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Article hits */}
        {results.length > 0 && (
          <div>
            <p className='text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2'>
              Articles
            </p>
            <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden'>
              {results.map((r) => (
                <div
                  key={`${r.category}::${r.article}`}
                  className='flex items-start gap-3 px-4 py-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors group'
                >
                  <div className='shrink-0 mt-0.5'>
                    <Search className='w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-400 transition-colors' strokeWidth={2} />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2 mb-0.5'>
                      <span className='text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 shrink-0'>
                        {r.category}
                      </span>
                    </div>
                    <p className='text-sm font-semibold text-neutral-800 dark:text-neutral-200 leading-snug mb-0.5'>
                      {r.article}
                    </p>
                    <p className='text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2'>
                      {r.excerpt}
                    </p>
                  </div>
                  <ArrowRight className='w-3.5 h-3.5 shrink-0 text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors mt-1' strokeWidth={2} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};