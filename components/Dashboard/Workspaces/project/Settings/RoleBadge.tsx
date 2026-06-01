import { ProjectRole } from "@/hooks/useProjects";
import { Crown, UserCheck, User } from "lucide-react";

export function RoleBadge({ role }: { role: ProjectRole }) {
  const styles: Record<ProjectRole, string> = {
    MANAGER: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
    COLLABORATOR:  "bg-blue-100  text-blue-700  dark:bg-blue-950/40  dark:text-blue-300",
    VIEWER:  "bg-muted     text-muted-foreground",
  };
  const icons: Record<ProjectRole, React.ElementType> = {
    MANAGER: Crown,
    COLLABORATOR:  UserCheck,
    VIEWER:  User,
  };
  const Icon = icons[role];

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${styles[role]}`}
    >
      <Icon size={9} />
      {role}
    </span>
  );
}