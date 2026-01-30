"use client";

import { useParams, usePathname } from "next/navigation";
import { LoadingState } from "@/components/Dashboard/Projects/NewProject/LoadingState";
import EmptyState from "@/components/Dashboard/Workspaces/EmptyState";
import { useWorkspaceLayout } from "@/hooks/useWorkspaceLayout";
import { WorkspaceSidebar } from "@/components/Dashboard/Workspaces/WorkspaceSidebar";
import { WorkspaceLayoutHeader } from "@/components/Dashboard/Workspaces/WorkspaceLayoutHeader";
import { WorkspaceSwitcherModal } from "@/components/Dashboard/Workspaces/WorkspaceSwitcherModal";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const slug = params.workspaceSlug as string;

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
  } = useWorkspaceLayout({ slug, pathname });

  if (isLoading) {
    return <LoadingState />;
  }

  if (!workspace) {
    return <EmptyState />;
  }

  return (
    <div className="flex bg-background">
      <WorkspaceSidebar
        workspace={workspace}
        currentMember={currentMember}
        navigation={navigation}
        pathname={pathname}
        slug={slug}
        sidebarOpen={sidebarOpen}
        onSidebarClose={() => setSidebarOpen(false)}
        onSwitcherOpen={() => setSwitcherOpen(true)}
      />

      <div className="flex-1 flex flex-col lg:ml-64">
        <WorkspaceLayoutHeader
          session={session}
          onSidebarOpen={() => setSidebarOpen(true)}
          onSwitcherOpen={() => setSwitcherOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      <WorkspaceSwitcherModal
        isOpen={switcherOpen}
        allWorkspaces={allWorkspaces}
        currentSlug={slug}
        onClose={() => setSwitcherOpen(false)}
        onWorkspaceSwitch={handleWorkspaceSwitch}
        onCreateWorkspace={handleCreateWorkspace}
      />
    </div>
  );
}