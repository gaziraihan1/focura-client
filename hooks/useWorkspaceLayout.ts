import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWorkspace, useWorkspaceRole, useWorkspaces, useWorkspaceStats, useWorkspaceMembers } from "@/hooks/useWorkspace";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Users,
  Calendar,
  BarChart3,
  Tags,
} from "lucide-react";

type TabType = "overview" | "projects" | "members";

interface UseWorkspaceDetailPageProps {
  slug: string;
}

interface UseWorkspaceLayoutProps {
  slug: string;
  pathname: string;
}

export function useWorkspaceLayout({ slug, pathname }: UseWorkspaceLayoutProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const { data: workspace, isLoading } = useWorkspace(slug);
  const { data: allWorkspaces = [] } = useWorkspaces();
  const { canManageWorkspace } = useWorkspaceRole(workspace?.id);

  // Keyboard shortcut for workspace switcher
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

  const label = {
    name: "Labels",
    href: `/dashboard/workspaces/${slug}/label`,
    icon: Tags,
    match: (path: string) => path === `/dashboard/workspaces/${slug}/label`,
  };

  const navigation = [
    {
      name: "Overview",
      href: `/dashboard/workspaces/${slug}`,
      icon: LayoutDashboard,
      match: (path: string) => path === `/dashboard/workspaces/${slug}`,
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
      name: "Team",
      href: `/dashboard/workspaces/${slug}/team`,
      icon: Users,
      match: (path: string) => path.includes(`/${slug}/team`),
    },
    {
      name: "Calendar",
      href: `/dashboard/workspaces/${slug}/calendar`,
      icon: Calendar,
      match: (path: string) => path.includes(`/${slug}/calender`),
    },
    {
      name: "Analytics",
      href: `/dashboard/workspaces/${slug}/analytics`,
      icon: BarChart3,
      match: (path: string) => path.includes(`/${slug}/analytics`),
    },
    ...(canManageWorkspace ? [label] : []),
  ];

  const currentMember = workspace?.members.find(
    (m) => m.user.id === session?.user?.id
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
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showInviteModal, setShowInviteModal] = useState(false);

  const { data: workspace, isLoading, isError } = useWorkspace(slug);
  const { data: stats } = useWorkspaceStats(workspace?.id || "");
  const { data: members = [] } = useWorkspaceMembers(workspace?.id || "");

  const { isAdmin, isOwner, canCreateProjects } = useWorkspaceRole(
    workspace?.id
  );

  const handleInviteClick = () => {
    setShowInviteModal(true);
  };

  const handleInviteClose = () => {
    setShowInviteModal(false);
  };

  return {
    workspace,
    stats,
    members,
    isLoading,
    isError,
    activeTab,
    setActiveTab,
    showInviteModal,
    handleInviteClick,
    handleInviteClose,
    isAdmin,
    isOwner,
    canCreateProjects,
  };
}