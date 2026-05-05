import { Template, TemplateCategory, TemplateComplexity } from "@/types/templates.types";


// ─── Category metadata ────────────────────────────────────────────────────────
export const CATEGORY_META: Record<TemplateCategory, {
  label      : string;
  description: string;
  color      : string;
  bgColor    : string;
  borderColor: string;
}> = {
  engineering : { label: 'Engineering',  description: 'Sprint planning, bug tracking, tech debt',      color: 'text-blue-600 dark:text-blue-400',    bgColor: 'bg-blue-50 dark:bg-blue-950/40',    borderColor: 'border-blue-200 dark:border-blue-800/50'    },
  product     : { label: 'Product',      description: 'Roadmaps, feature tracking, release planning',  color: 'text-violet-600 dark:text-violet-400', bgColor: 'bg-violet-50 dark:bg-violet-950/40', borderColor: 'border-violet-200 dark:border-violet-800/50' },
  marketing   : { label: 'Marketing',    description: 'Campaign planning, content calendar, launches',  color: 'text-rose-600 dark:text-rose-400',    bgColor: 'bg-rose-50 dark:bg-rose-950/40',    borderColor: 'border-rose-200 dark:border-rose-800/50'    },
  design      : { label: 'Design',       description: 'Design sprints, feedback rounds, handoffs',      color: 'text-amber-600 dark:text-amber-400',  bgColor: 'bg-amber-50 dark:bg-amber-950/40',  borderColor: 'border-amber-200 dark:border-amber-800/50'  },
  operations  : { label: 'Operations',   description: 'Process docs, SOPs, incident management',        color: 'text-cyan-600 dark:text-cyan-400',    bgColor: 'bg-cyan-50 dark:bg-cyan-950/40',    borderColor: 'border-cyan-200 dark:border-cyan-800/50'    },
  hr          : { label: 'People & HR',  description: 'Hiring pipelines, onboarding, performance',      color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-950/40', borderColor: 'border-emerald-200 dark:border-emerald-800/50' },
  startup     : { label: 'Startup',      description: 'Fundraising, launch planning, OKR tracking',     color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-50 dark:bg-orange-950/40', borderColor: 'border-orange-200 dark:border-orange-800/50' },
  personal    : { label: 'Personal',     description: 'Goal tracking, habit building, side projects',    color: 'text-pink-600 dark:text-pink-400',    bgColor: 'bg-pink-50 dark:bg-pink-950/40',    borderColor: 'border-pink-200 dark:border-pink-800/50'    },
};

export const COMPLEXITY_META: Record<TemplateComplexity, { label: string; style: string }> = {
  starter     : { label: 'Starter',      style: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400' },
  intermediate: { label: 'Intermediate', style: 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400'         },
  advanced    : { label: 'Advanced',     style: 'bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400'     },
};

// ─── Template registry ────────────────────────────────────────────────────────
export const TEMPLATES: Template[] = [
  // ── Engineering ─────────────────────────────────────────────────────────────
  {
    id     : 'eng-sprint',
    slug   : 'engineering-sprint',
    title  : 'Agile Sprint Board',
    description: '2-week sprint with backlog, in-progress, review, and done columns. Includes story points via labels.',
    longDescription: 'A battle-tested sprint board template for software engineering teams. Pre-configured with backlog grooming tasks, sprint planning, daily standups, and a retrospective. Uses Focura\'s Kanban view with WIP limits and the List view for backlog management. Labels cover story sizes (XS, S, M, L, XL) and types (Feature, Bug, Chore, Tech Debt).',
    category: 'engineering',
    complexity: 'starter',
    status  : 'coming_soon',
    icon    : '⚙️',
    color   : '#3b82f6',
    sections: ['Backlog', 'Sprint Ready', 'In Progress', 'In Review', 'Done'],
    views   : ['KANBAN', 'LIST'],
    tasks   : [
      { title: 'Sprint planning meeting', status: 'TODO', priority: 'HIGH',   section: 'Backlog',    label: 'Chore' },
      { title: 'Refine top 5 backlog items', status: 'TODO', priority: 'MEDIUM', section: 'Backlog', label: 'Chore' },
      { title: 'Set sprint goal',         status: 'TODO', priority: 'HIGH',   section: 'Backlog',    label: 'Chore' },
      { title: 'User authentication flow', status: 'TODO', priority: 'URGENT', section: 'Sprint Ready', label: 'Feature' },
      { title: 'Fix login redirect bug',  status: 'TODO', priority: 'HIGH',   section: 'Sprint Ready', label: 'Bug' },
      { title: 'Write unit tests for auth', status: 'TODO', priority: 'MEDIUM', section: 'Backlog',  label: 'Chore' },
      { title: 'Sprint retrospective',    status: 'TODO', priority: 'MEDIUM', section: 'Backlog',    label: 'Chore' },
      { title: 'Update documentation',    status: 'TODO', priority: 'LOW',    section: 'Backlog',    label: 'Chore' },
    ],
    labels: [
      { name: 'Feature',   color: '#3b82f6' },
      { name: 'Bug',       color: '#ef4444' },
      { name: 'Chore',     color: '#8b5cf6' },
      { name: 'Tech Debt', color: '#f59e0b' },
      { name: 'XS',        color: '#10b981' },
      { name: 'S',         color: '#22c55e' },
      { name: 'M',         color: '#f59e0b' },
      { name: 'L',         color: '#f97316' },
      { name: 'XL',        color: '#ef4444' },
    ],
    milestones: [
      { title: 'Sprint Start',       dueWeek: 0 },
      { title: 'Mid-Sprint Review',  dueWeek: 1 },
      { title: 'Sprint End & Retro', dueWeek: 2 },
    ],
    usageCount: 0,
    estimatedSetupMinutes: 3,
    tags: ['agile', 'scrum', 'sprint', 'kanban', 'engineering'],
    author: { name: 'Focura Team', role: 'Official' },
  },
  {
    id     : 'eng-bugtracker',
    slug   : 'bug-tracker',
    title  : 'Bug Tracker',
    description: 'Structured bug triage with severity levels, reproducibility notes, and a clear fix → verify workflow.',
    longDescription: 'A dedicated bug tracking project template. Bugs move from Reported → Triaged → In Fix → Needs Verification → Closed. Labels cover severity (Critical, High, Medium, Low), environment (Production, Staging, Dev), and browser/OS tags. Includes a recurring weekly triage task.',
    category: 'engineering',
    complexity: 'intermediate',
    status  : 'coming_soon',
    icon    : '🐛',
    color   : '#ef4444',
    sections: ['Reported', 'Triaged', 'In Fix', 'Needs Verification', 'Closed'],
    views   : ['KANBAN', 'LIST'],
    tasks   : [
      { title: 'Weekly bug triage',       status: 'TODO', priority: 'HIGH',   section: 'Reported', label: 'Process'  },
      { title: 'Crash on mobile Safari',  status: 'TODO', priority: 'URGENT', section: 'Triaged',  label: 'Critical' },
      { title: 'Button misaligned on IE', status: 'TODO', priority: 'LOW',    section: 'Triaged',  label: 'Low'      },
    ],
    labels: [
      { name: 'Critical',    color: '#dc2626' },
      { name: 'High',        color: '#f97316' },
      { name: 'Medium',      color: '#f59e0b' },
      { name: 'Low',         color: '#6b7280' },
      { name: 'Production',  color: '#7c3aed' },
      { name: 'Regression',  color: '#ec4899' },
      { name: 'Process',     color: '#0ea5e9' },
    ],
    milestones: [],
    usageCount: 0,
    estimatedSetupMinutes: 2,
    tags: ['bugs', 'qa', 'triage', 'engineering'],
    author: { name: 'Focura Team', role: 'Official' },
  },

  // ── Product ──────────────────────────────────────────────────────────────────
  {
    id     : 'product-roadmap',
    slug   : 'product-roadmap',
    title  : 'Product Roadmap',
    description: 'Quarterly roadmap with Now / Next / Later columns, OKR alignment labels, and milestone checkpoints.',
    longDescription: 'A high-level product roadmap for teams building software products. Organised into Now (this quarter), Next (next quarter), and Later (future) columns. Labels align features to OKR pillars. Includes a milestone for each quarterly planning cycle and a monthly leadership review.',
    category: 'product',
    complexity: 'intermediate',
    status  : 'coming_soon',
    icon    : '🗺️',
    color   : '#8b5cf6',
    sections: ['Now (This Quarter)', 'Next (Next Quarter)', 'Later (Future)', 'Shipped'],
    views   : ['KANBAN', 'CALENDAR'],
    tasks   : [
      { title: 'Q3 OKR alignment session',  status: 'TODO', priority: 'HIGH',   section: 'Now (This Quarter)' },
      { title: 'Dark mode support',          status: 'TODO', priority: 'HIGH',   section: 'Now (This Quarter)' },
      { title: 'API v2 public release',      status: 'TODO', priority: 'MEDIUM', section: 'Next (Next Quarter)' },
      { title: 'Mobile app (iOS)',           status: 'TODO', priority: 'MEDIUM', section: 'Later (Future)' },
      { title: 'Enterprise SSO',             status: 'TODO', priority: 'HIGH',   section: 'Later (Future)' },
      { title: 'Quarterly leadership review',status: 'TODO', priority: 'HIGH',   section: 'Now (This Quarter)' },
    ],
    labels: [
      { name: 'Growth',      color: '#10b981' },
      { name: 'Retention',   color: '#3b82f6' },
      { name: 'Revenue',     color: '#f59e0b' },
      { name: 'Reliability', color: '#8b5cf6' },
      { name: 'Strategic',   color: '#ec4899' },
    ],
    milestones: [
      { title: 'Q3 Planning Complete', dueWeek: 1 },
      { title: 'Mid-Quarter Review',   dueWeek: 6 },
      { title: 'Q3 Wrap-up',          dueWeek: 13 },
    ],
    usageCount: 0,
    estimatedSetupMinutes: 5,
    tags: ['product', 'roadmap', 'okr', 'strategy', 'planning'],
    author: { name: 'Focura Team', role: 'Official' },
  },
  {
    id     : 'product-launch',
    slug   : 'product-launch',
    title  : 'Product Launch Checklist',
    description: 'End-to-end launch preparation across engineering, marketing, support, and legal with countdown milestones.',
    longDescription: 'Everything needed to ship a product from internal beta to public launch. Covers engineering (feature freeze, load testing, monitoring), marketing (launch post, social, email), legal (T&Cs, privacy, GDPR), and customer success (support docs, FAQ, chatbot). Milestones mark T-30, T-14, T-7, and launch day.',
    category: 'product',
    complexity: 'advanced',
    status  : 'coming_soon',
    icon    : '🚀',
    color   : '#7c3aed',
    sections: ['Engineering', 'Marketing', 'Legal & Compliance', 'Customer Success', 'Launch Day'],
    views   : ['LIST', 'CALENDAR'],
    tasks   : [
      { title: 'Feature freeze',              status: 'TODO', priority: 'URGENT', section: 'Engineering',       label: 'Engineering' },
      { title: 'Load testing (10k users)',    status: 'TODO', priority: 'URGENT', section: 'Engineering',       label: 'Engineering' },
      { title: 'Write launch blog post',      status: 'TODO', priority: 'HIGH',   section: 'Marketing',         label: 'Marketing'   },
      { title: 'Schedule social media',       status: 'TODO', priority: 'MEDIUM', section: 'Marketing',         label: 'Marketing'   },
      { title: 'Review Terms & Conditions',   status: 'TODO', priority: 'HIGH',   section: 'Legal & Compliance',label: 'Legal'       },
      { title: 'Write support FAQ',           status: 'TODO', priority: 'HIGH',   section: 'Customer Success',  label: 'Support'     },
      { title: 'Press embargo lifted',        status: 'TODO', priority: 'URGENT', section: 'Launch Day',        label: 'Marketing'   },
    ],
    labels: [
      { name: 'Engineering', color: '#3b82f6' },
      { name: 'Marketing',   color: '#ec4899' },
      { name: 'Legal',       color: '#f59e0b' },
      { name: 'Support',     color: '#10b981' },
      { name: 'Blocker',     color: '#dc2626' },
    ],
    milestones: [
      { title: 'T-30: Kickoff',          dueWeek: -4  },
      { title: 'T-14: Content Ready',    dueWeek: -2  },
      { title: 'T-7: Final QA',          dueWeek: -1  },
      { title: 'Launch Day 🚀',          dueWeek: 0   },
      { title: 'T+7: Post-Launch Review',dueWeek: 1   },
    ],
    usageCount: 0,
    estimatedSetupMinutes: 8,
    tags: ['launch', 'product', 'checklist', 'marketing', 'engineering'],
    author: { name: 'Focura Team', role: 'Official' },
  },

  // ── Marketing ────────────────────────────────────────────────────────────────
  {
    id     : 'marketing-content',
    slug   : 'content-calendar',
    title  : 'Content Calendar',
    description: 'Monthly editorial calendar with content types, channels, and publish-date scheduling across your team.',
    longDescription: 'Plan, assign, and track all content production in one project. Sections map to content status (Ideas → Writing → Review → Scheduled → Published). Labels cover content type (Blog, LinkedIn, Twitter/X, Email, Video) and topic pillar. Calendar view makes scheduling visual.',
    category: 'marketing',
    complexity: 'starter',
    status  : 'coming_soon',
    icon    : '📅',
    color   : '#f43f5e',
    sections: ['Ideas', 'Writing', 'In Review', 'Scheduled', 'Published'],
    views   : ['LIST', 'CALENDAR'],
    tasks   : [
      { title: 'Q3 content strategy doc',   status: 'TODO', priority: 'HIGH',   section: 'Ideas',     label: 'Blog'      },
      { title: 'Week 1: Product update post',status: 'TODO', priority: 'HIGH',   section: 'Writing',   label: 'Blog'      },
      { title: 'Customer spotlight video',  status: 'TODO', priority: 'MEDIUM', section: 'Ideas',     label: 'Video'     },
      { title: 'Monthly email newsletter',  status: 'TODO', priority: 'HIGH',   section: 'Writing',   label: 'Email'     },
      { title: 'LinkedIn company update',   status: 'TODO', priority: 'MEDIUM', section: 'Scheduled', label: 'LinkedIn'  },
    ],
    labels: [
      { name: 'Blog',       color: '#3b82f6' },
      { name: 'Email',      color: '#f59e0b' },
      { name: 'LinkedIn',   color: '#0077b5' },
      { name: 'Twitter/X',  color: '#1da1f2' },
      { name: 'Video',      color: '#ef4444' },
      { name: 'SEO',        color: '#10b981' },
    ],
    milestones: [
      { title: 'Month 1 content locked', dueWeek: 0 },
      { title: 'Month 2 content locked', dueWeek: 4 },
    ],
    usageCount: 0,
    estimatedSetupMinutes: 3,
    tags: ['content', 'marketing', 'editorial', 'calendar', 'social'],
    author: { name: 'Focura Team', role: 'Official' },
  },

  // ── HR ───────────────────────────────────────────────────────────────────────
  {
    id     : 'hr-hiring',
    slug   : 'hiring-pipeline',
    title  : 'Hiring Pipeline',
    description: 'Track candidates from application to offer with structured interview stages and feedback tasks.',
    longDescription: 'A structured recruiting pipeline for growing teams. Each open role becomes a section. Candidates move from Applied → Phone Screen → Technical Interview → Final Round → Offer → Hired / Rejected. Labels track role, department, and interview feedback score. Includes recurring tasks for weekly recruiter syncs.',
    category: 'hr',
    complexity: 'intermediate',
    status  : 'coming_soon',
    icon    : '🧑‍💼',
    color   : '#10b981',
    sections: ['Applied', 'Phone Screen', 'Technical', 'Final Round', 'Offer Stage', 'Hired', 'Rejected'],
    views   : ['KANBAN', 'LIST'],
    tasks   : [
      { title: 'Weekly recruiter sync',      status: 'TODO', priority: 'HIGH',   section: 'Applied',  label: 'Process'    },
      { title: 'Write JD for Senior FE',     status: 'TODO', priority: 'HIGH',   section: 'Applied',  label: 'Engineering'},
      { title: 'Candidate: Jane Doe',        status: 'TODO', priority: 'MEDIUM', section: 'Technical',label: 'Engineering'},
      { title: 'Send offer letter template', status: 'TODO', priority: 'HIGH',   section: 'Applied',  label: 'Process'    },
      { title: 'Reference checks: John',     status: 'TODO', priority: 'HIGH',   section: 'Offer Stage',label: 'Engineering'},
    ],
    labels: [
      { name: 'Engineering',  color: '#3b82f6' },
      { name: 'Design',       color: '#f59e0b' },
      { name: 'Marketing',    color: '#ec4899' },
      { name: 'Process',      color: '#8b5cf6' },
      { name: 'Strong Yes',   color: '#10b981' },
      { name: 'Maybe',        color: '#f59e0b' },
      { name: 'No',           color: '#ef4444' },
    ],
    milestones: [],
    usageCount: 0,
    estimatedSetupMinutes: 4,
    tags: ['hiring', 'recruiting', 'hr', 'people', 'interviews'],
    author: { name: 'Focura Team', role: 'Official' },
  },
  {
    id     : 'hr-onboarding',
    slug   : 'employee-onboarding',
    title  : 'Employee Onboarding',
    description: '30-day onboarding plan covering tools setup, team introductions, first project, and 30-day check-in.',
    longDescription: 'A structured first-30-days plan for new team members. Week 1 covers tools, accounts, and introductions. Week 2 is shadowing and learning. Weeks 3–4 are first real contributions. Includes daily check-in tasks, a buddy assignment, and a 30-day review milestone.',
    category: 'hr',
    complexity: 'starter',
    status  : 'coming_soon',
    icon    : '🎉',
    color   : '#06b6d4',
    sections: ['Day 1', 'Week 1', 'Week 2', 'Weeks 3–4', 'Completed'],
    views   : ['LIST', 'CALENDAR'],
    tasks   : [
      { title: 'Set up laptop and accounts',     status: 'TODO', priority: 'URGENT', section: 'Day 1',   label: 'IT Setup' },
      { title: 'Meet the team (intro call)',      status: 'TODO', priority: 'HIGH',   section: 'Day 1',   label: 'People'   },
      { title: 'Read company handbook',           status: 'TODO', priority: 'MEDIUM', section: 'Week 1',  label: 'Learning' },
      { title: 'Shadow a product demo',           status: 'TODO', priority: 'MEDIUM', section: 'Week 2',  label: 'Learning' },
      { title: 'First PR / first deliverable',    status: 'TODO', priority: 'HIGH',   section: 'Weeks 3–4',label: 'Work'   },
      { title: '30-day check-in with manager',   status: 'TODO', priority: 'HIGH',   section: 'Weeks 3–4',label: 'People' },
    ],
    labels: [
      { name: 'IT Setup',  color: '#6b7280' },
      { name: 'People',    color: '#10b981' },
      { name: 'Learning',  color: '#3b82f6' },
      { name: 'Work',      color: '#8b5cf6' },
      { name: 'Admin',     color: '#f59e0b' },
    ],
    milestones: [
      { title: 'End of Week 1',   dueWeek: 1 },
      { title: '30-day Review',   dueWeek: 4 },
    ],
    usageCount: 0,
    estimatedSetupMinutes: 3,
    tags: ['onboarding', 'hr', 'new-hire', 'people'],
    author: { name: 'Focura Team', role: 'Official' },
  },

  // ── Startup ──────────────────────────────────────────────────────────────────
  {
    id     : 'startup-launch',
    slug   : 'startup-launch',
    title  : 'Startup Launch Plan',
    description: 'Zero to launch in 90 days — covering product, legal, marketing, and fundraising in one master project.',
    longDescription: 'An opinionated 90-day plan for early-stage startups getting to their first public launch. Covers company formation (legal, banking), product MVP scoping, investor deck prep, early user acquisition, and launch week execution. Uses Calendar view for milestone tracking.',
    category: 'startup',
    complexity: 'advanced',
    status  : 'coming_soon',
    icon    : '⚡',
    color   : '#f97316',
    sections: ['Legal & Company', 'Product', 'Marketing & Growth', 'Fundraising', 'Launch Week'],
    views   : ['LIST', 'CALENDAR', 'KANBAN'],
    tasks   : [
      { title: 'Incorporate the company',       status: 'TODO', priority: 'URGENT', section: 'Legal & Company', label: 'Legal'      },
      { title: 'Open business bank account',    status: 'TODO', priority: 'HIGH',   section: 'Legal & Company', label: 'Legal'      },
      { title: 'Define MVP scope (10 features max)', status: 'TODO', priority: 'URGENT', section: 'Product',    label: 'Product'    },
      { title: 'Build investor pitch deck',     status: 'TODO', priority: 'HIGH',   section: 'Fundraising',    label: 'Fundraising'},
      { title: 'Identify 100 launch users',     status: 'TODO', priority: 'HIGH',   section: 'Marketing & Growth', label: 'Growth'},
      { title: 'Submit to Product Hunt',        status: 'TODO', priority: 'HIGH',   section: 'Launch Week',    label: 'Marketing'  },
    ],
    labels: [
      { name: 'Legal',      color: '#f59e0b' },
      { name: 'Product',    color: '#8b5cf6' },
      { name: 'Fundraising',color: '#10b981' },
      { name: 'Growth',     color: '#3b82f6' },
      { name: 'Marketing',  color: '#ec4899' },
      { name: 'Blocker',    color: '#dc2626' },
    ],
    milestones: [
      { title: 'Company formed',    dueWeek: 2 },
      { title: 'MVP scoped',        dueWeek: 4 },
      { title: 'Beta users onboard',dueWeek: 8 },
      { title: 'Public launch 🚀',  dueWeek: 12 },
    ],
    usageCount: 0,
    estimatedSetupMinutes: 10,
    tags: ['startup', 'launch', 'mvp', 'fundraising', 'product'],
    author: { name: 'Focura Team', role: 'Official' },
  },

  // ── Personal ─────────────────────────────────────────────────────────────────
  {
    id     : 'personal-goals',
    slug   : 'personal-goals',
    title  : 'Quarterly Goals',
    description: 'Set and track personal quarterly goals with weekly check-ins, focus sessions, and habit streaks.',
    longDescription: 'A personal OKR template for individuals. Define 3 objectives each with 3 key results. Weekly review tasks keep you accountable. Focus session integration lets you link deep work to specific goals. Daily tasks feed into the weekly view.',
    category: 'personal',
    complexity: 'starter',
    status  : 'coming_soon',
    icon    : '🎯',
    color   : '#ec4899',
    sections: ['Objectives', 'Key Results', 'Weekly Actions', 'Habits', 'Completed'],
    views   : ['LIST', 'CALENDAR'],
    tasks   : [
      { title: 'Define 3 quarterly objectives', status: 'TODO', priority: 'HIGH',   section: 'Objectives',    label: 'Planning' },
      { title: 'Write 3 KRs per objective',     status: 'TODO', priority: 'HIGH',   section: 'Key Results',   label: 'Planning' },
      { title: 'Weekly Sunday review',           status: 'TODO', priority: 'MEDIUM', section: 'Weekly Actions',label: 'Review'   },
      { title: 'Daily reading habit (30 min)',   status: 'TODO', priority: 'MEDIUM', section: 'Habits',        label: 'Habit'    },
      { title: 'Exercise 4× per week',           status: 'TODO', priority: 'MEDIUM', section: 'Habits',        label: 'Habit'    },
      { title: 'Mid-quarter check-in',           status: 'TODO', priority: 'HIGH',   section: 'Weekly Actions',label: 'Review'   },
    ],
    labels: [
      { name: 'Planning', color: '#8b5cf6' },
      { name: 'Review',   color: '#3b82f6' },
      { name: 'Habit',    color: '#10b981' },
      { name: 'Work',     color: '#f59e0b' },
      { name: 'Health',   color: '#ec4899' },
    ],
    milestones: [
      { title: 'Goals set',         dueWeek: 1  },
      { title: 'Mid-quarter check', dueWeek: 6  },
      { title: 'Quarter end review',dueWeek: 13 },
    ],
    usageCount: 0,
    estimatedSetupMinutes: 2,
    tags: ['goals', 'okr', 'personal', 'habits', 'productivity'],
    author: { name: 'Focura Team', role: 'Official' },
  },
];

// ─── Helper functions ─────────────────────────────────────────────────────────
export function filterTemplates(
  templates : Template[],
  category  : TemplateCategory | 'all',
  search    : string
): Template[] {
  return templates.filter((t) => {
    const matchCat    = category === 'all' || t.category === category;
    const q           = search.toLowerCase();
    const matchSearch = !q
      || t.title.toLowerCase().includes(q)
      || t.description.toLowerCase().includes(q)
      || t.tags.some((tag) => tag.includes(q));
    return matchCat && matchSearch;
  });
}

export const ALL_CATEGORIES = [
  'all',
  ...(Object.keys(CATEGORY_META) as TemplateCategory[])
] as const;

export type CategoryFilter = typeof ALL_CATEGORIES[number];