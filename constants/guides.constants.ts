import type { ColorTokens, GuideSection } from "@/types/guides.types";

export const COLOR_MAP: Record<string, ColorTokens> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    pill: "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-800",
    pill: "bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    pill: "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    pill: "bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
    pill: "bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-950/40",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-200 dark:border-teal-800",
    pill: "bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800",
    pill: "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    pill: "bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300",
  },
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-200 dark:border-cyan-800",
    pill: "bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300",
  },
  slate: {
    bg: "bg-slate-50 dark:bg-slate-800/40",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-700",
    pill: "bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300",
  },
};



export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "getting-started",
    icon: "✦",
    label: "Getting Started",
    color: "blue",
    title: "Welcome to Focura",
    subtitle: "Your team's all-in-one workspace",
  },
  {
    id: "workspace",
    icon: "⬡",
    label: "Workspace",
    color: "violet",
    title: "Workspace",
    subtitle: "Your team's shared environment",
  },
  {
    id: "projects",
    icon: "◈",
    label: "Projects",
    color: "emerald",
    title: "Projects",
    subtitle: "Organize work into focused areas",
  },
  {
    id: "tasks",
    icon: "◉",
    label: "Tasks",
    color: "amber",
    title: "Tasks",
    subtitle: "Create, assign & track work items",
  },
  {
    id: "announcements",
    icon: "◎",
    label: "Announcements",
    color: "rose",
    title: "Announcements",
    subtitle: "Broadcast updates to your team",
  },
  {
    id: "members",
    icon: "⬟",
    label: "Members & Roles",
    color: "teal",
    title: "Members & Roles",
    subtitle: "Manage who can do what",
  },
  {
    id: "invite-members",
    icon: "✉",
    label: "Inviting Members",
    color: "teal",
    title: "Inviting Members",
    subtitle: "Bring your team into the workspace",
  },
  {
    id: "labels",
    icon: "🏷",
    label: "Labels",
    color: "violet",
    title: "Labels",
    subtitle: "Tag and categorize tasks your way",
  },
  {
    id: "activity",
    icon: "⚡",
    label: "Activity Tracking",
    color: "amber",
    title: "Activity Tracking",
    subtitle: "A transparent record of all team actions",
  },
  {
    id: "focus",
    icon: "◐",
    label: "Focus Mode",
    color: "indigo",
    title: "Focus Mode",
    subtitle: "Deep work, distraction-free",
  },
  {
    id: "meetings",
    icon: "◇",
    label: "Meetings",
    color: "orange",
    title: "Meetings",
    subtitle: "Schedule & track team discussions",
  },
  {
    id: "voting",
    icon: "▲",
    label: "Feature Voting",
    color: "cyan",
    title: "Feature Voting",
    subtitle: "Prioritize what matters most",
  },
  {
    id: "billing",
    icon: "◆",
    label: "Billing & Plans",
    color: "slate",
    title: "Billing & Plans",
    subtitle: "Manage your subscription",
  },
];

export const PLATFORM_OVERVIEW = [
  { name: "Workspace", desc: "Your team's shared environment with projects, members & settings" },
  { name: "Projects", desc: "Containers for organizing related tasks and goals" },
  { name: "Tasks", desc: "Work items with status, assignees, subtasks, and attachments" },
  { name: "Announcements", desc: "Rich-text broadcasts pinned to the top of your workspace" },
  { name: "Focus Mode", desc: "Timed deep-work sessions linked to a single task" },
  { name: "Meetings", desc: "Scheduled team discussions attached to projects" },
  { name: "Feature Voting", desc: "Community-driven idea board with upvote counts" },
  { name: "Billing", desc: "Stripe-powered subscription management (Owner only)" },
] as const;

export const TASK_STATUSES = [
  { label: "To Do", color: "slate" },
  { label: "In Progress", color: "blue" },
  { label: "In Review", color: "amber" },
  { label: "Completed", color: "emerald" },
  { label: "Blocked", color: "rose" },
] as const;

export const MEMBER_ROLES = [
  {
    name: "Owner",
    color: "amber",
    icon: "◆",
    perms: [
      "Full workspace control",
      "Billing & subscription",
      "Transfer ownership",
      "Cannot be removed",
    ],
  },
  {
    name: "Admin",
    color: "blue",
    icon: "⬟",
    perms: [
      "Manage members",
      "Create announcements",
      "Manage projects",
      "No billing access",
    ],
  },
  {
    name: "Member",
    color: "emerald",
    icon: "⬡",
    perms: [
      "Create & manage tasks",
      "View announcements",
      "Join assigned projects",
      "No settings access",
    ],
  },
] as const;

export const PROJECT_VIEW_MODES = [
  {
    badge: "Project Mode",
    color: "emerald",
    desc: "See all tasks for a specific project, regardless of who they're assigned to.",
  },
  {
    badge: "Personal Mode",
    color: "blue",
    desc: "See only the tasks assigned to you across all your projects.",
  },
  {
    badge: "Workspace Mode",
    color: "violet",
    desc: "Owners and admins see all tasks workspace-wide. Members see only their own.",
  },
] as const;

export const GETTING_STARTED_CARDS = [
  {
    icon: "⬡",
    color: "violet",
    title: "Create a Workspace",
    desc: "Set up your team's home in Focura after signing up.",
  },
  {
    icon: "◈",
    color: "emerald",
    title: "Add Projects",
    desc: "Group related work into focused project containers.",
  },
  {
    icon: "◉",
    color: "amber",
    title: "Create Tasks",
    desc: "Break projects into actionable, assignable tasks.",
  },
  {
    icon: "⬟",
    color: "teal",
    title: "Invite Your Team",
    desc: "Add members and assign roles to collaborate.",
  },
] as const;
