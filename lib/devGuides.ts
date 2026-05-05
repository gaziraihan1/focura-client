export interface DevSection {
  id: string;
  icon: string;
  label: string;
  color: string;
  title: string;
  subtitle: string;
  badge?: string;
}

export interface ColorTokens {
  bg: string;
  text: string;
  border: string;
  pill: string;
}

export const DEV_SECTIONS: DevSection[] = [
  {
    id: "overview",
    icon: "◈",
    label: "Overview",
    color: "blue",
    title: "Developer Overview",
    subtitle: "Stack, architecture goals & repo structure",
  },
  {
    id: "setup",
    icon: "⚙",
    label: "Local Setup",
    color: "emerald",
    title: "Local Setup",
    subtitle: "Get both repos running in minutes",
  },
  {
    id: "frontend-arch",
    icon: "◉",
    label: "Frontend Architecture",
    color: "violet",
    title: "Frontend Architecture",
    subtitle: "Next.js App Router, hooks, components & state",
  },
  {
    id: "backend-arch",
    icon: "⬡",
    label: "Backend Architecture",
    color: "indigo",
    title: "Backend Architecture",
    subtitle: "Modular monolith, module conventions & Prisma",
  },
  {
    id: "auth",
    icon: "◐",
    label: "Authentication",
    color: "amber",
    title: "Authentication",
    subtitle: "NextAuth + RS256 JWT + token exchange flow",
  },
  {
    id: "api-layer",
    icon: "◇",
    label: "API Layer",
    color: "teal",
    title: "API Layer",
    subtitle: "Axios instance, interceptors & React Query hooks",
  },
  {
    id: "database",
    icon: "◆",
    label: "Database & Prisma",
    color: "slate",
    title: "Database & Prisma",
    subtitle: "Schema conventions, migrations & workspace isolation",
  },
  {
    id: "caching",
    icon: "▲",
    label: "Caching & Redis",
    color: "orange",
    title: "Caching & Redis",
    subtitle: "Upstash Redis, cache invalidation & token revocation",
  },
  {
    id: "realtime",
    icon: "◎",
    label: "Real-time (SSE)",
    color: "cyan",
    title: "Real-time (SSE)",
    subtitle: "Server-Sent Events notification stream",
  },
  {
    id: "adding-feature",
    icon: "✦",
    label: "Adding a Feature",
    color: "rose",
    title: "Adding a Feature",
    subtitle: "End-to-end walkthrough: backend → frontend",
  },
  {
    id: "testing",
    icon: "⬟",
    label: "Testing",
    color: "pink",
    title: "Testing",
    subtitle: "Vitest, RTL, MSW setup & patterns",
  },
  {
    id: "env-vars",
    icon: "◑",
    label: "Env Variables",
    color: "emerald",
    title: "Environment Variables",
    subtitle: "All required vars for client & backend",
  },
  {
    id: "conventions",
    icon: "⊕",
    label: "Code Conventions",
    color: "violet",
    title: "Code Conventions",
    subtitle: "TypeScript rules, naming & commit guidelines",
  },
];


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
  pink: {
    bg: "bg-pink-50 dark:bg-pink-950/40",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-200 dark:border-pink-800",
    pill: "bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300",
  },
};
