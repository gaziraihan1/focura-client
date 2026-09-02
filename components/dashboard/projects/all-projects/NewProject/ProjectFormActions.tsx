import { m as motion } from "framer-motion";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={onCancel}
        disabled={isSubmitting}
        className="rounded-lg"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="rounded-lg flex items-center gap-2 hover:opacity-90"
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
      </Button>
    </motion.div>
  );
}