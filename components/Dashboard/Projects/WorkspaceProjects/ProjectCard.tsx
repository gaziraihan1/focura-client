// ProjectCard.tsx
import Link from "next/link";
import { Calendar, Flag } from "lucide-react";
import ProjectMembers from "./ProjectMembers";
import ProjectStatsCount from "./ProjectStatsCount";
import ProjectDetails from "./ProjectDetails";
import { ProjectDetails as Details } from "@/hooks/useProjects";

export const statusColors: Record<string, string> = {
  PLANNING: "bg-purple-500/10 text-purple-500",
  ACTIVE: "bg-green-500/10 text-green-500",
  ON_HOLD: "bg-orange-500/10 text-orange-500",
  COMPLETED: "bg-blue-500/10 text-blue-500",
  ARCHIVED: "bg-gray-500/10 text-gray-500",
};

const priorityColors: Record<string, string> = {
  URGENT: "text-red-500",
  HIGH: "text-orange-500",
  MEDIUM: "text-blue-500",
  LOW: "text-green-500",
};

const formatDate = (date?: string | null) => {
  if (!date) return "No due date";
  return new Date(date).toLocaleDateString();
};

interface ProjectCardProps {
  project: Details;
  workspaceSlug: string;
  haveAccess: boolean;
  joined?: boolean;
  currentUserId?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function ProjectCard({
  project,
  workspaceSlug,
  haveAccess,
  joined,
  onClick,
}: ProjectCardProps) {
  const memberCount =
    project?._count?.members || project?.members?.length || 0;
  const taskCount = project?._count?.tasks || 0;

  const CardContent = (
    <div className="p-5 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition cursor-pointer h-full flex flex-col gap-4">
      <ProjectDetails project={project} joined={joined} />
      
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        {project?.priority && (
          <span className="flex items-center gap-1">
            <Flag
              size={14}
              className={priorityColors[project.priority] || ""}
            />
            {project.priority}
          </span>
        )}
        {project?.dueDate && (
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            Due {formatDate(project.dueDate)}
          </span>
        )}
      </div>

      <ProjectStatsCount taskCount={taskCount} memberCount={memberCount} />

      {project?.members && project.members.length > 0 && (
        <ProjectMembers members={project.members} />
      )}
    </div>
  );

  if (haveAccess) {
    return (
      <Link href={`/dashboard/workspaces/${workspaceSlug}/projects/${project?.id}`}>
        {CardContent}
      </Link>
    );
  }

  return <div onClick={onClick}>{CardContent}</div>;
}