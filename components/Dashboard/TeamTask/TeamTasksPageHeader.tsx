import { Users } from "lucide-react";

interface TeamTasksPageHeaderProps {
  workspaceId?: string;
}

export function TeamTasksPageHeader({
  workspaceId,
}: TeamTasksPageHeaderProps) {
  return (
    <div>
      <h1 className="text-xl font-semibold flex items-center gap-2">
        <Users className="w-5 h-5 text-muted-foreground" />
        Team Tasks
      </h1>
      <p className="text-sm text-muted-foreground">
        {workspaceId
          ? "Tasks assigned in this workspace"
          : "Work that requires coordination and shared accountability"}
      </p>
    </div>
  );
}