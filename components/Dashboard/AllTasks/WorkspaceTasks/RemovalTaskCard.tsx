import { Task } from "@/hooks/useTask";
import { TaskCard } from "./TaskCard";
import { X } from "lucide-react";

interface RemovableTaskCardProps {
  task: Task;
  workspaceSlug: string;
  isRemoving: boolean;
  onRemove: (taskId: string) => void;
  accentColor: "purple" | "amber";
}

export function RemovableTaskCard({
  task,
  workspaceSlug,
  isRemoving,
  onRemove,
  accentColor,
}: RemovableTaskCardProps) {
  const hoverColor =
    accentColor === "purple"
      ? "hover:bg-purple-500/10 hover:text-purple-500"
      : "hover:bg-amber-500/10 hover:text-amber-500";

  return (
    <div className="relative group/removable">
      <TaskCard task={task} workspaceSlug={workspaceSlug} />

      {/* 
        - Remove opacity-0 so it's always visible on mobile
        - md:opacity-0 + group-hover/removable:md:opacity-100 for desktop hover behavior
        - top-3 right-3 matches TaskCard's internal padding (p-4 = 16px, flag is in the title row)
        - The flag icon is inside the flex row at the top of the card content,
          so we nudge right to sit just after it with a small gap
      */}
      <button
        onClick={() => onRemove(task.id)}
        disabled={isRemoving}
        className={`
          absolute top-3 right-12
          p-1.5 rounded-lg
          bg-background border border-border text-muted-foreground
          md:opacity-0 group-hover/removable:opacity-100
          transition-all disabled:cursor-not-allowed disabled:opacity-50
          ${hoverColor}
        `}
        title="Remove from daily tasks"
      >
        {isRemoving ? (
          <div className="w-3.5 h-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <X size={14} />
        )}
      </button>
    </div>
  );
}