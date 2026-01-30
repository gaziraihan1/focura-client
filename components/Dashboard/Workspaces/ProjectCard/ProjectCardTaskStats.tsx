import { CheckCircle2, AlertCircle } from "lucide-react";

interface ProjectCardTaskStatsProps {
  completedTasks: number;
  overdueTasks: number;
}

export function ProjectCardTaskStats({
  completedTasks,
  overdueTasks,
}: ProjectCardTaskStatsProps) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
      <div className="flex items-center gap-1 text-muted-foreground">
        <CheckCircle2 size={14} className="text-green-500" />
        <span>{completedTasks} done</span>
      </div>
      {overdueTasks > 0 && (
        <div className="flex items-center gap-1 text-muted-foreground">
          <AlertCircle size={14} className="text-red-500" />
          <span>{overdueTasks} overdue</span>
        </div>
      )}
    </div>
  );
}