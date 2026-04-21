"use client";

import { useParams, usePathname } from "next/navigation";
import { WorkspacePlanProvider, useWorkspacePlan } from "@/context/workspacePlan/WorkspacePlanContext";
import EmptyState from "@/components/Dashboard/Workspaces/EmptyState";
import { useWorkspaceLayout } from "@/hooks/useWorkspaceLayout";
import { WorkspaceSidebar } from "@/components/Dashboard/Workspaces/WorkspaceSidebar";
import { WorkspaceLayoutHeader } from "@/components/Dashboard/Workspaces/WorkspaceLayoutHeader";
import { WorkspaceSwitcherModal } from "@/components/Dashboard/Workspaces/WorkspaceSwitcherModal";

// ── Inner layout — runs INSIDE the provider so useWorkspacePlan works ──────
function WorkspaceLayoutInner({
  slug,
  pathname,
  children,
}: {
  slug: string;
  pathname: string;
  children: React.ReactNode;
}) {
  const { isFree } = useWorkspacePlan(); // ✅ safe — provider is already mounted

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
  } = useWorkspaceLayout({ slug, pathname, isFree }); // ← pass it in

  if (!workspace) return <EmptyState />;

  return (
    <div className="flex h-screen overflow-hidden bg-background scroll-smooth">
      <WorkspaceSidebar
        workspace={workspace ?? null}
        currentMember={currentMember}
        navigation={navigation}
        pathname={pathname}
        isLoading={isLoading}
        slug={slug}
        sidebarOpen={sidebarOpen}
        onSidebarClose={() => setSidebarOpen(false)}
        onSwitcherOpen={() => setSwitcherOpen(true)}
      />

      <div className="flex-1 flex flex-col min-h-0 lg:ml-64 overflow-x-hidden min-w-0">
        <WorkspaceLayoutHeader
          session={session}
          onSidebarOpen={() => setSidebarOpen(true)}
          onSwitcherOpen={() => setSwitcherOpen(true)}
        />
        <main className="flex-1 overflow-y-auto min-h-0 px-4 py-6 sm:px-6 lg:px-8">
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

// ── Outer layout — mounts the provider first, then renders inner ───────────
export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const params   = useParams();
  const pathname = usePathname();
  const slug     = params.workspaceSlug as string;

  return (
    <WorkspacePlanProvider slug={slug}>         {/* ← provider is first */}
      <WorkspaceLayoutInner slug={slug} pathname={pathname}>
        {children}
      </WorkspaceLayoutInner>
    </WorkspacePlanProvider>
  );
}