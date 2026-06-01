"use client";

import React, { useState } from "react";
import { useParams, usePathname } from "next/navigation";

import { useProjectDetailsBySlug } from "@/hooks/useProjects";
import { ProjectData } from "@/types/project.types";
import {
  MobileDrawer,
  MobileTopBar,
  SidebarContent,
  SidebarContentProps,
  useProjectNav,
} from "@/components/Dashboard/Workspaces/project/Layout";
import { Archive } from "lucide-react";

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

  const nav = useProjectNav(workspaceSlug, projectSlug);
  const { data: project } = useProjectDetailsBySlug(projectSlug);

  const projectColor = (project as ProjectData)?.color ?? "#667eea";
  const currentNavItem = nav.find((item) => item.match(pathname));

  const contentProps: SidebarContentProps = {
    nav,
    pathname,
    projectName: project?.name,
    projectColor,
    workspaceSlug,
  };

  return (
    // Break out of workspace <main> padding to go edge-to-edge
    <div className="flex -mx-4 -my-6 sm:-mx-6 lg:-mx-8 min-h-[calc(100vh-57px)]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-52 xl:w-56 shrink-0 bg-card border-r border-border">
        <SidebarContent {...contentProps} />
      </aside>

      {/* Mobile drawer */}
      <MobileDrawer
        {...contentProps}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden bg-background">
        {/* Mobile top bar */}
        <MobileTopBar
          projectName={project?.name}
          currentLabel={currentNavItem?.label}
          projectColor={projectColor}
          onOpen={() => setDrawerOpen(true)}
        />
        {project?.status === 'ARCHIVED' && (
  <div className="flex items-center gap-2 px-4 py-2.5 mb-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm font-medium max-w-3xl mx-auto mt-4">
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
