import { motion } from "framer-motion";
import { FolderKanban, Plus } from "lucide-react";

interface ProjectsPageHeaderProps {
  onNewProject: () => void;
}

export function ProjectsPageHeader({ onNewProject }: ProjectsPageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
    >
      <div className="flex items-start gap-5">
        <div className="p-4 rounded-2xl bg-linear-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
          <FolderKanban className="lg:w-8 lg:h-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl md:text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            My Projects
          </h1>
          <p className="text-muted-foreground mt-2 lg:text-lg">
            All projects you&apos;re a member of across workspaces
          </p>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNewProject}
        className="lg:px-6 lg:py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2 shadow-lg shadow-primary/20 font-medium px-4 py-2"
      >
        <Plus size={20} />
        New Project
      </motion.button>
    </motion.div>
  );
}