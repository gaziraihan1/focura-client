import type { GuideSection } from "@/types/guides.types";

/**
 * A developer-guide section. Article content (rich JSX) lives separately in
 * `components/DevGuides/DevGuideArticles.tsx` and is merged at the page level.
 */
export type DevSection = Omit<GuideSection, "articles"> & { badge?: string };

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
  {
    id: "ai",
    icon: "✦",
    label: "AI (Gemini)",
    color: "cyan",
    title: "AI (Gemini)",
    subtitle: "Server-side AI module, quota system & frontend hooks",
  },
];

export { COLOR_MAP } from "@/constants/guides.constants";
