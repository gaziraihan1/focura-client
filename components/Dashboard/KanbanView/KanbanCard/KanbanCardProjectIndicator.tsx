interface Project {
  id: string;
  name: string;
  color: string;
}

interface KanbanCardProjectIndicatorProps {
  project?: Project | null;
}

export function KanbanCardProjectIndicator({
  project,
}: KanbanCardProjectIndicatorProps) {
  if (!project) return null;

  return (
    <div
      className="absolute top-0 right-0 w-1 h-full rounded-r-lg"
      style={{ backgroundColor: project.color }}
    />
  );
}