"use client";

import { useParams } from "next/navigation";
import { WorkspaceHeader } from "@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceHeader";
import { WorkspaceStats } from "@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceStats";
import { WorkspaceTabNavigation } from "@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceTabNavigation";
import { InviteMemberModal } from "@/components/Dashboard/Workspaces/WorkspacePage/InviteMemberModal";
import { LoadingState } from "@/components/Dashboard/Projects/NewProject/LoadingState";
import { useWorkspaceDetailPage } from "@/hooks/useWorkspaceLayout";
import { WorkspaceDetailErrorState } from "@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceDetailErrorState";
import { WorkspaceDetailContent } from "@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceDetailsContent";

export default function WorkspaceDetailPage() {
  const params = useParams();
  const slug = params.workspaceSlug as string;

  const {
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
  } = useWorkspaceDetailPage({ slug });

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !workspace) {
    return <WorkspaceDetailErrorState />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-6 xl:px-0 pb-6">
      <WorkspaceHeader
        workspaceName={workspace.name}
        workspaceSlug={workspace.slug}
        workspaceLogo={workspace.logo}
        workspaceColor={workspace.color}
        workspacePlan={workspace.plan}
        workspaceDescription={workspace.description}
        canCreateProjects={canCreateProjects}
        isAdmin={isAdmin}
        isOwner={isOwner}
      />

      {stats && (
        <WorkspaceStats stats={stats} maxMembers={workspace.maxMembers} />
      )}

      <WorkspaceTabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <WorkspaceDetailContent
        activeTab={activeTab}
        workspace={workspace}
        workspaceSlug={slug}
        members={members}
        isAdmin={isAdmin}
        isOwner={isOwner}
        canCreateProjects={canCreateProjects}
        onInviteClick={handleInviteClick}
      />

      <InviteMemberModal
        workspaceId={workspace.id}
        isOpen={showInviteModal}
        onClose={handleInviteClose}
      />
    </div>
  );
}