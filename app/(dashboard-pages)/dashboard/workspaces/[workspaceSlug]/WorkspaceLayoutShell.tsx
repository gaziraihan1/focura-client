"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useWorkspacePlan } from "@/context/workspacePlan/WorkspacePlanContext";
import EmptyState from "@/components/dashboard/workspace/layout/EmptyState";
import { useWorkspaceLayout } from "@/hooks/useWorkspaceLayout";
import { WorkspaceSidebar } from "@/components/dashboard/workspace/layout/WorkspaceSidebar";
import { WorkspaceLayoutHeader } from "@/components/dashboard/workspace/layout/WorkspaceLayoutHeader";
import { WorkspaceSwitcherModal } from "@/components/dashboard/workspace/layout/WorkspaceSwitcherModal";
import { Workspace } from "@/hooks/useWorkspace";
import { useSidebarCollapse } from "@/context/sidebarCollapse/SidebarCollapseContext";
import { WorkspaceLayoutSkeleton } from "@/components/dashboard/workspace/layout/WorkspaceLayoutSkeleton";

export function WorkspaceLayoutShell({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isFree } = useWorkspacePlan();
  const { isMainSidebarCollapsed, toggleMainSidebar } = useSidebarCollapse();

  const {
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
    handleWorkspaceSwitch,
    handleCreateWorkspace,
    isAccessible,
  } = useWorkspaceLayout({ slug, pathname, isFree });

  // Redirect only after loading is done and access is confirmed denied.
  useEffect(() => {
    if (!isLoading && !isAccessible) {
      // react-doctor-disable-next-line react-doctor/nextjs-no-client-side-redirect
      router.push("/dashboard");
    }
  }, [isLoading, isAccessible, router]);

  // Show skeleton while workspace data loads; render nothing during redirect.
  if (isLoading) return <WorkspaceLayoutSkeleton />;
  if (!isAccessible) return null;

  const workspaceReady = !!workspace;

  return (
    <div className="flex h-screen overflow-hidden bg-background scroll-smooth">
      <WorkspaceSidebar
        workspace={workspace as Workspace}
        currentMember={currentMember}
        navigation={navigation}
        pathname={pathname}
        isLoading={isLoading}
        slug={slug}
        sidebarOpen={sidebarOpen}
        collapsed={isMainSidebarCollapsed}
        onSidebarClose={() => setSidebarOpen(false)}
        onSwitcherOpen={() => setSwitcherOpen(true)}
      />

      <div className={`flex-1 flex flex-col min-h-0 min-w-0 overflow-x-clip ${isMainSidebarCollapsed ? "lg:ml-0" : "lg:ml-64"}`}>
        <WorkspaceLayoutHeader
          session={session}
          onSidebarOpen={() => setSidebarOpen(true)}
          onSwitcherOpen={() => setSwitcherOpen(true)}
          sidebarCollapsed={isMainSidebarCollapsed}
          onSidebarToggle={toggleMainSidebar}
        />
        <main className="flex-1 overflow-y-auto min-h-0 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      {workspaceReady && (
        <WorkspaceSwitcherModal
          isOpen={switcherOpen}
          allWorkspaces={allWorkspaces}
          currentSlug={slug}
          onClose={() => setSwitcherOpen(false)}
          onWorkspaceSwitch={handleWorkspaceSwitch}
          onCreateWorkspace={handleCreateWorkspace}
        />
      )}

      {/* Only show EmptyState if access is confirmed but workspace truly doesn't exist */}
      {workspaceReady === false && <EmptyState />}
    </div>
  );
}
