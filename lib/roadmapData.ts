export type RoadmapStatus = "completed" | "in-progress" | "planned" | "future";
export type RoadmapCategory = "core" | "productivity" | "collaboration" | "analytics" | "integration" | "platform";

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  detail: string;
  status: RoadmapStatus;
  category: RoadmapCategory;
  quarter: string;
  icon: string;
  highlights: string[];
  badge?: string;
}

export const CATEGORY_LABELS: Record<RoadmapCategory, string> = {
  core: "Core",
  productivity: "Productivity",
  collaboration: "Collaboration",
  analytics: "Analytics",
  integration: "Integration",
  platform: "Platform",
};

export const CATEGORY_COLORS: Record<RoadmapCategory, string> = {
  core: "#6366f1",
  productivity: "#f59e0b",
  collaboration: "#10b981",
  analytics: "#3b82f6",
  integration: "#8b5cf6",
  platform: "#ec4899",
};

export const ROADMAP_ITEMS: RoadmapItem[] = [
  // ── Completed ───────────────────────────────────────────────────────────────
  {
    id: "workspace-foundation",
    title: "Workspace Foundation",
    description: "Core workspace system with member roles, invitation flow, and permission isolation.",
    detail: "Built the foundational workspace layer that underpins all of Focura. Includes Owner/Admin/Member roles, workspace slugs for clean URLs, invitation via email, member management, and full workspace-level data isolation to prevent cross-tenant access.",
    status: "completed",
    category: "core",
    quarter: "Q4 2025",
    icon: "⬡",
    highlights: ["Owner / Admin / Member roles", "Email-based invitations", "Workspace slug URLs", "Cross-tenant data isolation"],
  },
  {
    id: "task-system",
    title: "Task Management System",
    description: "Full task lifecycle with status, priority, assignees, subtasks, due dates, and labels.",
    detail: "The core task engine. Tasks support five status states, three priority levels, multi-assignee, due dates, rich descriptions, subtasks, and color-coded labels. Three view modes — Project, Personal, and Workspace — let each team member see exactly what they need.",
    status: "completed",
    category: "core",
    quarter: "Q4 2025",
    icon: "◉",
    highlights: ["5 status types + priority levels", "Subtask nesting", "Per-project labels with color", "Project / Personal / Workspace view modes"],
  },
  {
    id: "auth-system",
    title: "RS256 Authentication",
    description: "NextAuth + RS256 JWT token exchange with refresh, revocation, and Google OAuth.",
    detail: "Enterprise-grade authentication. NextAuth manages sessions client-side while the Express backend is the sole authority for RS256 JWT signing. Tokens have 15-minute access expiry with 7-day refresh. Logout immediately revokes tokens via Redis JTI blacklisting. Google OAuth included.",
    status: "completed",
    category: "platform",
    quarter: "Q4 2025",
    icon: "◐",
    highlights: ["RS256 JWT (private key server-only)", "Token revocation via Redis JTI", "Google OAuth", "Replay protection with HMAC timestamps"],
  },
  {
    id: "activity-feed",
    title: "Activity Feed & Audit Trail",
    description: "Permanent, timestamped log of every task and workspace mutation.",
    detail: "Every meaningful action in Focura — status changes, reassignments, comments, attachments, label updates — is logged to an immutable activity feed. Entries are attributed to users with exact timestamps. Workspace owners can view activity across all members.",
    status: "completed",
    category: "core",
    quarter: "Q1 2026",
    icon: "⚡",
    highlights: ["Task-level activity timeline", "Workspace-wide activity stream", "Permanent and uneditable entries", "Full user attribution"],
  },
  {
    id: "comments-mentions",
    title: "Comments & @Mentions",
    description: "Threaded task comments with @mention notifications and reply support.",
    detail: "Team communication lives inside tasks. Members can leave comments, reply to specific messages, and @mention teammates to trigger direct notifications. The mention system parses user references and delivers SSE notifications in real time.",
    status: "completed",
    category: "collaboration",
    quarter: "Q1 2026",
    icon: "◎",
    highlights: ["Threaded replies", "@mention with real-time notification", "Comment activity logging", "Soft-delete with history preserved"],
  },
  {
    id: "announcements",
    title: "Rich-Text Announcements",
    description: "Workspace announcements with custom format tokens, visibility controls, and pinning.",
    detail: "Admins can broadcast workspace-wide announcements using a rich-text editor with custom format tokens. Announcements support visibility scoping (all members or specific projects), pinning to keep critical updates visible, and live preview before publishing.",
    status: "completed",
    category: "collaboration",
    quarter: "Q1 2026",
    icon: "◇",
    highlights: ["Rich-text editor with format tokens", "Visibility scoping", "Pin to top", "Live preview"],
  },
  {
    id: "focus-mode",
    title: "Focus Mode",
    description: "Timed deep-work sessions linked to a single task with persistent banner and stats.",
    detail: "Focus Mode helps team members do distraction-free work. Starting a session pins the active task to a persistent banner visible across all pages. Sessions are timed, stats are tracked per user (total time, sessions, daily average), and a 30-second polling loop keeps stats fresh.",
    status: "completed",
    category: "productivity",
    quarter: "Q1 2026",
    icon: "◑",
    highlights: ["Persistent cross-page banner", "Session timer and stats", "Daily + total focus time tracking", "30s polling for live stats"],
  },
  {
    id: "sse-notifications",
    title: "Real-time SSE Notifications",
    description: "Server-Sent Events notification stream with task, mention, and meeting alerts.",
    detail: "Real-time notifications without WebSocket complexity. The backend maintains a persistent SSE connection per user. Notifications fire for task assignments, @mentions, meeting invites, and announcement publishes. The frontend EventSource auto-reconnects on drop.",
    status: "completed",
    category: "platform",
    quarter: "Q1 2026",
    icon: "▲",
    highlights: ["Per-user SSE stream", "Task, mention & meeting events", "30s keep-alive ping", "Auto-reconnect on client"],
  },
  {
    id: "meetings",
    title: "Meetings Module",
    description: "Schedule team meetings, invite participants, and link them to projects.",
    detail: "The meetings module lets teams schedule discussions directly in Focura. Meetings attach to workspaces or projects for context. Participants receive SSE notifications with deep-link URLs built from workspace slugs. Past and upcoming meetings are listed chronologically.",
    status: "completed",
    category: "collaboration",
    quarter: "Q1 2026",
    icon: "◈",
    highlights: ["Project-linked meetings", "Participant invitations via SSE", "Slug-based notification deep links", "Chronological meeting list"],
  },
  {
    id: "feature-voting",
    title: "Feature Voting Board",
    description: "Community idea board with upvote counts, admin status management, and real-time counts.",
    detail: "Team members can propose feature ideas and vote on them. Vote counts update optimistically for instant feedback. Admins can mark items as Planned or Completed. The board surfaces the most-requested ideas to help leadership prioritize upcoming work.",
    status: "completed",
    category: "collaboration",
    quarter: "Q2 2026",
    icon: "✦",
    highlights: ["Optimistic vote count updates", "Admin status management (Planned/Completed)", "Idea submission by any member", "Priority surfacing for leadership"],
  },
  {
    id: "billing-paddle-integration",
    title: "Paddle Billing & Subscriptions",
    description: "Paddle-powered subscription management with plan changes, invoices, and webhooks.",
    detail: "Full subscription lifecycle via Paddle. Workspace owners can upgrade or downgrade plans with immediate effect and prorated billing. Webhooks handle subscription events (created, updated, canceled). Invoices are auto-generated and downloadable as PDF.",
    status: "completed",
    category: "platform",
    quarter: "Q2 2026",
    icon: "◆",
    highlights: ["Plan upgrade / downgrade", "Prorated billing", "Stripe webhook handlers", "PDF invoice downloads"],
  },
  {
    id: "redis-caching",
    title: "Redis Caching Layer",
    description: "Upstash Redis caching with workspace-aware invalidation and token revocation.",
    detail: "Response caching powered by Upstash Redis reduces database load on hot query paths. The invalidation strategy is workspace-aware — mutations clear only the caches of affected users. The same Redis instance handles JWT JTI revocation for instant logout.",
    status: "completed",
    category: "platform",
    quarter: "Q1 2026",
    icon: "⬟",
    highlights: ["Per-user cache invalidation", "JWT JTI revocation", "TLS-secured Upstash connection", "Optimistic update race condition handling"],
  },
  {
    id: "testing-suite",
    title: "Frontend Testing Suite",
    description: "Vitest + RTL + MSW setup with 100+ tests across all 12 hook files.",
    detail: "A comprehensive test suite covers all major data hooks. Tests use MSW for API mocking, a createWrapper pattern for React Query cache seeding, and strict patterns: mutate() inside act(), waitFor() outside. jsdom is pinned to v24 for ESM compatibility.",
    status: "completed",
    category: "platform",
    quarter: "Q1 2026",
    icon: "⊕",
    highlights: ["12 hook files covered", "100+ tests", "MSW for API mocking", "jsdom@24 + TransformStream polyfill"],
  },

  // ── In Progress ──────────────────────────────────────────────────────────────
  {
    id: "calendar-view",
    title: "Calendar & Scheduling View",
    description: "Visual calendar with task due dates, meeting slots, and scheduling insights.",
    detail: "A full calendar view that plots task due dates and meetings on a monthly/weekly grid. Drag-and-drop rescheduling, conflict detection, and scheduling insights (busy periods, workload heatmaps) help teams plan without spreadsheets.",
    status: "in-progress",
    category: "productivity",
    quarter: "Q1 2026",
    icon: "◇",
    badge: "In Progress",
    highlights: ["Monthly and weekly grid views", "Drag-and-drop rescheduling", "Workload heatmaps", "Meeting + task conflict detection"],
  },

  // ── Planned ──────────────────────────────────────────────────────────────────
  {
    id: "ai-task-suggestions",
    title: "AI Task Suggestions",
    description: "AI-powered task breakdown, priority suggestions, and deadline recommendations.",
    detail: "An AI assistant that helps teams work smarter. Paste a goal and get an instant task breakdown. The AI analyses your team's historical velocity to suggest realistic deadlines. Priority recommendations surface based on due dates, dependencies, and team workload.",
    status: "planned",
    category: "productivity",
    quarter: "Q2 2026",
    icon: "✦",
    badge: "Planned",
    highlights: ["Natural language → task breakdown", "Velocity-based deadline suggestions", "Priority recommendations", "Workload-aware scheduling"],
  },
  {
    id: "kanban-board",
    title: "Kanban Board View",
    description: "Drag-and-drop Kanban board with swimlanes, WIP limits, and column automation.",
    detail: "A visual Kanban board as an alternative to the task list. Cards support full task detail inline. Swimlanes by assignee or label, WIP limits per column, and automation rules (e.g. auto-assign when moved to In Review) reduce manual overhead.",
    status: "planned",
    category: "core",
    quarter: "Q2 2026",
    icon: "⬡",
    badge: "Planned",
    highlights: ["Drag-and-drop with WIP limits", "Swimlanes by assignee or label", "Column automation rules", "Inline task editing on card"],
  },
  {
    id: "time-tracking",
    title: "Time Tracking",
    description: "Native time logging on tasks with reports, timesheets, and billable hour tracking.",
    detail: "Built on the Focus Mode foundation, Time Tracking adds manual time entry, automatic session logging, and per-task time summaries. Workspace-level reports show billable hours by project, member, and date range — useful for client billing or internal capacity planning.",
    status: "planned",
    category: "productivity",
    quarter: "Q2 2026",
    icon: "◐",
    badge: "Planned",
    highlights: ["Manual + automatic time entry", "Per-task time summaries", "Billable hour tagging", "Workspace time reports by member/project"],
  },
  {
    id: "advanced-analytics",
    title: "Advanced Analytics Dashboard",
    description: "Velocity charts, burndown graphs, cycle time, and predictive completion estimates.",
    detail: "A dedicated analytics dashboard for team leads. Velocity charts track task completion rate over time. Burndown graphs show sprint progress. Cycle time analysis identifies bottlenecks. Predictive completion dates are calculated from historical throughput.",
    status: "planned",
    category: "analytics",
    quarter: "Q3 2026",
    icon: "◉",
    badge: "Planned",
    highlights: ["Velocity & burndown charts", "Cycle time per status", "Bottleneck identification", "Predictive completion estimates"],
  },
  {
    id: "github-integration",
    title: "GitHub Integration",
    description: "Link pull requests and commits to Focura tasks. Auto-update status on merge.",
    detail: "Connect Focura tasks to GitHub PRs and commits. Reference a task ID in a PR description and Focura auto-links them. When a PR merges, the linked task automatically moves to Completed. Activity feeds show commit messages directly on the task.",
    status: "planned",
    category: "integration",
    quarter: "Q3 2026",
    icon: "◈",
    badge: "Planned",
    highlights: ["PR ↔ task linking via task ID", "Auto-status update on merge", "Commit messages in task activity", "Branch name suggestions from task title"],
  },

  // ── Future ───────────────────────────────────────────────────────────────────
  {
    id: "mobile-app",
    title: "Native Mobile App",
    description: "iOS and Android apps with offline support, push notifications, and Focus Mode.",
    detail: "A native mobile experience for Focura. Full task management, notifications, and Focus Mode on iOS and Android. Offline mode lets you view and create tasks without connectivity — changes sync automatically when back online. Push notifications replace SSE on mobile.",
    status: "future",
    category: "platform",
    quarter: "Q4 2026",
    icon: "▲",
    badge: "Future",
    highlights: ["iOS & Android", "Offline mode with sync", "Push notifications", "Focus Mode with system timer"],
  },
  {
    id: "slack-integration",
    title: "Slack & Teams Integration",
    description: "Create tasks from Slack messages, get digests in channels, and slash commands.",
    detail: "Bring Focura into your existing communication workflow. Turn any Slack message into a task with one click. Receive daily digest summaries in a dedicated channel. Use slash commands to create tasks, check status, and start Focus sessions without leaving Slack. Microsoft Teams support included.",
    status: "future",
    category: "integration",
    quarter: "Q4 2026",
    icon: "◎",
    badge: "Future",
    highlights: ["Message → task in one click", "Daily digest to channel", "Slash commands", "Microsoft Teams support"],
  },
  {
    id: "workload-balancing",
    title: "AI Workload Balancing",
    description: "Detect overloaded team members and suggest task redistribution automatically.",
    detail: "An AI layer that monitors team workload in real time. When a member is flagged as overloaded (based on open tasks, due dates, and historical velocity), Focura suggests which tasks to redistribute and to whom — balancing workload without manager intervention.",
    status: "future",
    category: "analytics",
    quarter: "Q1 2027",
    icon: "⬟",
    badge: "Future",
    highlights: ["Real-time overload detection", "Redistribution suggestions", "Velocity-aware balancing", "Manager notification digest"],
  },
];
export const STATUS_CONFIG: Record<RoadmapStatus, {
  label: string;
  textColor: string;
  bg: string;
  border: string;
  dot: string;
}> = {
  completed: {
    label    : 'Completed',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    bg       : 'bg-emerald-50 dark:bg-emerald-950/40',
    border   : 'border-emerald-200 dark:border-emerald-800/50',
    dot      : 'bg-emerald-500',
  },
  'in-progress': {
    label    : 'In Progress',
    textColor: 'text-blue-700 dark:text-blue-400',
    bg       : 'bg-blue-50 dark:bg-blue-950/40',
    border   : 'border-blue-200 dark:border-blue-800/50',
    dot      : 'bg-blue-500',
  },
  planned: {
    label    : 'Planned',
    textColor: 'text-violet-700 dark:text-violet-400',
    bg       : 'bg-violet-50 dark:bg-violet-950/40',
    border   : 'border-violet-200 dark:border-violet-800/50',
    dot      : 'bg-violet-500',
  },
  future: {
    label    : 'Future',
    textColor: 'text-neutral-500 dark:text-neutral-400',
    bg       : 'bg-neutral-100 dark:bg-neutral-800/60',
    border   : 'border-neutral-200 dark:border-neutral-700',
    dot      : 'bg-neutral-400 dark:bg-neutral-500',
  },
};

// ─── Filter options ───────────────────────────────────────────────────────────
export const FILTER_OPTIONS: { label: string; value: RoadmapStatus | 'all' }[] = [
  { label: 'All',         value: 'all'         },
  { label: 'Completed',   value: 'completed'   },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Planned',     value: 'planned'     },
  { label: 'Future',      value: 'future'      },
];
