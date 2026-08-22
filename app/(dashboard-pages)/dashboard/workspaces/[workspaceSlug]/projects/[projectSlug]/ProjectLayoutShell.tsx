"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

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

export function ProjectLayoutShell({
  workspaceSlug,
  projectSlug,
  children,
}: {
  workspaceSlug: string;
  projectSlug: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const { isProjectSidebarCollapsed, toggleProjectSidebar } = useSidebarCollapse();

  const nav = useProjectNav(workspaceSlug, projectSlug);
  const { data: project, error, isLoading, isFetching, refetch } = useProjectDetailsBySlug(projectSlug);

  const projectColor = (project as ProjectData)?.color ?? "#667eea";
  const currentNavItem = nav.find((item) => item.match(pathname));
  const accessStatus = (error as { response?: { status?: number } } | undefined)?.response?.status;
  const { userId } = useUserProfile();

  // Project-membership gate
  const isMember = project?.members && userId
    ? project.members.some((m) => m.userId === userId || m.user?.id === userId)
    : false;
  const deniedByApi = accessStatus === 403 || accessStatus === 404;
  const deniedByMembership = !!project && !isMember && !project.isAdmin;
  const accessDenied = deniedByApi || deniedByMembership;

  // Manager-only nav
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
  const deniedApiRef = useRef(false);

  useEffect(() => {
    if (deniedByApi) {
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

  // Self-heal: the backend granted access but the local member list is stale
  const healedRef = useRef(false);

  useEffect(() => {
    if (deniedByMembership && !deniedByApi && !healedRef.current) {
      healedRef.current = true;
      refetch();
    } else if (!deniedByMembership) {
      healedRef.current = false;
    }
  }, [deniedByMembership, deniedByApi, refetch]);

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
    <div className="flex -mx-4 -my-6 sm:-mx-6 lg:-mx-8 min-h-[calc(100vh-57px)]">
      {/* Desktop sidebar */}
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

        {/* Desktop sidebar toggle */}
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

        {/* Page content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
