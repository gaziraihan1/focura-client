import { FileText } from "lucide-react";

interface TaskDescriptionProps {
  description?: string | null;
}

export function TaskDescription({ description }: TaskDescriptionProps) {
  if (!description) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Description</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed pl-6">
        {description}
      </p>
    </div>
  );
}