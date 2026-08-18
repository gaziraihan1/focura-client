import {
  CheckSquare,
  Users,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { StatPill } from "./StatPill";

interface StatsRibbonProps {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  totalMembers: number;
  completionPct: number;
  accentColor: string;
}

export function StatsRibbon({
  totalTasks,
  completedTasks,
  inProgressTasks,
  totalMembers,
  completionPct,
  accentColor,
}: StatsRibbonProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      <StatPill
        icon={CheckSquare}
        label="Total Tasks"
        value={totalTasks}
        sub={`${completedTasks} completed`}
        accent={accentColor}
      />
      <StatPill
        icon={CheckCircle2}
        label="Completed"
        value={completedTasks}
        sub={`${completionPct}% rate`}
        accent="#10b981"
      />
      <StatPill
        icon={Loader2}
        label="In Progress"
        value={inProgressTasks}
        sub="active tasks"
        accent="#f59e0b"
      />
      <StatPill
        icon={Users}
        label="Members"
        value={totalMembers}
        sub="collaborators"
        accent="#8b5cf6"
      />
    </div>
  );
}