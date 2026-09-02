import { m as motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ProjectsErrorStateProps {
  onRetry: () => void;
}

export function ProjectsErrorState({ onRetry }: ProjectsErrorStateProps) {
  return (
    <div className="max-w-2xl mx-auto text-center py-20 px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Failed to load projects
        </h2>
        <p className="text-muted-foreground mb-8">
          Unable to fetch your projects. Please check your connection and try
          again.
        </p>
        <Button onClick={onRetry} className="px-6 py-3 rounded-xl hover:opacity-90">
          Retry
        </Button>
      </motion.div>
    </div>
  );
}