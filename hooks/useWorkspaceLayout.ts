import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  useWorkspace,
  useWorkspaces,
  useWorkspaceRoleFromWorkspace,
  useWorkspaceOverview,
  WorkspaceMember,
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
} from "lucide-react";

type TabType = "overview" | "projects" | "members";

interface UseWorkspaceDetailPageProps {
  slug: string;
}
interface UseWorkspaceLayoutProps {
  slug: string;
  pathname: string;
  isFree: boolean
}

export function useWorkspaceLayout({
  slug,
  pathname,
  isFree
}: UseWorkspaceLayoutProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const { data: workspace, isLoading } = useWorkspace(slug);
  const { data: allWorkspaces = [] } = useWorkspaces();
  const { canManageWorkspace } = useWorkspaceRoleFromWorkspace(slug);

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
      href: `/dashboard/workspaces/${slug}/tasks`,
      icon: CheckSquare,
      match: (path: string) => path.includes(`/${slug}/tasks`),
    },
    {
      name: "Projects",
      href: `/dashboard/workspaces/${slug}/projects`,
      icon: FolderKanban,
      match: (path: string) => path.includes(`/${slug}/projects`),
    },
    {
      name: "Meetings",
      href: `/dashboard/workspaces/${slug}/meetings`,
      icon: Calendar,
      match: (path: string) => path.includes(`/${slug}/meetings`),
    },
    {
      name: "Team",
      href: `/dashboard/workspaces/${slug}/team`,
      icon: Users,
      match: (path: string) => path.includes(`/${slug}/team`),
    },

    // ── Admin-only items ───────────────────────────────────────────────────
    ...(canManageWorkspace
      ? [
          {
            name: "Labels",
            href: `/dashboard/workspaces/${slug}/label`,
            icon: Tags,
            match: (path: string) =>
              path === `/dashboard/workspaces/${slug}/label`,
          },
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

          // ── Paid-only items — visible but locked on FREE plan ────────────────
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

  const currentMember = workspace?.members.find(
    (m) => m.user.id === session?.user?.id,
  );

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
    navigation,
    currentMember,
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

export function useWorkspaceDetailPage({ slug }: UseWorkspaceDetailPageProps) {
  const [activeTab, setActiveTab]       = useState<TabType>("overview");
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Single fetch — seeds workspace/stats/members/projects caches automatically
  const { data: overview, isLoading, isError } = useWorkspaceOverview(slug);

  // These read from the cache seeded above — zero extra network calls
  const workspace = overview?.workspace;
  const stats     = overview?.stats;
  const members   = (overview?.workspace.members ?? []) as WorkspaceMember[];

  // Uses workspace.members from cache — no separate /members fetch
  const { isAdmin, isOwner, canCreateProjects } =
    useWorkspaceRoleFromWorkspace(slug);

  return {
    workspace,
    stats,
    members,
    isLoading,
    // Only surface error when we truly have nothing to show
    isError: isError && !workspace,
    activeTab,
    setActiveTab,
    showInviteModal,
    handleInviteClick: () => setShowInviteModal(true),
    handleInviteClose: () => setShowInviteModal(false),
    isAdmin,
    isOwner,
    canCreateProjects,
  };
}