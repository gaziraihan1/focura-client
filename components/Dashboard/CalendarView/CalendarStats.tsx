import { Task } from "@/hooks/useTask";
import { useMemo } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  TrendingUp,
} from "lucide-react";

interface CalendarStatsProps {
  tasks: Task[];
  selectedMonth: Date;
}

export function CalendarStats({ tasks, selectedMonth }: CalendarStatsProps) {
  const stats = useMemo(() => {
    const month = selectedMonth.getMonth();
    const year = selectedMonth.getFullYear();

    const monthTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate.getMonth() === month && dueDate.getFullYear() === year;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      total: monthTasks.length,
      completed: monthTasks.filter((t) => t.status === "COMPLETED").length,
      inProgress: monthTasks.filter((t) => t.status === "IN_PROGRESS").length,
      overdue: monthTasks.filter((t) => {
        if (!t.dueDate || t.status === "COMPLETED") return false;
        return new Date(t.dueDate) < today;
      }).length,
      dueThisWeek: monthTasks.filter((t) => {
        if (!t.dueDate) return false;
        const dueDate = new Date(t.dueDate);
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return dueDate >= today && dueDate <= weekFromNow;
      }).length,
      byPriority: {
        urgent: monthTasks.filter((t) => t.priority === "URGENT").length,
        high: monthTasks.filter((t) => t.priority === "HIGH").length,
        medium: monthTasks.filter((t) => t.priority === "MEDIUM").length,
        low: monthTasks.filter((t) => t.priority === "LOW").length,
      },
    };
  }, [tasks, selectedMonth]);

  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {/* Total Tasks */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
          </div>
        </div>
      </div>

      {/* Completed */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </div>
      </div>

      {/* In Progress */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
        </div>
      </div>

      {/* Overdue */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.overdue}</p>
            <p className="text-sm text-muted-foreground">Overdue</p>
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
            <p className="text-sm text-muted-foreground">Complete</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Legend Component
export function CalendarLegend() {
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <h3 className="font-semibold text-sm mb-3">Legend</h3>
      <div className="space-y-3">
        {/* Status */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Status</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded border bg-gray-500/20 border-gray-500/40" />
              <span className="text-xs">To Do</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded border bg-blue-500/20 border-blue-500/40" />
              <span className="text-xs">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded border bg-purple-500/20 border-purple-500/40" />
              <span className="text-xs">In Review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded border bg-green-500/20 border-green-500/40" />
              <span className="text-xs">Completed</span>
            </div>
          </div>
        </div>

        {/* Priority */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Priority</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs">Urgent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-xs">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs">Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}