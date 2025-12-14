// components/Dashboard/ProjectDetails/MembersTab.tsx
import React from "react";
import { UserPlus, Users, Crown, Eye, X } from "lucide-react";
import {
  useUpdateProjectMemberRole,
  useRemoveProjectMember,
} from "@/hooks/useProjects";
import { useWorkspaceMembers } from "@/hooks/useWorkspace";
import AddMemberModal from "./AddMemberModal";
import Image from "next/image";

type ProjectMemberRole = "MANAGER" | "COLLABORATOR" | "VIEWER";

interface Member {
  id: string;
  userId: string;
  role: ProjectMemberRole;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

interface MembersTabProps {
  project: {
    id: string;
    members: Member[];
    isAdmin: boolean;
    workspace?: {
      id: string;
    };
  };
  showAddMember: boolean;
  setShowAddMember: (show: boolean) => void;
}

export default function MembersTab({
  project,
  showAddMember,
  setShowAddMember,
}: MembersTabProps) {
  const updateRole = useUpdateProjectMemberRole();
  const removeMember = useRemoveProjectMember();

  const { data: workspaceMembers = [] } = useWorkspaceMembers(
    project.workspace?.id
  );

  const getRoleBadge = (role: ProjectMemberRole) => {
    const badges = {
      MANAGER: {
        label: "Manager",
        icon: Crown,
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
      },
      COLLABORATOR: {
        label: "Collaborator",
        icon: Users,
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      },
      VIEWER: {
        label: "Viewer",
        icon: Eye,
        color:
          "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      },
    };
    return badges[role];
  };

  const handleUpdateRole = (memberId: string, role: ProjectMemberRole) => {
    updateRole.mutate({ projectId: project.id, memberId, role });
  };

  const handleRemoveMember = (memberId: string) => {
    if (confirm("Are you sure you want to remove this member?")) {
      removeMember.mutate({ projectId: project.id, memberId });
    }
  };

  const existingMemberIds = project.members.map((m) => m.userId);

  return (
    <div className="space-y-6">
      {/* Add Member Button */}
      {project.isAdmin && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddMember(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            <UserPlus size={18} />
            Add Member
          </button>
        </div>
      )}

      {/* Members Card */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-border">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Users size={20} />
            Team Members ({project.members.length})
          </h3>
        </div>

        <div className="divide-y divide-border">
          {project.members.map((member) => {
            const roleBadge = getRoleBadge(member.role);
            const RoleIcon = roleBadge.icon;

            return (
              <div
                key={member.id}
                className="p-4 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Left: User Info */}
                <div className="flex items-center gap-3 min-w-0">
                  {member.user.image ? (
                    <Image
                      src={member.user.image}
                      alt={member.user.name}
                      width={40}
                      height={40}
                      className="rounded-full shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium shrink-0">
                      {member.user.name?.charAt(0) || "U"}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {member.user.name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {member.user.email}
                    </p>
                  </div>
                </div>

                {/* Right: Role + Actions */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {project.isAdmin && member.role !== "MANAGER" ? (
                    <select
                      value={member.role}
                      onChange={(e) =>
                        handleUpdateRole(
                          member.id,
                          e.target.value as ProjectMemberRole
                        )
                      }
                      disabled={updateRole.isPending}
                      className="px-3 py-1.5 rounded-lg bg-background border border-border text-sm focus:ring-2 ring-primary outline-none disabled:opacity-50"
                    >
                      <option value="MANAGER">Manager</option>
                      <option value="COLLABORATOR">Collaborator</option>
                      <option value="VIEWER">Viewer</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${roleBadge.color}`}
                    >
                      <RoleIcon size={12} />
                      {roleBadge.label}
                    </span>
                  )}

                  {project.isAdmin && member.role !== "MANAGER" && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={removeMember.isPending}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <AddMemberModal
          projectId={project.id}
          workspaceMembers={workspaceMembers}
          existingMemberIds={existingMemberIds}
          onClose={() => setShowAddMember(false)}
        />
      )}
    </div>
  );
                           }
