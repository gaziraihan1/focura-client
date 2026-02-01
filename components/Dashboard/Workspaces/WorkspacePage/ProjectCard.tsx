import { motion } from "framer-motion";
import Link from "next/link";
import { ProjectCardHeader } from "../ProjectCard/ProjectCardHeader";
import { ProjectCardDescription } from "../ProjectCard/ProjectCardDescription";
import { ProjectCardStats } from "../ProjectCard/ProjectCardStats";
import { ProjectCardFooter } from "../ProjectCard/ProjectCardFooter";


interface ProjectMember {
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string | null;
    color: string;
    icon?: string | null;
    status: string;
    priority: string;
    dueDate?: string | null;
    stats?: {
      totalTasks: number;
      completedTasks: number;
      overdueTasks: number;
      totalMembers: number;
    };
    members?: ProjectMember[];
  };
  workspaceSlug: string ;
  index: number;
}

export function ProjectCard({ project, workspaceSlug, index }: ProjectCardProps) {
  const stats = project.stats || {
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    totalMembers: project.members?.length || 0,
  };

  const completionRate = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  const members = project.members || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/dashboard/workspaces/${workspaceSlug}/projects/${project.id}`}>
        <div className="group p-4 sm:p-6 rounded-lg sm:rounded-xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer h-full">
          <ProjectCardHeader
            name={project.name}
            color={project.color}
            icon={project.icon}
            status={project.status}
            priority={project.priority}
          />

          <ProjectCardDescription description={project.description} />

          <ProjectCardStats
            completedTasks={stats.completedTasks}
            totalTasks={stats.totalTasks}
            overdueTasks={stats.overdueTasks}
            completionRate={completionRate}
          />

          <ProjectCardFooter
            members={members}
            totalMembers={stats.totalMembers}
            dueDate={project.dueDate}
          />
        </div>
      </Link>
    </motion.div>
  );
}