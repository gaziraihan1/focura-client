import { motion } from "framer-motion";
import { WorkspaceCard } from "./WorkspaceCard";
import { Workspace } from "@/hooks/useWorkspace";

interface WorkspaceGridProps {
  workspaces: Workspace[];
}

export function WorkspaceGrid({ workspaces }: WorkspaceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workspaces.map((workspace, index) => (
        <motion.div
          key={workspace.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <WorkspaceCard workspace={workspace} />
        </motion.div>
      ))}
    </div>
  );
}
