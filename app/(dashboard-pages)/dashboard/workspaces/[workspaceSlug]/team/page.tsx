"use client";

import React, { useState, useCallback } from "react";
import { useSession } from "next-auth/react";

import { useTeamPage } from "@/hooks/useTeamPage";
import { StatsCards } from "@/components/Dashboard/Workspaces/TeamPage/StatsCard";
import { MembersTab } from "@/components/Dashboard/Workspaces/TeamPage/MembersTab";
import { ProjectsTab } from "@/components/Dashboard/Workspaces/TeamPage/ProjectsTab";
import {
  WorkspaceRoleOption,
  ProjectRoleOption,
} from "@/components/Dashboard/Workspaces/TeamPage/RoleDropdown";
import TeamPageLoading from "@/components/Dashboard/Workspaces/TeamPage/TeamPageLoading";
import Tabs from "@/components/Dashboard/Workspaces/TeamPage/Tabs";

type TabId = "members" | "projects";

const TABS: { id: TabId; label: string }[] = [
  { id: "members", label: "All Members" },
  { id: "projects", label: "Projects" },
];

export default function MainTeamPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id ?? null;

  const {
    isLoading,
    canManageWorkspace,
    canManageProjects,
    workspaceId,
    workspaceName,
    stats,
    members,
    updateWorkspaceMemberRole,
    projects,
    updateProjectMemberRole,
  } = useTeamPage();

  const [activeTab, setActiveTab] = useState<TabId>("members");

  const handleWorkspaceRoleChange = useCallback(
    (memberId: string, role: WorkspaceRoleOption) => {
      updateWorkspaceMemberRole.mutate({
        workspaceId,
        memberId,
        role,
      });
    },
    [updateWorkspaceMemberRole, workspaceId],
  );

  const handleProjectMemberRoleChange = useCallback(
    (projectId: string, memberId: string, role: ProjectRoleOption) => {
      updateProjectMemberRole.mutate({
        projectId,
        memberId,
        role,
      });
    },
    [updateProjectMemberRole],
  );

  if (isLoading) {
    return <TeamPageLoading />;
  }

  return (
    <div className="min-h-[400px] flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">
          {workspaceName ? `${workspaceName} — Team` : "Team"}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage members and projects across your workspace.
        </p>
      </div>

      <StatsCards stats={stats} />

      <Tabs
        tabs={TABS}
        onActiveTab={setActiveTab}
        activeTab={activeTab}
        members={members}
        projects={projects}
      />

      {activeTab === "members" && (
        <MembersTab
          members={members}
          currentUserId={currentUserId}
          canManage={canManageWorkspace}
          onRoleChange={handleWorkspaceRoleChange}
        />
      )}

      {activeTab === "projects" && (
        <ProjectsTab
          projects={projects}
          currentUserId={currentUserId}
          canManage={canManageProjects}
          onProjectMemberRoleChange={handleProjectMemberRoleChange}
        />
      )}
    </div>
  );
}
