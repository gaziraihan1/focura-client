import { motion } from "framer-motion";
import { LabelManager } from "@/components/Labels/LabelManager";

interface LabelManagerModalProps {
  workspaceId: string;
  onClose: () => void;
}

export function LabelManagerModal({
  workspaceId,
  onClose,
}: LabelManagerModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto"
      >
        <LabelManager workspaceId={workspaceId} onClose={onClose} />
      </motion.div>
    </div>
  );
}