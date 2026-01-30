import { motion } from "framer-motion";
import { Loader2, Save } from "lucide-react";

interface ProjectFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export function ProjectFormActions({
  isSubmitting,
  onCancel,
}: ProjectFormActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex items-center justify-end gap-3 pb-6"
    >
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-accent transition disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Creating...
          </>
        ) : (
          <>
            <Save size={18} />
            Create Project
          </>
        )}
      </button>
    </motion.div>
  );
}