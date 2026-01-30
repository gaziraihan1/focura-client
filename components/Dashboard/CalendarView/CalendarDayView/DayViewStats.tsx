import { Task } from "@/hooks/useTask";

interface DayViewStatsProps {
  tasks: Task[];
  totalEstimatedHours: number;
}

export function DayViewStats({ tasks, totalEstimatedHours }: DayViewStatsProps) {
  const personalTasks = tasks.filter((t) => t.assignees.length === 0).length;
  const teamTasks = tasks.filter((t) => t.assignees.length > 0).length;

  return (
    <div className="grid grid-cols-4 gap-4 mt-4">
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-sm text-muted-foreground mb-1">Total Tasks</div>
        <div className="text-3xl font-bold text-foreground">{tasks.length}</div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-sm text-muted-foreground mb-1">
          Estimated Hours
        </div>
        <div className="text-3xl font-bold text-foreground">
          {totalEstimatedHours}h
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-sm text-muted-foreground mb-1">Personal</div>
        <div className="text-3xl font-bold text-foreground">
          {personalTasks}
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-sm text-muted-foreground mb-1">Team</div>
        <div className="text-3xl font-bold text-foreground">{teamTasks}</div>
      </div>
    </div>
  );
}