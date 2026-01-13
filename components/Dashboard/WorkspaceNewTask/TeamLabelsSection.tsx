import { motion } from "framer-motion";
import { Users, Tag, Plus, AlertCircle, Loader2 } from "lucide-react";
import { LabelPicker } from "@/components/Labels/LabelPicker";

interface Member {
  user: {
    id: string;
    name: string | null;
  };
}

interface TeamLabelsSectionProps {
  members: Member[];
  membersLoading: boolean;
  assigneeIds: string[];
  labelIds: string[];
  workspaceId: string;
  projectId?: string | null;
  canAssignToOthers: boolean;
  currentUserId?: string;
  onToggleAssignee: (userId: string) => void;
  onLabelChange: (labelIds: string[]) => void;
  onOpenLabelManager: () => void;
}

export function TeamLabelsSection({
  members,
  membersLoading,
  assigneeIds,
  labelIds,
  workspaceId,
  projectId,
  canAssignToOthers,
  currentUserId,
  onToggleAssignee,
  onLabelChange,
  onOpenLabelManager,
}: TeamLabelsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl bg-card border border-border p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Team & Labels
        </h3>
      </div>

      {/* Assignees */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          <Users size={16} className="inline mr-2" />
          Assignees
          {!canAssignToOthers && (
            <span className="ml-2 text-xs text-muted-foreground">
              (You can only assign to yourself)
            </span>
          )}
        </label>
        {membersLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="animate-spin" size={16} />
            Loading team members...
          </div>
        ) : members.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {members.map((member) => {
              const isCurrentUser = member.user.id === currentUserId;
              const canSelect = canAssignToOthers || isCurrentUser;

              return (
                <button
                  key={member.user.id}
                  type="button"
                  onClick={() => onToggleAssignee(member.user.id)}
                  disabled={!canSelect}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
                    assigneeIds.includes(member.user.id)
                      ? "bg-primary/10 border-primary text-primary"
                      : canSelect
                      ? "border-border text-foreground hover:bg-accent"
                      : "border-border text-muted-foreground opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                    {member.user.name?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm">
                    {member.user.name}
                    {isCurrentUser && " (You)"}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No team members available
          </p>
        )}

        {!canAssignToOthers && projectId && (
          <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-600 dark:text-amber-400">
              <AlertCircle size={14} className="inline mr-1" />
              You need to be a project manager or workspace admin to assign
              tasks to others.
            </p>
          </div>
        )}
      </div>

      {/* Labels */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-foreground">
            <Tag size={16} className="inline mr-2" />
            Labels
          </label>
          <button
            type="button"
            onClick={onOpenLabelManager}
            className="text-xs text-primary hover:text-primary/80 transition flex items-center gap-1"
          >
            <Plus size={14} />
            Manage Labels
          </button>
        </div>

        <LabelPicker
          workspaceId={workspaceId}
          selectedLabelIds={labelIds}
          onChange={onLabelChange}
          maxLabels={10}
        />
      </div>
    </motion.div>
  );
}