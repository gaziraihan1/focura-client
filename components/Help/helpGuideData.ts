export interface Article {
  title: string;
  content: string;
}

export interface GuideSection {
  id: string;
  title: string;
  articles: Article[];
}

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'tasks',
    title: 'Tasks & Subtasks',
    articles: [
      {
        title: 'Creating a task',
        content: `Navigate to any project and click "New Task", or press Shift+N from anywhere on the dashboard for the quick-create dialog. Every task has: title (required), description (markdown supported), status (Todo, In Progress, In Review, Blocked, Completed, Cancelled), priority (Urgent, High, Medium, Low), start date, due date, assignees, labels, and estimated hours. Tasks are saved automatically as you type.`,
      },
      {
        title: 'Task statuses explained',
        content: `Todo — not started yet. In Progress — actively being worked on. In Review — work done, awaiting approval or feedback. Blocked — cannot proceed due to a dependency or external factor. Completed — done and verified. Cancelled — will not be completed. You can change status from the task detail view, the List view, or by dragging the card to another column in Kanban view.`,
      },
      {
        title: 'Assigning tasks to team members',
        content: `Open a task and click "Assignees". You can assign multiple team members. Assigned users receive an in-app notification (and optionally an email). Only workspace members can be assigned. You can filter the task list by assignee from the filter toolbar.`,
      },
      {
        title: 'Creating subtasks',
        content: `Open a task and scroll to the Subtasks section. Click "Add subtask" to create a child task. Subtasks support the same metadata as parent tasks (priority, due date, assignees, labels). Subtasks can be nested up to the depth limit. Completing all subtasks does not automatically complete the parent task — you must do that manually.`,
      },
      {
        title: 'Task dependencies',
        content: `Open a task and go to the Dependencies tab. Add blocking dependencies (this task cannot start until another finishes) or related tasks (informational link). The Kanban and List views will show a "Blocked" indicator on tasks with unresolved dependencies. You can break the dependency at any time by removing it.`,
      },
      {
        title: 'Recurring tasks',
        content: `Open a task and toggle on "Recurring". Choose a pattern: Daily, Weekly, Monthly, or Custom. Set an optional end date or leave it open-ended. On each recurrence date, a new task is created automatically with the same title, description, priority, and assignees. The original task is not affected.`,
      },
      {
        title: 'Bulk operations',
        content: `In List view, check the checkbox on the left of multiple tasks to select them. The bulk action toolbar appears at the bottom: Change status, Change priority, Assign to member, Add label, Move to project, Delete. Bulk operations work across all selected tasks simultaneously.`,
      },
      {
        title: 'Filtering and sorting tasks',
        content: `Use the filter toolbar above the task list to filter by: status, priority, assignee, label, due date range, creation date, and energy type. Combine multiple filters — they are AND conditions. Sort by: due date, priority, creation date, title (alphabetical), or last updated. Filters and sorts persist for your session but are not saved per user yet.`,
      },
      {
        title: 'Focus Required flag',
        content: `Each task has a "Focus Required" toggle. When enabled, the task is surfaced as a suggestion when you start a focus session. You can also set the focus level (1–5) and energy type (Low, Medium, High) to help the system suggest tasks appropriate for your current energy state during planning.`,
      },
      {
        title: 'Time entries on tasks',
        content: `Open a task and go to the Time Entries tab. Click "Log time" to manually add a time entry with a start time, end time, and optional description. Time entries can be marked as billable. Total logged time is shown on the task card. All time entries roll up into workspace Analytics under the Time Tracking section.`,
      },
    ],
  },
  {
    id: 'views',
    title: 'Work Views',
    articles: [
      {
        title: 'List View',
        content: `The default view for a project. Shows all tasks in a flat list with full metadata visible — status, priority, assignees, labels, due date. Use the filter and sort toolbar at the top to narrow down what you see. Click any task row to open the detail panel on the right. Supports bulk selection.`,
      },
      {
        title: 'Kanban Board',
        content: `Switch to Kanban view by clicking the Kanban icon in the view switcher. Tasks are organised into columns by status: Todo, In Progress, In Review, Blocked, Completed. Drag cards between columns to change status. You can collapse columns you don't need. The WIP (Work in Progress) limit is configurable per column from the column settings menu.`,
      },
      {
        title: 'Calendar View',
        content: `Calendar view shows tasks as events on a monthly calendar based on their due dates. Tasks with no due date are not visible in calendar view — set a due date first. Click any task on the calendar to open its detail panel. Click an empty day to create a new task pre-set to that due date. Use the arrows to navigate months.`,
      },
      {
        title: 'Daily Tasks View',
        content: `The Daily Tasks view is your personal focused planning space — independent of any project. Navigate to Dashboard → Daily Tasks. Add tasks to today's list from your existing workspace tasks, or create new ones. Mark tasks as Primary (your most important task) or Secondary. At midnight, the daily list resets and a fresh day begins.`,
      },
      {
        title: 'Switching between views',
        content: `The view switcher is in the top-right of every project page. Your last-used view per project is remembered for your next visit. Each view shows the same underlying task data — switching views does not change task metadata.`,
      },
    ],
  },
  {
    id: 'focus',
    title: 'Focus Sessions',
    articles: [
      {
        title: 'Starting a focus session',
        content: `Click "Focus" in the left sidebar or navigate to Dashboard → Focus. Choose your session type: Pomodoro (25 min work, 5 min short break, 15 min long break after 4 rounds), Deep Work (90 min uninterrupted), or Custom (you set the duration). Optionally link the session to a task for automatic time tracking. Click Start to begin.`,
      },
      {
        title: 'Pomodoro mode',
        content: `Pomodoro follows the classic technique: 4 work intervals of 25 minutes, separated by 5-minute short breaks. After 4 intervals, a 15-minute long break begins automatically. The timer counts down on screen. You can pause or abandon a session at any time. Completed Pomodoros are counted in your focus stats.`,
      },
      {
        title: 'Deep Work mode',
        content: `Deep Work mode sets a single 90-minute uninterrupted focus block with no scheduled breaks. It is designed for complex, cognitively demanding work that benefits from sustained attention. Notifications are not automatically silenced — use your device's Do Not Disturb setting alongside Focura's focus timer.`,
      },
      {
        title: 'Custom focus sessions',
        content: `In Custom mode, you set the work duration (1–180 minutes) and optional break duration. This is useful for shorter sprint planning sessions, review blocks, or any time you want a defined working window that doesn't match Pomodoro or Deep Work.`,
      },
      {
        title: 'Linking sessions to tasks',
        content: `Before starting a session, use the task picker to optionally link it to a specific task. When the session completes, the duration is automatically logged as a time entry on that task. This gives you accurate time tracking without manual data entry.`,
      },
      {
        title: 'Focus session analytics',
        content: `All completed sessions are logged and visible in Analytics → Focus Stats. You can see: total focus minutes per day, sessions by type, streak (consecutive days with at least one session), and tasks most frequently focused on. Sessions that are abandoned before completion are marked as incomplete and counted separately.`,
      },
    ],
  },
  {
    id: 'projects',
    title: 'Projects',
    articles: [
      {
        title: 'Creating a project',
        content: `From your workspace dashboard, click "New Project". Set the name, description (optional), colour/icon for visual identification, start date, and due date. Projects are created with Active status by default. The project creator is automatically added as Manager.`,
      },
      {
        title: 'Project statuses',
        content: `Planning — project defined but work has not started. Active — work is in progress. On Hold — paused temporarily, tasks are still accessible. Completed — all work done, marked for record. Archived — hidden from the main dashboard but accessible via the archived filter. Status is set manually by project Managers and workspace Admins.`,
      },
      {
        title: 'Project roles',
        content: `Manager — can edit project settings, manage members, create and delete tasks. Collaborator — can create and edit tasks, add comments, upload files. Viewer — read-only access to the project. Project roles are independent of workspace roles. An Admin on the workspace can override project permissions.`,
      },
      {
        title: 'Milestones',
        content: `Milestones mark key dates or achievements within a project. Open a project and navigate to the Milestones tab. Click "Add milestone" with a title, optional description, and target date. Mark a milestone as completed when reached. Milestones appear on the Calendar view as distinct events.`,
      },
      {
        title: 'Project analytics',
        content: `Each project has its own analytics panel: task completion rate, tasks by status breakdown, overdue task count, average task completion time, and top contributors by tasks completed. Navigate to a project and click Analytics in the project navigation.`,
      },
      {
        title: 'Archiving and deleting projects',
        content: `Archiving hides a project from the active dashboard but preserves all data — tasks, comments, files, and history. You can unarchive at any time. Deleting a project is permanent and removes all associated tasks, files, and comments. Only workspace Owners and Admins can delete projects.`,
      },
    ],
  },
  {
    id: 'collaboration',
    title: 'Collaboration & Communication',
    articles: [
      {
        title: 'Commenting on tasks',
        content: `Open any task and scroll to the Comments section. Type your comment and press Enter or click Post. Comments support markdown formatting. You can edit or delete your own comments at any time. Each comment timestamps and attributes the author. Comments trigger a notification to all task assignees and the task creator.`,
      },
      {
        title: 'Using @mentions',
        content: `In any comment, type @ followed by a team member's name to mention them. A dropdown appears with matching workspace members. Select the person to insert the @mention. The mentioned user receives an in-app notification immediately via SSE, plus an optional email notification based on their preferences.`,
      },
      {
        title: 'Workspace announcements',
        content: `Announcements are workspace-wide messages from Owners and Admins. Navigate to Workspace → Announcements → New Announcement. Set visibility to Public (all members) or Private (specific members). Optionally pin an announcement to keep it at the top. Pinned announcements are highlighted in the activity feed.`,
      },
      {
        title: 'Activity feed',
        content: `The workspace activity feed shows a chronological log of all actions across the workspace: task created/updated/completed, comments added, members joined/removed, files uploaded, and project changes. You can filter the feed by entity type. Activity is preserved indefinitely and forms the audit trail.`,
      },
      {
        title: 'Real-time updates (SSE)',
        content: `Focura uses Server-Sent Events to push updates instantly without page refreshes. When a teammate assigns you a task, comments on a task, or @mentions you, you receive the notification in real-time. The notification bell in the top bar shows the unread count. You do not need to refresh the page.`,
      },
    ],
  },
  {
    id: 'workspace-settings',
    title: 'Workspace Settings',
    articles: [
      {
        title: 'Renaming and customising your workspace',
        content: `Go to Settings → Workspace → General. You can change the workspace name, slug (used in URLs — changing this may break shared links), description, logo (uploaded to Cloudinary), and accent colour. Only the workspace Owner and Admins can edit these settings.`,
      },
      {
        title: 'Inviting members',
        content: `Settings → Members → Invite. Enter one or more email addresses (comma-separated). Choose a role for each invitation. The invited person receives an email with a unique invitation link that expires in 7 days. If they don't have a Focura account, they are prompted to create one first. You can resend or cancel pending invitations.`,
      },
      {
        title: 'Changing member roles',
        content: `From Settings → Members, find the member and click the role dropdown next to their name. Only the Owner and Admins can change roles. An Owner cannot be downgraded by an Admin. There can only be one Owner per workspace — ownership transfer is done by the current Owner from Settings → Workspace → Danger Zone.`,
      },
      {
        title: 'Removing a member',
        content: `From Settings → Members, click the three-dot menu next to a member and select "Remove from workspace". This immediately revokes access. Any tasks assigned to the removed member retain the assignment in the record but the person can no longer access the workspace. Tasks are not unassigned automatically.`,
      },
      {
        title: 'Workspace plan limits',
        content: `Free plan: 5 members, 3 projects, 500 MB storage, 10 meetings/month. Pro and Business plans increase these limits. You can see your current usage in Settings → Usage. If you hit a limit, the relevant action (e.g. creating a new project) is blocked with a prompt to upgrade.`,
      },
      {
        title: 'Deleting a workspace',
        content: `Only the workspace Owner can delete a workspace. Go to Settings → Workspace → Danger Zone → Delete Workspace. You must type the workspace name to confirm. Deletion is permanent — all projects, tasks, files, members, and subscription data are removed. This cannot be undone.`,
      },
    ],
  },
  {
    id: 'billing',
    title: 'Billing & Plans',
    articles: [
      {
        title: 'Available plans',
        content: `Free: Up to 5 members, 3 projects, 500 MB storage, basic analytics. Pro: Higher limits, analytics access, priority support, more storage. Business: Maximum limits, custom branding, advanced reports, API access, and more. Enterprise: Contact us for custom limits and SLAs. Plan details and exact pricing are shown on the Pricing page.`,
      },
      {
        title: 'Upgrading your plan',
        content: `Go to Settings → Billing → Upgrade. Choose a plan and billing cycle (Monthly or Annual — annual plans offer a discount). Enter payment details via Stripe. The upgrade takes effect immediately and you are billed pro-rated for the remainder of the current billing period.`,
      },
      {
        title: 'Billing history and invoices',
        content: `Settings → Billing → Invoices shows all past invoices with amount, status (Paid, Open, Void), and a download link for the PDF. Invoices are also emailed to the workspace owner's email address after each successful payment.`,
      },
      {
        title: 'Cancelling a subscription',
        content: `Settings → Billing → Cancel Subscription. Cancellation takes effect at the end of the current billing period. You retain full access until then. After cancellation, the workspace is downgraded to the Free plan and limits apply immediately at the period end. Data is not deleted on downgrade.`,
      },
      {
        title: 'Requesting a refund',
        content: `Refunds are available within 7 days of the first subscription charge, for accounts with minimal usage only. Email focurabusiness@gmail.com with your name, registered email, Paddle Order ID, date of charge, plan purchased, and reason. See the full Refund Policy at /refund.`,
      },
      {
        title: 'Updating payment method',
        content: `Settings → Billing → Payment Method. Click "Update" to enter new card details via Stripe's secure form. Your new card is charged on the next billing date. The old card is immediately replaced and no data is stored on Focura's servers — all payment data is held by Stripe.`,
      },
    ],
  },
  {
    id: 'account-security',
    title: 'Account & Security',
    articles: [
      {
        title: 'Updating your profile',
        content: `Settings → Account → Profile. You can update your display name, avatar (uploaded to Cloudinary), bio, and timezone. The timezone setting affects how dates and times are displayed throughout the application. Changes are saved immediately.`,
      },
      {
        title: 'Changing your password',
        content: `Settings → Account → Security → Change Password. Enter your current password, then your new password twice. Passwords must meet the minimum complexity requirement. After changing your password, all existing sessions except the current one are invalidated — other devices will need to log in again.`,
      },
      {
        title: 'Forgot password / Reset password',
        content: `On the login page, click "Forgot password?" and enter your registered email address. You will receive a password reset link valid for 1 hour. Click the link, enter your new password, and you are automatically logged in. If you don't receive the email, check your spam folder.`,
      },
      {
        title: 'Google OAuth login',
        content: `You can sign in with your Google account. If your Google email matches an existing Focura account, they are linked. If not, a new Focura account is created. Google OAuth accounts do not have a Focura password by default — you can set one from Settings → Account → Security if needed.`,
      },
      {
        title: 'Active sessions and logout',
        content: `Settings → Account → Security → Active Sessions shows all devices currently logged in. You can log out a specific device, or click "Log out all other devices" to invalidate all sessions except the current one. All session tokens are RS256 JWTs with a short expiry and are revocable via Redis.`,
      },
      {
        title: 'Deleting your account',
        content: `Settings → Account → Danger Zone → Delete Account. Account deletion is permanent. Before deleting: ensure you have transferred ownership of any workspaces you own (you cannot delete your account while you are the sole owner of an active workspace). All personal data is removed within 30 days per our Privacy Policy.`,
      },
      {
        title: 'Data export',
        content: `You can request an export of your personal data from Settings → Account → Privacy → Export Data. The export includes your profile, tasks created, focus session history, comments, and time entries. Exports are generated as a downloadable JSON file emailed to your registered address within 24 hours.`,
      },
    ],
  },
  {
    id: 'files',
    title: 'Files & Storage',
    articles: [
      {
        title: 'Uploading files to tasks',
        content: `Open a task and go to the Attachments tab. Click "Upload file" or drag and drop files directly onto the task panel. Files are uploaded to Cloudinary and associated with the task. The maximum file size per upload depends on your plan (10 MB on Free, higher on paid plans).`,
      },
      {
        title: 'File browser',
        content: `Navigate to Workspace → Storage → Files to open the file browser. This shows all files uploaded to the workspace, organised by folder. You can create folders, move files, rename them, and download or delete them. Files are searchable by name.`,
      },
      {
        title: 'Storage usage and limits',
        content: `Your storage usage is shown in Settings → Usage and in the File Browser header. The Free plan includes 500 MB. Upgrading your plan increases the limit. If you reach the storage limit, new file uploads are blocked until you delete existing files or upgrade. Deleting files immediately frees space.`,
      },
      {
        title: 'Supported file types',
        content: `Focura accepts any file type — documents, images, videos, archives, code files, etc. Images are automatically optimised and thumbnailed by Cloudinary for faster loading in the file browser. Very large video files may take several seconds to process after upload before the preview is available.`,
      },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    articles: [
      {
        title: 'Notification types',
        content: `Focura sends notifications for: Task Assigned, Task Completed, Task Commented, @Mention, Task Due Soon, Task Overdue, Member Joined, Member Removed, Role Updated, Workspace Invite, Project Update, File Shared, Meeting Created/Updated/Cancelled, Meeting Reminder, and Deadline Reminder. Each type can be individually toggled in your notification preferences.`,
      },
      {
        title: 'Real-time vs email notifications',
        content: `All notifications are delivered in real-time inside Focura via SSE (no page refresh needed). For email delivery, go to Settings → Notifications and toggle the email option for each notification type. By default, email notifications are disabled to avoid inbox noise.`,
      },
      {
        title: 'Marking notifications as read',
        content: `Click the bell icon in the top navigation bar to open the notification panel. Click any notification to mark it as read and navigate to the related item. Click "Mark all as read" to clear all unread notifications at once. The red badge on the bell shows the total unread count.`,
      },
      {
        title: 'Notification preferences',
        content: `Settings → Notifications. Toggle each notification type on or off for in-app and email channels independently. For example, you might want in-app @mentions but not email alerts for every task assignment.`,
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    articles: [
      {
        title: 'I cannot log in',
        content: `First, try resetting your password. If you use Google OAuth, ensure your Google account is active. If you have MFA on your Google account, complete it. If you see "Invalid credentials", double-check for typos — email addresses are case-insensitive but passwords are case-sensitive. Clear your browser cache and cookies and try again. If the issue persists, contact focurabusiness@gmail.com.`,
      },
      {
        title: 'Real-time notifications are not working',
        content: `Real-time updates use SSE which requires a persistent HTTP connection. This can be blocked by corporate firewalls, VPNs, or browser extensions. Try: disabling VPN temporarily, disabling ad-blockers, or testing in a different browser. If the SSE connection drops, Focura reconnects automatically — you may see a brief "reconnecting" indicator in the notification bell.`,
      },
      {
        title: 'File upload fails',
        content: `Check that your file is under the plan file size limit (10 MB on Free). Check your remaining storage — if you are at the limit, uploads are blocked. Try a different browser or disable extensions. If the upload starts but stalls, it may be a network issue — try again on a stable connection.`,
      },
      {
        title: 'Tasks are not appearing in Kanban view',
        content: `Kanban view shows tasks filtered to the current project. If you created a task from the workspace dashboard without assigning it to a project, it will not appear in project Kanban views. Check the task's project assignment in the task detail panel.`,
      },
      {
        title: 'I invited a member but they did not receive the email',
        content: `Ask them to check their spam folder — invitation emails can be filtered. Invitation emails are sent from focurabusiness@gmail.com. If still not received, go to Settings → Members → Pending Invitations and click Resend. If the invitation expired (7 days), cancel it and create a new one.`,
      },
      {
        title: 'My focus session timer stopped',
        content: `Browser tabs that are backgrounded may have their timers throttled by the browser to save resources. For best results, keep the Focura tab in the foreground during a focus session. The session state is preserved even if the page is briefly hidden — open the tab again and the timer should resume correctly.`,
      },
      {
        title: 'Reporting a bug',
        content: `To report a bug: go to /contact and select "Technical Issue" as the category. Include: your browser name and version, operating system, the exact steps to reproduce the issue, what you expected to happen, what actually happened, and any screenshots or console errors (press F12 → Console to view them). The more detail you provide, the faster we can reproduce and fix the issue.`,
      },
      {
        title: 'Reporting a security vulnerability',
        content: `Do NOT open a public GitHub issue for security vulnerabilities. Email security@focura.app with a detailed description of the vulnerability, steps to reproduce, and potential impact. We follow a responsible disclosure policy and will acknowledge your report within 48 hours.`,
      },
    ],
  },
];
