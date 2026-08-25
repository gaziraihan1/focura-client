import { LayoutDashboard, CheckSquare, Flag, Sprout, Columns, Eye, BarChart2, Clock, Megaphone, Star, Settings } from "lucide-react";
import { useMemo } from "react";

export interface ProjectNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  match: (path: string) => boolean;
  badge?: string;
}

// ─── Nav config ──────────────────────────────────────────────────────────────

export function useProjectNav(workspaceSlug: string, projectSlug: string): ProjectNavItem[] {
  const base = `/dashboard/workspaces/${workspaceSlug}/projects/${projectSlug}`;
  return useMemo(
    () => [
      {
        label: "Overview",
        href: base,
        icon: LayoutDashboard,
        match: (p) => p === base,
      },
      {
        label: "Tasks",
        href: `${base}/tasks`,
        icon: CheckSquare,
        match: (p) => p.startsWith(`${base}/tasks`),
      },
      {
        label: "Milestones",
        href: `${base}/milestones`,
        icon: Flag,
        match: (p) => p.startsWith(`${base}/milestones`),
      },
      {
        label: "Sprints",
        href: `${base}/sprints`,
        icon: Sprout,
        match: (p) => p.startsWith(`${base}/sprints`),
      },
      {
        label: "Sections",
        href: `${base}/sections`,
        icon: Columns,
        match: (p) => p.startsWith(`${base}/sections`),
      },
      {
        label: "Views",
        href: `${base}/views`,
        icon: Eye,
        match: (p) => p.startsWith(`${base}/views`),
      },
      {
        label: "Analytics",
        href: `${base}/analytics`,
        icon: BarChart2,
        match: (p) => p.startsWith(`${base}/analytics`),
      },
      {
        label: "Time Reports",
        href: `${base}/reports`,
        icon: Clock,
        match: (p) => p.startsWith(`${base}/reports`),
      },
      {
        label: "Announcements",
        href: `${base}/announcements`,
        icon: Megaphone,
        match: (p) => p.startsWith(`${base}/announcements`),
      },
      {
        label: "Favorites",
        href: `${base}/favorites`,
        icon: Star,
        match: (p) => p.startsWith(`${base}/favorites`),
      },
      {
        label: "Settings",
        href: `${base}/settings`,
        icon: Settings,
        match: (p) => p.startsWith(`${base}/settings`),
      },
    ],
    [base],
  );
}
