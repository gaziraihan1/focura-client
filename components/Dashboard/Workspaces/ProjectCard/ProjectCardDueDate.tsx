import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface ProjectCardDueDateProps {
  dueDate?: string | null;
}

export function ProjectCardDueDate({ dueDate }: ProjectCardDueDateProps) {
  if (!dueDate) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Calendar size={14} />
      <span>{format(new Date(dueDate), "MMM d")}</span>
    </div>
  );
}