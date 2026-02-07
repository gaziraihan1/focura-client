import { motion } from "framer-motion";
import { ProjectListItem } from "@/components/Dashboard/AllProjects/ProjectListItem";
import { ProjectData } from "@/types/project.types";

interface ProjectsListViewProps {
  projects: ProjectData[];
  onProjectClick: (project: ProjectData) => void;
  showModal: boolean;
  onCloseModal: () => void;
}

export function ProjectsListView({
  projects,
  onProjectClick,
  showModal,
  onCloseModal
}: ProjectsListViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="space-y-3"
    >
      {projects.map((project, index) => (
        <ProjectListItem
          key={project.id}
          project={project}
          index={index}
          onNavigate={() => onProjectClick(project)}
          showModal={showModal}
          onCloseModal={onCloseModal}
        />
      ))}
    </motion.div>
  );
}