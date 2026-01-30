import { motion } from "framer-motion";
import { ProjectCard } from "@/components/Dashboard/AllProjects/ProjectCard";
import { ProjectData } from "@/types/project.types";

interface ProjectsGridViewProps {
  projects: ProjectData[];
  onProjectClick: (project: ProjectData) => void;
}

export function ProjectsGridView({
  projects,
  onProjectClick,
}: ProjectsGridViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
          onNavigate={() => onProjectClick(project)}
        />
      ))}
    </motion.div>
  );
}