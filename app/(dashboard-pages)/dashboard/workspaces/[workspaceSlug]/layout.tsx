"use client";

import { useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { WorkspacePlanProvider, useWorkspacePlan } from "@/context/workspacePlan/WorkspacePlanContext";
import EmptyState from "@/components/Dashboard/Workspaces/EmptyState";
import { useWorkspaceLayout } from "@/hooks/useWorkspaceLayout";
import { WorkspaceSidebar } from "@/components/Dashboard/Workspaces/WorkspaceSidebar";
import { WorkspaceLayoutHeader } from "@/components/Dashboard/Workspaces/WorkspaceLayoutHeader";
import { WorkspaceSwitcherModal } from "@/components/Dashboard/Workspaces/WorkspaceSwitcherModal";
import { Workspace } from "@/hooks/useWorkspace";
import { useSidebarCollapse } from "@/context/sidebarCollapse/SidebarCollapseContext";

function WorkspaceLayoutInner({
  slug,
  pathname,
  children,
}: {
  slug: string;
  pathname: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
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
  // During loading, isAccessible is false (workspace is undefined) — don't redirect yet.
  // Workspace access comes from the async useWorkspaceLayout query — no
  // event-handler equivalent exists; matches the rule's documented FP case.
  useEffect(() => {
    if (!isLoading && !isAccessible) {
      // react-doctor-disable-next-line react-doctor/nextjs-no-client-side-redirect
      router.push("/dashboard");
    }
  }, [isLoading, isAccessible, router]);

  // While loading or during the redirect window, render nothing to avoid flicker.
  if (isLoading || !isAccessible) return null;

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

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const params   = useParams();
  const pathname = usePathname();
  const slug     = params.workspaceSlug as string;

  return (
    <WorkspacePlanProvider slug={slug}>
      <WorkspaceLayoutInner slug={slug} pathname={pathname}>
        {children}
      </WorkspaceLayoutInner>
    </WorkspacePlanProvider>
  );
}