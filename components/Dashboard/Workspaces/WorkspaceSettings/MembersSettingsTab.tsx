import { motion } from "framer-motion";
import { Users, UserPlus, Crown, X } from "lucide-react";
import { WorkspaceRole } from "@/hooks/useWorkspaceSettings";
import { Avatar } from "@/components/Shared/Avatar";

interface Member {
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string
  };
}

interface MembersSettingsTabProps {
  members: Member[];
  isAdmin: boolean;
  isRemovingMember: boolean;
  onInviteClick: () => void;
  onRemoveMember: (memberId: string) => void;
  onUpdateRole: (memberId: string, role: WorkspaceRole) => void;
}

export function MembersSettingsTab({
  members,
  isAdmin,
  isRemovingMember,
  onInviteClick,
  onRemoveMember,
  onUpdateRole,
}: MembersSettingsTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {isAdmin && (
        <div className="flex justify-end">
          <button
            onClick={onInviteClick}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2"
          >
            <UserPlus size={18} />
            Invite Member
          </button>
        </div>
      )}

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Users size={20} />
            Team Members ({members.length})
          </h3>
        </div>

        <div className="divide-y divide-border">
          {members.map((member) => (
            <div
              key={member.id}
              className="p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                <Avatar name={member.user.name} image={member.user.image} size="md" />
                </div>
                <div>
                  <p className="font-medium text-foreground flex items-center gap-2">
                    {member.user.name}
                    {member.role === "OWNER" && (
                      <Crown size={14} className="text-yellow-500" />
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.user.email}
                  </p>
                </div>
                
              </div>

              <div className="flex items-center gap-3">
                {member.role !== "OWNER" && isAdmin ? (
                  <select
                    value={member.role}
                    onChange={(e) =>
                      onUpdateRole(member.id, e.target.value as WorkspaceRole)
                    }
                    className="px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-foreground focus:ring-2 ring-primary outline-none"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MEMBER">Member</option>
                    <option value="GUEST">Guest</option>
                  </select>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                    {member.role}
                  </span>
                )}

                {member.role !== "OWNER" && isAdmin && (
                  <button
                    onClick={() => onRemoveMember(member.id)}
                    disabled={isRemovingMember}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}