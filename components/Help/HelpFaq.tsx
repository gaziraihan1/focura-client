'use client';

import { useState }   from 'react';
import { ChevronDown } from 'lucide-react';
import { cn }          from '@/lib/utils';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQGroup {
  group: string;
  items: FAQItem[];
}

const FAQ_GROUPS: FAQGroup[] = [
  {
    group: 'Account & Access',
    items: [
      {
        q: 'Can I use Focura without creating an account?',
        a: 'No — all Focura features require an account. You can sign up free at focura-client.vercel.app with your email or Google account. No credit card is required for the free plan.',
      },
      {
        q: 'Can I have multiple accounts?',
        a: 'One account per email address. However, you can be a member of many workspaces with a single account. If you need to separate work contexts, use different workspaces rather than different accounts.',
      },
      {
        q: 'What happens when my session expires?',
        a: 'Focura automatically refreshes your session silently 1 minute before the access token expires. You should not notice any interruption. If the refresh fails (e.g. network issue or revoked token), you will be redirected to the login page.',
      },
      {
        q: 'Can I change my email address?',
        a: 'Yes — Settings → Account → Profile → Email. You will be asked to verify the new email address before the change takes effect. Your old email address will receive a notification that the email was changed.',
      },
    ],
  },
  {
    group: 'Workspaces & Teams',
    items: [
      {
        q: 'How many workspaces can I create?',
        a: 'Free plan: up to 3 workspaces owned by you. You can be a member of unlimited workspaces owned by others. Paid plans increase the ownership limit.',
      },
      {
        q: 'Can I move tasks between workspaces?',
        a: 'Not directly — tasks belong to a workspace and cannot be transferred. You can duplicate a task\'s details manually. Cross-workspace task migration is a planned feature.',
      },
      {
        q: 'What is the difference between workspace roles?',
        a: 'Owner: full control — billing, delete workspace, all settings. Admin: manage members, create/delete projects, all task operations. Member: create and manage tasks, view projects they are added to, upload files, use focus sessions. Guests have limited read access.',
      },
      {
        q: 'Can a workspace have multiple owners?',
        a: 'No — one workspace can have exactly one Owner. The Owner can transfer ownership to another member from Settings → Workspace → Transfer Ownership. After transfer, the previous Owner becomes an Admin.',
      },
      {
        q: 'What happens to tasks when a member is removed?',
        a: 'Tasks assigned to the removed member remain in the workspace and retain the assignment in the audit log, but the person can no longer access or act on them. You should manually reassign their tasks before or after removal.',
      },
    ],
  },
  {
    group: 'Tasks & Projects',
    items: [
      {
        q: 'Is there a limit on how many tasks I can create?',
        a: 'There is no hard limit on tasks on any plan. Task limits are not a factor — only member count, project count, and storage are plan-limited.',
      },
      {
        q: 'Can I see all tasks across all my workspaces in one place?',
        a: 'Not yet — the workspace switcher shows one workspace at a time. A unified cross-workspace task view is a planned feature. For now, use the workspace switcher in the top-left sidebar.',
      },
      {
        q: 'What does "Blocked" status mean?',
        a: 'Blocked means the task cannot proceed until another task or an external factor is resolved. You set this manually. When you add a dependency to a task, the blocked state is indicated automatically in Kanban and List views.',
      },
      {
        q: 'Can I export my tasks?',
        a: 'Full data export (JSON) is available from Settings → Account → Privacy → Export Data. A CSV export of tasks specifically is a planned feature. Exports are emailed to your registered address.',
      },
      {
        q: 'How do recurring tasks work if the previous one is not completed?',
        a: 'A new task is created on the recurrence date regardless of whether the previous instance was completed. Both tasks coexist independently. Recurring tasks do not block each other.',
      },
    ],
  },
  {
    group: 'Focus Sessions',
    items: [
      {
        q: 'Does the focus timer run if I close the tab?',
        a: 'The timer is browser-based and pauses when you close the tab or navigate away. For the best experience, keep the Focura tab active during your session. We recommend using it alongside your device\'s Do Not Disturb mode.',
      },
      {
        q: 'Is my focus time data private?',
        a: 'Focus session data is tied to your individual user account. Workspace Admins and Owners can see aggregated team focus metrics in analytics but cannot see your individual session content or linked task details.',
      },
      {
        q: 'Can I run focus sessions without linking a task?',
        a: 'Yes — linking a task is optional. Unlinked sessions are still counted in your focus statistics. No time entry is created for unlinked sessions.',
      },
    ],
  },
  {
    group: 'Billing & Payments',
    items: [
      {
        q: 'Which payment methods are accepted?',
        a: 'All major credit and debit cards (Visa, Mastercard, Amex) via Stripe. Stripe also supports Link (one-click checkout) and some regional payment methods. Invoicing and bank transfer are available on Enterprise plans only.',
      },
      {
        q: 'Will I lose data if I downgrade to the free plan?',
        a: 'No data is deleted on downgrade. However, if your workspace exceeds free plan limits after downgrade (e.g. more than 5 members or 3 projects), new actions on those items are blocked. Existing data remains readable.',
      },
      {
        q: 'Is my payment information stored by Focura?',
        a: 'No. All payment data is handled by Stripe, our Merchant of Record. Focura only stores a Stripe customer ID and the last 4 digits of your card for display purposes. No full card numbers are ever stored on Focura\'s servers.',
      },
      {
        q: 'Can I get a VAT invoice?',
        a: 'Paddle (our payment processor on some plans) handles tax compliance including VAT collection and remittance. VAT invoices are included in your billing receipts automatically if you are in a VAT-applicable jurisdiction.',
      },
    ],
  },
  {
    group: 'Privacy & Security',
    items: [
      {
        q: 'Is my data encrypted?',
        a: 'Yes. All data is encrypted in transit using TLS 1.2+ and at rest using AES-256. Passwords are hashed with Argon2id. Authentication uses RS256-signed JWTs stored in HTTP-only cookies — they are not accessible via JavaScript.',
      },
      {
        q: 'Who can see my tasks?',
        a: 'Tasks belong to workspaces. All members of a workspace can see all tasks within it by default. Project-level visibility is controlled by project membership — tasks in a project are only visible to project members and workspace Admins/Owners.',
      },
      {
        q: 'How do I request deletion of my data?',
        a: 'You can delete your account from Settings → Account → Danger Zone. Personal data is purged within 30 days per our Privacy Policy. For a specific data deletion request without deleting your account, email privacy@focura.app.',
      },
      {
        q: 'Does Focura sell my data?',
        a: 'Never. Focura does not sell, rent, or trade your personal data. Analytics cookies are opt-in only. See our Privacy Policy at /privacy for the full breakdown of what we collect and why.',
      },
    ],
  },
];

export const HelpFAQ = () => {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <section className='border-t border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/20'>
      <div className='max-w-4xl mx-auto px-6 py-14'>
        <div className='mb-10'>
          <p className='text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2'>
            FAQ
          </p>
          <h2 className='text-2xl font-bold text-neutral-900 dark:text-neutral-50'>
            Frequently asked questions
          </h2>
        </div>

        <div className='space-y-4'>
          {FAQ_GROUPS.map((group) => (
            <div key={group.group}>
              <p className='text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3 px-1'>
                {group.group}
              </p>
              <div className='rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-5 divide-y divide-neutral-100 dark:divide-neutral-800'>
                {group.items.map((item, i) => {
                  const key = `${group.group}::${i}`;
                  const isOpen = openKey === key;
                  return (
                    <div key={key}>
                      <button
                        onClick={() => setOpenKey(isOpen ? null : key)}
                        aria-expanded={isOpen}
                        className='w-full flex items-start justify-between gap-4 py-4 text-left group'
                      >
                        <span className='text-sm font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors leading-snug'>
                          {item.q}
                        </span>
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 shrink-0 text-neutral-400 transition-transform duration-200 mt-0.5',
                            isOpen && 'rotate-180'
                          )}
                        />
                      </button>
                      <div className={cn('overflow-hidden transition-all duration-200', isOpen ? 'max-h-96 pb-4' : 'max-h-0')}>
                        <p className='text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed'>{item.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};