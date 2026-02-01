import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface DangerZoneTabProps {
  isOwner: boolean;
  isLeavingWorkspace: boolean;
  onLeaveWorkspace: () => void;
  onDeleteWorkspace: () => void;
}

export function DangerZoneTab({
  isOwner,
  isLeavingWorkspace,
  onLeaveWorkspace,
  onDeleteWorkspace,
}: DangerZoneTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="text-red-500 shrink-0" size={20} />
          <div>
            <h3 className="text-lg font-semibold text-red-500 mb-1">
              Danger Zone
            </h3>
            <p className="text-sm text-red-500/80">
              These actions are irreversible. Please be careful.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {!isOwner && (
            <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
              <div>
                <p className="font-medium text-foreground">Leave Workspace</p>
                <p className="text-sm text-muted-foreground">
                  Remove yourself from this workspace
                </p>
              </div>
              <button
                onClick={onLeaveWorkspace}
                disabled={isLeavingWorkspace}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:opacity-90 transition disabled:opacity-50"
              >
                Leave
              </button>
            </div>
          )}

          {isOwner && (
            <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
              <div>
                <p className="font-medium text-foreground">Delete Workspace</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete this workspace and all its data
                </p>
              </div>
              <button
                onClick={onDeleteWorkspace}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:opacity-90 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}