import { Stat } from "@/components/Dashboard/TeamTask/Stat";
import { TaskStats } from "@/hooks/useTask";

interface TeamTasksStatsProps {
  stats?: TaskStats | null;
}

export function TeamTasksStats({ stats }: TeamTasksStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Stat label="Assigned" value={stats?.assigned ?? 0} />
      <Stat label="Overdue" value={stats?.overdue ?? 0} danger />
      <Stat label="Due Today" value={stats?.dueToday ?? 0} />
      <Stat label="In Progress" value={stats?.inProgress ?? 0} />
    </div>
  );
}