// components/Dashboard/ProjectDetails/MembersTab.tsx
import React from 'react';
import { UserPlus, Users, Crown, Eye, X } from 'lucide-react';
import { useUpdateProjectMemberRole, useRemoveProjectMember } from '@/hooks/useProjects';
import { useWorkspaceMembers } from '@/hooks/useWorkspace';
import AddMemberModal from './AddMemberModal';
import Image from 'next/image';

type ProjectMemberRole =
  | "MANAGER"
  | "COLLABORATOR"
  | "VIEWER";

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

export default function MembersTab({ project, showAddMember, setShowAddMember }: MembersTabProps) {
  const updateRole = useUpdateProjectMemberRole();
  const removeMember = useRemoveProjectMember();
  
  // Fetch workspace members for adding to project
  const { data: workspaceMembers = [] } = useWorkspaceMembers(project.workspace?.id);

  const getRoleBadge = (role: string) => {
    const badges: Record<string, any> = {
      MANAGER: {
        label: 'Manager',
        icon: Crown,
        color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
      },
      COLLABORATOR: {
        label: 'Collaborator',
        icon: Users,
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      },
      VIEWER: {
        label: 'Viewer',
        icon: Eye,
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
      },
    };
    return badges[role] || badges.VIEWER;
  };

  const handleUpdateRole = (
  memberId: string,
  newRole: ProjectMemberRole
) => {
  updateRole.mutate({
    projectId: project.id,
    memberId,
    role: newRole,
  });
};


  const handleRemoveMember = (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      removeMember.mutate({
        projectId: project.id,
        memberId,
      });
    }
  };

  // Get existing member user IDs for filtering
  const existingMemberIds = project.members.map(m => m.userId);

  return (
    <div className="space-y-6">
      {project.isAdmin && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddMember(true)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2"
          >
            <UserPlus size={18} />
            Add Member
          </button>
        </div>
      )}

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Users size={20} />
            Team Members ({project.members.length})
          </h3>
        </div>

        <div className="divide-y divide-border">
          {project.members.map(member => {
            const roleBadge = getRoleBadge(member.role);
            const RoleIcon = roleBadge.icon;

            return (
              <div key={member.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {member.user.image ? (
                    <Image
                    width={40}
                    height={40}
                      src={member.user.image}
                      alt={member.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                      {member.user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-foreground">{member.user.name}</p>
                    <p className="text-sm text-muted-foreground">{member.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {project.isAdmin && member.role !== 'MANAGER' ? (
                    <select
                      value={member.role}
                      onChange={(e) => handleUpdateRole(member.id, e.target.value as ProjectMemberRole)}
                      disabled={updateRole.isPending}
                      className="px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-foreground focus:ring-2 ring-primary outline-none disabled:opacity-50"
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

                  {project.isAdmin && member.role !== 'MANAGER' && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={removeMember.isPending}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition disabled:opacity-50"
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