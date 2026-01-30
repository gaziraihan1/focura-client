import { ProjectCardMembers } from "./ProjectCardMembers";
import { ProjectCardDueDate } from "./ProjectCardDueDate";

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

interface ProjectCardFooterProps {
  members: ProjectMember[];
  totalMembers: number;
  dueDate?: string | null;
}

export function ProjectCardFooter({
  members,
  totalMembers,
  dueDate,
}: ProjectCardFooterProps) {
  return (
    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border">
      <ProjectCardMembers members={members} totalMembers={totalMembers} />
      <ProjectCardDueDate dueDate={dueDate} />
    </div>
  );
}