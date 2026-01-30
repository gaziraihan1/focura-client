import { ProjectCardProgress } from "./ProjectCardProgress";
import { ProjectCardTaskStats } from "./ProjectCardTaskStats";

interface ProjectCardStatsProps {
  completedTasks: number;
  totalTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export function ProjectCardStats({
  completedTasks,
  totalTasks,
  overdueTasks,
  completionRate,
}: ProjectCardStatsProps) {
  return (
    <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
      <ProjectCardProgress
        completedTasks={completedTasks}
        totalTasks={totalTasks}
        completionRate={completionRate}
      />
      <ProjectCardTaskStats
        completedTasks={completedTasks}
        overdueTasks={overdueTasks}
      />
    </div>
  );
}