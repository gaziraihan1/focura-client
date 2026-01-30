import { Flag } from "lucide-react";

interface Project {
  id: string;
  name: string;
  color: string;
  workspace: {
    id: string;
    name: string;
  };
}

interface TaskProjectSectionProps {
  project?: Project | null;
}

export function TaskProjectSection({ project }: TaskProjectSectionProps) {
  if (!project) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Flag className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Project</h3>
      </div>
      <div className="pl-6">
        <div className="flex items-center gap-3 bg-muted rounded-lg p-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground">
              {project.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {project.workspace.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}