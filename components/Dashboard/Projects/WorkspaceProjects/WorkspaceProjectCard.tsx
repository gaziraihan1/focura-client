import Link from "next/link";
import {
  FolderKanban,
  Users,
  Calendar,
  Flag,
  CheckCircle2,
  Crown,
} from "lucide-react";

const statusColors: Record<string, string> = {
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

interface Member {
  user?: {
    id: string;
    name: string;
  };
  userId?: string;
  role?: string;
}

interface Project {
  id: string;
  name: string;
  description?: string | null;
  color?: string;
  icon?: string;
  status?: string;
  priority?: string;
  dueDate?: string | null;
  isMember?: boolean;
  members?: Member[];
  _count?: {
    members?: number;
    tasks?: number;
  };
}

interface WorkspaceProjectCardProps {
  project: Project;
  workspaceSlug: string;
  currentUserId?: string;
}

export function WorkspaceProjectCard({
  project,
  workspaceSlug,
  currentUserId,
}: WorkspaceProjectCardProps) {
  const memberCount =
    project._count?.members || project.members?.length || 0;
  const taskCount = project._count?.tasks || 0;

  const joined =
    project.isMember ||
    project.members?.some((m) => m.user?.id === currentUserId);

  return (
    <Link
      href={`/dashboard/workspaces/${workspaceSlug}/projects/${project.id}`}
    >
      <div className="p-5 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition cursor-pointer h-full flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold shrink-0"
              style={{
                backgroundColor: `${project.color || "#667eea"}20`,
              }}
            >
              {project.icon ? (
                <span className="text-2xl">{project.icon}</span>
              ) : (
                <FolderKanban
                  size={20}
                  style={{ color: project.color || "#667eea" }}
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            {project.status && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  statusColors[project.status] || "bg-muted text-foreground"
                }`}
              >
                {project.status.replace("_", " ")}
              </span>
            )}
            {joined && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 flex items-center gap-1 whitespace-nowrap">
                <CheckCircle2 size={14} />
                Joined
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {project.priority && (
            <span className="flex items-center gap-1">
              <Flag
                size={14}
                className={priorityColors[project.priority] || ""}
              />
              {project.priority}
            </span>
          )}
          {project.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              Due {formatDate(project.dueDate)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <FolderKanban size={16} />
            <span className="font-medium text-foreground">{taskCount}</span>
            <span className="text-muted-foreground">
              {taskCount === 1 ? "task" : "tasks"}
            </span>
          </span>
          <span className="flex items-center gap-2 text-muted-foreground">
            <Users size={16} />
            <span className="font-medium text-foreground">{memberCount}</span>
            <span className="text-muted-foreground">
              {memberCount === 1 ? "member" : "members"}
            </span>
          </span>
        </div>

        {project.members && project.members.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {project.members.slice(0, 3).map((member) => (
              <span
                key={member.user?.id || member.userId}
                className="px-2 py-1 rounded-full bg-muted text-foreground flex items-center gap-1 text-xs"
              >
                {member.role === "MANAGER" && (
                  <Crown size={12} className="text-yellow-500" />
                )}
                {member.user?.name || "Unknown"}
              </span>
            ))}
            {project.members.length > 3 && (
              <span className="px-2 py-1 rounded-full bg-muted text-foreground text-xs">
                +{project.members.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}