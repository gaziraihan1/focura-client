import {  LayoutDashboard, BarChart2, CheckSquare, Megaphone, Settings } from "lucide-react";
import { useMemo } from "react"

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
        label: "Analytics",
        href: `${base}/analytics`,
        icon: BarChart2,
        match: (p) => p.startsWith(`${base}/analytics`),
      },
      {
        label: "Tasks",
        href: `${base}/tasks`,
        icon: CheckSquare,
        match: (p) => p.startsWith(`${base}/tasks`),
      },
      {
        label: "Announcements",
        href: `${base}/announcements`,
        icon: Megaphone,
        match: (p) => p.startsWith(`${base}/announcements`),
      },
      {
        label: "Settings",
        href: `${base}/settings`,
        icon: Settings,
        match: (p) => p.startsWith(`${base}/settings`),
      },
    ],
    [base]
  );
}