"use client";

import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { WorkspaceHeader } from "@/components/dashboard/workspace/detail/WorkspaceHeader";
import { WorkspaceStats } from "@/components/dashboard/workspace/detail/WorkspaceStats";
import { WorkspaceTabNavigation } from "@/components/dashboard/workspace/detail/WorkspaceTabNavigation";
import { InviteMemberModal } from "@/components/dashboard/workspace/detail/InviteMemberModal";
import { LoadingState } from "@/components/shared/LoadingState";
import { WorkspaceDetailErrorState } from "@/components/dashboard/workspace/detail/WorkspaceDetailErrorState";
import { WorkspaceDetailContent } from "@/components/dashboard/workspace/detail/WorkspaceDetailsContent";
import { useWorkspaceDetailPage } from "@/hooks/useWorkspaceLayout";

type TabType = "overview" | "projects" | "members";

interface WorkspaceDetailPageContentProps {
  slug: string;
}

export function WorkspaceDetailPageContent({ slug }: WorkspaceDetailPageContentProps) {
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

  const router = useRouter();
  const pathname = usePathname();
  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab as TabType);
      const params = new URLSearchParams(window.location.search);
      if (tab === "overview") {
        params.delete("tab");
      } else {
        params.set("tab", tab);
      }
      const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [setActiveTab, pathname, router],
  );

  if (isLoading) return <LoadingState />;
  if (isError) return <WorkspaceDetailErrorState />;
  if (!workspace) return <LoadingState />;

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
        onTabChange={handleTabChange}
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
