import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    number : '01',
    title  : 'Create your account',
    detail : 'Sign up at focura-client.vercel.app using your email and password, or continue with Google OAuth for one-click access. Verify your email address when prompted — the confirmation link is valid for 24 hours.',
    tips   : [
      'Use Google OAuth to skip email verification entirely.',
      'Your password is hashed with Argon2id — Focura never stores plaintext passwords.',
      'You can change your email later from Settings → Account.',
    ],
  },
  {
    number : '02',
    title  : 'Create your first workspace',
    detail : 'A workspace is the top-level container for all your projects, tasks, and team members. After signing in you will be prompted to create one. Give it a name (e.g. your company or team name), choose a colour, and optionally upload a logo.',
    tips   : [
      'You can own up to 3 workspaces on the free plan.',
      'Workspace slugs are unique — used in URLs and invitations.',
      'You can create additional workspaces from the workspace switcher in the sidebar.',
    ],
  },
  {
    number : '03',
    title  : 'Invite your team',
    detail : 'Go to Settings → Members → Invite. Enter the email addresses of your team members and assign each a role. Invitations are sent via email and expire after 7 days. Members must have a Focura account (or create one) to accept.',
    tips   : [
      'Roles: Owner (full control), Admin (member & project management), Member (task access).',
      'The free plan supports up to 5 members per workspace.',
      'Pending invitations can be resent or cancelled from the Members page.',
    ],
  },
  {
    number : '04',
    title  : 'Create a project',
    detail : 'Projects group related tasks together. Navigate to your workspace dashboard and click "New Project". Set a name, description, colour, start date, and due date. You can add specific team members to a project independently of the workspace.',
    tips   : [
      'Project roles: Manager, Collaborator, Viewer — independent of workspace roles.',
      'Projects can be set to Active, On Hold, Completed, or Archived.',
      'You can create up to 3 projects on the free plan.',
    ],
  },
  {
    number : '05',
    title  : 'Add your first task',
    detail : 'Inside a project, click "New Task". Fill in the title, description, assignees, priority, due date, and labels. Tasks can be viewed across four views — List, Kanban, Calendar, and Daily — without any extra setup.',
    tips   : [
      'Press Shift+N anywhere in the dashboard to open the quick-create task dialog.',
      'Tasks can have subtasks, dependencies, time entries, and file attachments.',
      'Set a task as "Focus Required" to surface it in focus session suggestions.',
    ],
  },
  {
    number : '06',
    title  : 'Start your first focus session',
    detail : 'Click the Focus button in the sidebar or navigate to Dashboard → Focus. Choose a mode: Pomodoro (25 min work / 5 min break), Deep Work (90 min uninterrupted), or Custom. Optionally link the session to a specific task for automatic time tracking.',
    tips   : [
      'Completed focus sessions are logged in Analytics → Focus Stats.',
      'You can see your daily/weekly focus time on the Dashboard overview.',
      'Focus session history is tied to your user account, not the workspace.',
    ],
  },
];

export const HelpGettingStarted = () => {
  return (
    <section id='getting-started' className='border-t border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/20'>
      <div className='max-w-4xl mx-auto px-6 py-14'>
        <div className='mb-10'>
          <p className='text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2'>
            Getting Started
          </p>
          <h2 className='text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2'>
            Set up Focura in 6 steps
          </h2>
          <p className='text-sm text-neutral-500 dark:text-neutral-400'>
            From account creation to your first focus session — a complete walkthrough.
          </p>
        </div>

        <div className='space-y-6'>
          {steps.map(({ number, title, detail, tips }) => (
            <div
              key={number}
              className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6'
            >
              <div className='flex items-start gap-4'>
                {/* Step number */}
                <div className='shrink-0 w-10 h-10 rounded-xl bg-neutral-900 dark:bg-neutral-50 flex items-center justify-center'>
                  <span className='text-xs font-bold text-white dark:text-neutral-900'>{number}</span>
                </div>
                <div className='flex-1 min-w-0'>
                  <h3 className='text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-2'>
                    {title}
                  </h3>
                  <p className='text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4'>
                    {detail}
                  </p>
                  {/* Tips */}
                  <div className='rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 p-3.5 space-y-2'>
                    {tips.map((tip) => (
                      <div key={tip} className='flex items-start gap-2'>
                        <CheckCircle2 className='w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5' strokeWidth={2} />
                        <p className='text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed'>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-8 flex items-center gap-3'>
          <Link
            href='/contact'
            className='inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors'
          >
            Still stuck? Contact support
            <ArrowRight className='w-4 h-4 shrink-0' strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
};