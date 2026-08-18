"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";

import { useProjectDetailsBySlug } from "@/hooks/useProjects";
import { useUserProfile } from "@/hooks/useUser";
import { AccessDeniedProject } from "@/components/Dashboard/ProjectDetails/AccessDeniedProject";
import LoadingState from "@/components/Dashboard/ProjectDetails/LoadingState";
import { qc } from "@/lib/react-query/query-client";
import { ProjectData } from "@/types/project.types";
import {
  MobileDrawer,
  MobileTopBar,
  SidebarContent,
  SidebarContentProps,
  useProjectNav,
} from "@/components/Dashboard/Workspaces/project/Layout";
import { Archive } from "lucide-react";
import { SidebarToggle } from "@/components/Dashboard/SidebarToggle";
import { useSidebarCollapse } from "@/context/sidebarCollapse/SidebarCollapseContext";

// Pages whose content is manager/admin-only — hidden from collaborators and
// viewers in the project sidebar (each page also enforces the gate itself).
// Time Reports is deliberately NOT in this list: it's open to every project
// member.
const MANAGER_ONLY_NAV = new Set([
  "Settings",
  "Analytics",
  "Milestones",
  "Sprints",
  "Sections",
  "Views",
]);

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();

  const workspaceSlug = params?.workspaceSlug as string;
  const projectSlug = params?.projectSlug as string;

  const [drawerOpen, setDrawerOpen] = useState(false);

  const { isProjectSidebarCollapsed, toggleProjectSidebar } = useSidebarCollapse();

  const nav = useProjectNav(workspaceSlug, projectSlug);
  const { data: project, error, isLoading, isFetching, refetch } = useProjectDetailsBySlug(projectSlug);

  const projectColor = (project as ProjectData)?.color ?? "#667eea";
  const currentNavItem = nav.find((item) => item.match(pathname));
  const accessStatus = (error as { response?: { status?: number } } | undefined)?.response?.status;
  const { userId } = useUserProfile();

  // Project-membership gate (mirrors the tasks page): a workspace member who
  // is not a member of THIS project sees the access-restricted screen on every
  // project page, not just the tasks page.
  const isMember = project?.members && userId
    ? project.members.some((m) => m.userId === userId || m.user?.id === userId)
    : false;
  const deniedByApi = accessStatus === 403 || accessStatus === 404;
  const deniedByMembership = !!project && !isMember && !project.isAdmin;
  const accessDenied = deniedByApi || deniedByMembership;

  // Manager-only nav: workspace owner/admin (project.isAdmin is per-user on the
  // slug endpoint) or a project MANAGER member.
  const canManage = useMemo(() => {
    if (!project || !userId) return false;
    if (project.isAdmin) return true;
    return !!project.members?.some(
      (m) =>
        (m.userId === userId || m.user?.id === userId) && m.role === "MANAGER",
    );
  }, [project, userId]);

  const visibleNav = useMemo(
    () => (canManage ? nav : nav.filter((item) => !MANAGER_ONLY_NAV.has(item.label))),
    [nav, canManage],
  );

  // Drop cached project/feature data only when the API itself refused access
  // (403/404). The membership gate alone can be reading a stale member list,
  // so it must NOT wipe the cache mid-self-heal.
  const deniedApiRef = useRef(false);

  useEffect(() => {
    if (deniedByApi) {
      // A 403/404 from the gated project endpoints means this user no longer
      // has access. Drop the cached project + feature data so a removed
      // member's stale pages can't keep rendering from cache.
      if (!deniedApiRef.current) {
        deniedApiRef.current = true;
        qc.removeQueries({ queryKey: ["projects", "detail"] });
        qc.removeQueries({ queryKey: ["sections"] });
        qc.removeQueries({ queryKey: ["sprints"] });
        qc.removeQueries({ queryKey: ["milestones"] });
        qc.removeQueries({ queryKey: ["project-views"] });
      }
    } else {
      deniedApiRef.current = false;
    }
  }, [deniedByApi]);

  // Self-heal: the backend granted access (no 403/404) but the local member
  // list is stale — e.g. a collaborator added after this browser cached the
  // project detail. Refetch once before showing the denied screen so a fresh
  // membership list wins instead of a stale cache.
  const healedRef = useRef(false);

  useEffect(() => {
    if (deniedByMembership && !deniedByApi && !healedRef.current) {
      healedRef.current = true;
      refetch();
    } else if (!deniedByMembership) {
      healedRef.current = false;
    }
  }, [deniedByMembership, deniedByApi, refetch]);

  // Show loading while the self-heal refetch is in flight so the denied screen
  // doesn't flash for a user whose membership was just added.
  const selfHealing = deniedByMembership && !deniedByApi && isFetching;

  if (isLoading || selfHealing) {
    return <LoadingState />;
  }

  if (accessDenied) {
    return <AccessDeniedProject projectName={project?.name} />;
  }

  const contentProps: SidebarContentProps = {
    nav: visibleNav,
    pathname,
    projectName: project?.name,
    projectColor,
    workspaceSlug,
  };

  return (
    // Break out of workspace <main> padding to go edge-to-edge
    <div className="flex -mx-4 -my-6 sm:-mx-6 lg:-mx-8 min-h-[calc(100vh-57px)]">
      {/* Desktop sidebar — sticky so it stays pinned while the project content
          scrolls (the scroll container is the workspace layout's <main>) */}
      <aside
        className={[
          "flex-col shrink-0 self-start sticky -top-6 h-[calc(100vh-57px)] bg-card overflow-hidden transition-all duration-200 ease-in-out",
          isProjectSidebarCollapsed
            ? "hidden w-52 xl:flex xl:w-0 xl:border-r-0"
            : "hidden w-52 xl:flex xl:w-56 border-r border-border",
        ].join(" ")}
      >
        <SidebarContent {...contentProps} />
      </aside>

      {/* Mobile drawer */}
      <MobileDrawer
        {...contentProps}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-clip bg-background">
        {/* Mobile top bar */}
        <MobileTopBar
          projectName={project?.name}
          currentLabel={currentNavItem?.label}
          projectColor={projectColor}
          onOpen={() => setDrawerOpen(true)}
        />

        {/* Desktop sidebar toggle — floats over the content on xl+ so the project
            sidebar can be hidden/restored while the content takes the full width */}
        <div className="hidden xl:flex h-0 sticky top-0 z-30 items-start">
          <SidebarToggle
            collapsed={isProjectSidebarCollapsed}
            onToggle={toggleProjectSidebar}
            className="mt-2 ml-2 bg-background/90 backdrop-blur-sm border border-border shadow-sm"
          />
        </div>
        {project?.status === 'ARCHIVED' && (
  <div className="flex items-center gap-2 px-4 py-2.5 mb-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm font-medium max-w-3xl mx-4 sm:mx-auto mt-4">
    <Archive size={14} className="shrink-0" />
    This project is archived and is read-only. Unarchive it in Settings to resume work.
  </div>
)}

        {/* Page content — restore workspace padding */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
