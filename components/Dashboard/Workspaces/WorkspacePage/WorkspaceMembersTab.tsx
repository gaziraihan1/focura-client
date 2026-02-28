import { motion } from "framer-motion";
import { Users, UserPlus, X, Crown, LucideIcon } from "lucide-react";
import Image from "next/image";
import {
  useRemoveMember,
  useUpdateMemberRole,
} from "@/hooks/useWorkspace";

interface Member {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "GUEST";
  user: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  };
}

interface WorkspaceMembersTabProps {
  workspaceId: string;
  members: Member[];
  isAdmin: boolean;
  isOwner: boolean;
  onInviteClick: () => void;
}

interface RoleBadge {
  icon: LucideIcon;
  color: string;
  label: string;
}

const getRoleBadge = (role: string): RoleBadge => {
  const badges: Record<string, RoleBadge> = {
    OWNER: { 
      icon: Crown, 
      color: "bg-yellow-500/10 text-yellow-500", 
      label: "Owner" 
    },
    ADMIN: { 
      icon: Crown, 
      color: "bg-purple-500/10 text-purple-500", 
      label: "Admin" 
    },
    MEMBER: { 
      icon: Users, 
      color: "bg-blue-500/10 text-blue-500", 
      label: "Member" 
    },
    GUEST: { 
      icon: Users, 
      color: "bg-gray-500/10 text-gray-500", 
      label: "Guest" 
    },
  };
  return badges[role] || badges.MEMBER;
};

export function WorkspaceMembersTab({
  workspaceId,
  members,
  isAdmin,
  isOwner,
  onInviteClick,
}: WorkspaceMembersTabProps) {
  const removeMember = useRemoveMember();
  const updateMemberRole = useUpdateMemberRole();

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Remove this member?")) return;

    try {
      await removeMember.mutateAsync({
        workspaceId,
        memberId,
      });
    } catch (error) {
      console.error("Remove member error:", error);
    }
  };

  const handleUpdateRole = async (
    memberId: string,
    role: "ADMIN" | "MEMBER" | "GUEST"
  ) => {
    try {
      await updateMemberRole.mutateAsync({
        workspaceId,
        memberId,
        role,
      });
    } catch (error) {
      console.error("Update role error:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      {(isAdmin || isOwner) && (
        <div className="flex justify-end">
          <button
            onClick={onInviteClick}
            className="px-3 sm:px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2 text-sm sm:text-base"
          >
            <UserPlus size={16} className="sm:w-4.5 sm:h-4.5" />
            <span className="hidden xs:inline">Invite Member</span>
            <span className="xs:hidden">Invite</span>
          </button>
        </div>
      )}

      <div className="rounded-lg sm:rounded-xl bg-card border border-border overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-border">
          <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
            <Users size={18} className="sm:w-5 sm:h-5" />
            Team Members ({members.length})
          </h3>
        </div>

        <div className="divide-y divide-border">
          {members.map((member) => {
            const roleBadge = getRoleBadge(member.role);
            const RoleIcon = roleBadge.icon;

            return (
              <div key={member.id} className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    {member.user.image ? (
                      <Image
                        width={40}
                        height={40}
                        src={member.user.image}
                        alt={member.user.name || "User"}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs sm:text-sm font-medium shrink-0">
                        {member.user.name?.charAt(0) || "U"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-medium text-foreground flex items-center gap-2 truncate">
                        <span className="truncate">
                          {member.user.name || "Anonymous"}
                        </span>
                        {member.role === "OWNER" && (
                          <Crown
                            size={12}
                            className="text-yellow-500 shrink-0 sm:w-3.5 sm:h-3.5"
                          />
                        )}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {member.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {member.role !== "OWNER" && isAdmin ? (
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleUpdateRole(
                            member.id,
                            e.target.value as "ADMIN" | "MEMBER" | "GUEST"
                          )
                        }
                        disabled={updateMemberRole.isPending}
                        className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-background border border-border text-xs sm:text-sm text-foreground focus:ring-2 ring-primary outline-none disabled:opacity-50"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="MEMBER">Member</option>
                        <option value="GUEST">Guest</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1 ${roleBadge.color}`}
                      >
                        <RoleIcon size={12} />
                        <span className="hidden xs:inline">{roleBadge.label}</span>
                      </span>
                    )}

                    {member.role !== "OWNER" && isAdmin && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={removeMember.isPending}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition disabled:opacity-50"
                        aria-label="Remove member"
                      >
                        <X size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}