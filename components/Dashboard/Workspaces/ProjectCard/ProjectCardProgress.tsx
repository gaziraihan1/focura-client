interface ProjectCardProgressProps {
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
}

export function ProjectCardProgress({
  completedTasks,
  totalTasks,
  completionRate,
}: ProjectCardProgressProps) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
        <span className="text-muted-foreground">Progress</span>
        <span className="text-foreground font-medium">
          {completedTasks}/{totalTasks} tasks
        </span>
      </div>
      <div className="w-full h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${completionRate}%` }}
        />
      </div>
    </div>
  );
}