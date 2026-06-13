// workspace.hooks.ts — updated for public workspace viewer support

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  useWorkspace,
  useWorkspaces,
  useWorkspaceRoleFromWorkspace,
  useWorkspaceOverview,
  WorkspaceMember,
  useWorkspaceStats,
} from "@/hooks/useWorkspace";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Users,
  Calendar,
  BarChart3,
  Tags,
  Files,
  Store,
  UserLock,
  CreditCard,
  Megaphone,
  List,
  Kanban,
  CalendarDays,
} from "lucide-react";

type TabType = "overview" | "projects" | "members";

interface UseWorkspaceDetailPageProps {
  slug: string;
}

interface UseWorkspaceLayoutProps {
  slug: string;
  pathname: string;
  isFree: boolean;
}

export function useWorkspaceLayout({
  slug,
  pathname,
  isFree,
}: UseWorkspaceLayoutProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const { data: workspace, isLoading } = useWorkspace(slug);
  const { data: allWorkspaces = [] } = useWorkspaces();
  const { canManageWorkspace } = useWorkspaceRoleFromWorkspace(slug);

  // Derive membership and access from workspace data —
  // backend already enforces public-or-member on read, so if we got data we can view.
  const currentMember = workspace?.members.find(
    (m: WorkspaceMember) => m.user.id === session?.user?.id,
  );
  const isMember = Boolean(currentMember);
  const isPublic = Boolean(workspace?.isPublic);

  // Accessible = public workspace OR an active member.
  // Backend enforces this too; this flag drives UI gating only.
  const isAccessible = isPublic || isMember;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSwitcherOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Routes visible to everyone who can view the workspace (members + public viewers).
  // Routes that mutate data or expose private info are member-only.
  const navigation = [
    {
      name: "Overview",
      href: `/dashboard/workspaces/${slug}`,
      icon: LayoutDashboard,
      match: (path: string) => path === `/dashboard/workspaces/${slug}`,
    },
    {
      name: "Announcements",
      href: `/dashboard/workspaces/${slug}/announcements`,
      icon: Megaphone,
      match: (path: string) => path.includes(`/${slug}/announcements`),
    },
    {
      name: "Tasks",
      icon: CheckSquare,
      match: (path: string) => path.includes(`/${slug}/tasks`),
      // Tasks are member-only — non-members can see the nav item but will hit a
      // backend 403 if they navigate there. Hide entirely for cleaner UX.
      memberOnly: true,
      children: [
        {
          name: "List",
          href: `/dashboard/workspaces/${slug}/tasks`,
          icon: List,
          match: (path: string) =>
            path === `/dashboard/workspaces/${slug}/tasks`,
        },
        {
          name: "Kanban",
          href: `/dashboard/workspaces/${slug}/tasks/kanban-view`,
          icon: Kanban,
          match: (path: string) => path.includes(`/${slug}/tasks/kanban-view`),
        },
        {
          name: "Calendar",
          href: `/dashboard/workspaces/${slug}/tasks/calendar-view`,
          icon: CalendarDays,
          match: (path: string) =>
            path.includes(`/${slug}/tasks/calendar-view`),
        },
      ],
    },
    {
      name: "Projects",
      href: `/dashboard/workspaces/${slug}/projects`,
      icon: FolderKanban,
      match: (path: string) => path.includes(`/${slug}/projects`),
      // Projects list is public-readable on public workspaces (overview endpoint includes it).
    },
    {
      name: "Meetings",
      href: `/dashboard/workspaces/${slug}/meetings`,
      icon: Calendar,
      match: (path: string) => path.includes(`/${slug}/meetings`),
      memberOnly: true,
    },
    {
      name: "Team",
      href: `/dashboard/workspaces/${slug}/team`,
      icon: Users,
      match: (path: string) => path.includes(`/${slug}/team`),
      // Member list is private per backend — assertMember guards it.
      memberOnly: true,
    },
    {
      name: "Labels",
      href: `/dashboard/workspaces/${slug}/label`,
      icon: Tags,
      match: (path: string) => path === `/dashboard/workspaces/${slug}/label`,
      memberOnly: true,
    },

    // Admin-only items — only shown when user has OWNER or ADMIN role.
    // canManageWorkspace is already false for non-members, so no extra guard needed.
    ...(canManageWorkspace
      ? [
          {
            name: "Files",
            href: `/dashboard/workspaces/${slug}/files`,
            icon: Files,
            match: (path: string) => path.includes(`/${slug}/files`),
          },
          {
            name: "Billing Page",
            href: `/dashboard/workspaces/${slug}/billing`,
            icon: CreditCard,
            match: (path: string) => path.includes(`/${slug}/billing`),
          },
          {
            name: "Analytics",
            href: `/dashboard/workspaces/${slug}/analytics`,
            icon: BarChart3,
            match: (path: string) => path.includes(`/${slug}/analytics`),
            locked: isFree,
          },
          {
            name: "Workspace Usage",
            href: `/dashboard/workspaces/${slug}/workspace-usage`,
            icon: UserLock,
            match: (path: string) => path.includes(`/${slug}/workspace-usage`),
            locked: isFree,
          },
          {
            name: "Storage",
            href: `/dashboard/workspaces/${slug}/storage`,
            icon: Store,
            match: (path: string) => path.includes(`/${slug}/storage`),
            locked: isFree,
          },
        ]
      : []),
  ];

  // Filter member-only nav items for public viewers who aren't members.
  const visibleNavigation = isMember
    ? navigation
    : navigation.filter((item) => !item.memberOnly);

  const handleWorkspaceSwitch = (workspaceSlug: string) => {
    router.push(`/dashboard/workspaces/${workspaceSlug}`);
    setSwitcherOpen(false);
  };

  const handleCreateWorkspace = () => {
    router.push("/dashboard/workspaces/new-workspace");
    setSwitcherOpen(false);
  };

  return {
    workspace,
    allWorkspaces,
    navigation: visibleNavigation,
    currentMember,
    isMember,
    isPublic,
    isAccessible,
    sidebarOpen,
    setSidebarOpen,
    switcherOpen,
    setSwitcherOpen,
    isLoading,
    session,
    slug,
    pathname,
    handleWorkspaceSwitch,
    handleCreateWorkspace,
  };
}

// useWorkspaceDetailPage
export function useWorkspaceDetailPage({ slug }: UseWorkspaceDetailPageProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showInviteModal, setShowInviteModal] = useState(false);

  const {
    data: overview,
    isPending,
    isError,
  } = useWorkspaceOverview(slug);

  const workspace = overview?.workspace;
  const members = (overview?.workspace?.members ?? []) as WorkspaceMember[];

  // ✅ Fetch stats independently — shorter staleTime, updates without waiting
  // for the overview cache to expire
  const { data: stats } = useWorkspaceStats(workspace?.id ?? "");

  const { isAdmin, isOwner, canCreateProjects } =
    useWorkspaceRoleFromWorkspace(slug);

  const currentMember = workspace?.members?.find(
    (m: WorkspaceMember) => m.user.id === session?.user?.id,
  );
  const isMember = Boolean(currentMember);
  const isPublic = Boolean(workspace?.isPublic);
  const isAccessible = isPublic || isMember;

  return {
    workspace,
    stats,  // now from useWorkspaceStats, not overview
    members,
    isLoading: isPending,
    isError: isError && !overview,
    activeTab,
    setActiveTab,
    showInviteModal,
    handleInviteClick: () => setShowInviteModal(true),
    handleInviteClose: () => setShowInviteModal(false),
    isAdmin,
    isOwner,
    canCreateProjects,
    isMember,
    isPublic,
    isAccessible,
  };
}