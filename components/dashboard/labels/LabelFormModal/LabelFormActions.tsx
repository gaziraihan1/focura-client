import { Button } from "@/components/ui/Button";
import { m as motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LabelFormActionsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LabelFormActions({
  isEditing,
  isSubmitting,
  onCancel,
  onSubmit,
}: LabelFormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
      <Button
        type="button"
        onClick={onCancel}
        variant="ghost"
        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSubmit}
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        <span>{isEditing ? "Save Changes" : "Create Label"}</span>
      </motion.button>
    </div>
  );
}