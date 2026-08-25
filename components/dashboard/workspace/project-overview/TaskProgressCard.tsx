import { ChevronRight, Circle } from "lucide-react";
import { StatusBar } from "@/components/dashboard/workspace/project-overview/StatusBar";

interface TaskProgressCardProps {
  base: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  accentColor: string;
  onViewAll: () => void;
}

export function TaskProgressCard({
  // base,
  totalTasks,
  completedTasks,
  inProgressTasks,
  accentColor,
  onViewAll,
}: TaskProgressCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-foreground">Task Progress</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalTasks === 0
              ? "No tasks created yet"
              : `${totalTasks - completedTasks - inProgressTasks} remaining to start`}
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors"
        >
          View all
          <ChevronRight size={12} />
        </button>
      </div>

      {totalTasks === 0 ? (
        <div className="py-8 flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <Circle size={18} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No tasks yet — create your first task to get started.</p>
          <button
            onClick={() => onViewAll()}
            className="mt-1 text-xs font-semibold px-4 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            Go to Tasks
          </button>
        </div>
      ) : (
        <StatusBar
          completed={completedTasks}
          inProgress={inProgressTasks}
          total={totalTasks}
          accentColor={accentColor}
        />
      )}
    </div>
  );
}