import { Tag } from "lucide-react";

interface LabelHeaderProps {
  name: string;
  color?: string | null;
  taskCount: number;
}

export function LabelHeader({ name, color, taskCount }: LabelHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: color ?? "hsl(var(--muted))" }}
        >
          <Tag className="h-4 w-4 text-white" />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{name}</h1>
          <p className="text-sm text-muted-foreground">
            {taskCount} {taskCount === 1 ? "task" : "tasks"}
          </p>
        </div>
      </div>
    </div>
  );
}