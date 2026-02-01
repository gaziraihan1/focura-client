import { WorkspaceOverviewTab } from "@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceOverviewTab";
import { WorkspaceProjectsTab } from "@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceProjectsTab";
import { WorkspaceMembersTab } from "@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceMembersTab";
import { Workspace } from "@/hooks/useWorkspace";

type TabType = "overview" | "projects" | "members";

interface Member {
  id: string;
    role: "OWNER" | "ADMIN" | "MEMBER" | "GUEST";
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// interface Workspace {
//   id: string;
//   workspaceSlug: string;
//   owner: {
//     id: string;
//     name: string;
//   };
//   createdAt: string;
//   isPublic: boolean;
//   maxStorage: number;
// }

interface WorkspaceDetailContentProps {
  activeTab: TabType;
  workspace: Workspace;
  workspaceSlug: string;
  members: Member[];
  isAdmin: boolean;
  isOwner: boolean;
  canCreateProjects: boolean;
  onInviteClick: () => void;
}

export function WorkspaceDetailContent({
  activeTab,
  workspace,
  members,
  isAdmin,
  isOwner,
  canCreateProjects,
  onInviteClick,
}: WorkspaceDetailContentProps) {
  console.log(workspace)
  return (
    <div className="min-h-96">
      {activeTab === "overview" && (
        <WorkspaceOverviewTab
          workspaceId={workspace.id}
          owner={workspace.owner}
          createdAt={workspace.createdAt}
          isPublic={workspace.isPublic}
          maxStorage={workspace.maxStorage}
        />
      )}

      {activeTab === "projects" && (
        <WorkspaceProjectsTab
          workspaceId={workspace.id}
          workspaceSlug={workspace.slug}
          canCreateProjects={canCreateProjects}
        />
      )}

      {activeTab === "members" && (
        <WorkspaceMembersTab
          workspaceId={workspace.id}
          members={members}
          isAdmin={isAdmin}
          isOwner={isOwner}
          onInviteClick={onInviteClick}
        />
      )}
    </div>
  );
}