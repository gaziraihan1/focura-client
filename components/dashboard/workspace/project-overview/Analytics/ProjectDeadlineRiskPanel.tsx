"use client";

import { ProjectDeadlineRisk, ProjectDeadlineRiskTask } from "@/hooks/useProjectAnalytics";
import { getRelativeTime } from "@/utils/analytics.utils";
import { AlertTriangle, Clock, Flame, Calendar, AlertCircle } from "lucide-react";

interface ProjectDeadlineRiskPanelProps {
  data: ProjectDeadlineRisk;
}

const riskConfig = {
  low: {
    icon: Clock,
    label: "Low Risk",
    color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    bgColor: "bg-green-500/5",
  },
  medium: {
    icon: AlertTriangle,
    label: "Medium Risk",
    color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    bgColor: "bg-yellow-500/5",
  },
  high: {
    icon: Flame,
    label: "High Risk",
    color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    bgColor: "bg-red-500/5",
  },
};

const priorityConfig: Record<string, { color: string; bg: string }> = {
  URGENT: { color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10" },
  HIGH: { color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10" },
  MEDIUM: { color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500/10" },
  LOW: { color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10" },
};

export function ProjectDeadlineRiskPanel({ data }: ProjectDeadlineRiskPanelProps) {
  const config = riskConfig[data.riskLevel];

  return (
    <div className="bg-card border rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">Deadline Risk Analysis</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tasks approaching deadlines and priority conflicts
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit shrink-0 ${config.color}`}>
          <config.icon className="w-4 h-4" />
          <span className="text-sm font-medium">{config.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg border ${config.bgColor}`}>
          <p className="text-sm text-muted-foreground mb-1">Due in 3 Days</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {data.dueIn3DaysCount}
          </p>
        </div>

        <div className="p-4 rounded-lg border bg-yellow-500/5 border-yellow-500/20">
          <p className="text-sm text-muted-foreground mb-1">Due in 7 Days</p>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {data.dueIn7DaysCount}
          </p>
        </div>

        <div className="p-4 rounded-lg border bg-orange-500/5 border-orange-500/20">
          <p className="text-sm text-muted-foreground mb-1">High Priority Near Deadline</p>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {data.highPriorityNearDeadline.length}
          </p>
        </div>
      </div>

      {data.highPriorityNearDeadline.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            High Priority Tasks Near Deadline
          </h3>
          <div className="space-y-2">
            {data.highPriorityNearDeadline.slice(0, 5).map((task) => (
              <ProjectDeadlineRiskTaskCard key={task.id} task={task} />
            ))}
            {data.highPriorityNearDeadline.length > 5 && (
              <p className="text-xs text-muted-foreground text-center py-2">
                +{data.highPriorityNearDeadline.length - 5} more high priority tasks
              </p>
            )}
          </div>
        </div>
      )}

      {data.dueIn3DaysCount > 0 && data.highPriorityNearDeadline.length === 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            Tasks Due Soon
          </h3>
          <p className="text-sm text-muted-foreground">
            {data.dueIn3DaysCount} task{data.dueIn3DaysCount !== 1 ? "s" : ""} due within 3 days.
            Check the task list for details.
          </p>
        </div>
      )}

      {data.dueIn3DaysCount === 0 && data.highPriorityNearDeadline.length === 0 && (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No urgent deadlines - you&apos;re on track!
          </p>
        </div>
      )}
    </div>
  );
}

interface ProjectDeadlineRiskTaskCardProps {
  task: ProjectDeadlineRiskTask;
}

function ProjectDeadlineRiskTaskCard({ task }: ProjectDeadlineRiskTaskCardProps) {
  const priority = priorityConfig[task.priority.toUpperCase()] || priorityConfig.MEDIUM;

  return (
    <div className="flex items-start justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{task.title}</p>
        {task.dueDate && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Due: {getRelativeTime(new Date(task.dueDate))}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end ml-4 shrink-0">
        <span className={`text-xs px-2 py-1 rounded ${priority.bg} ${priority.color}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="text-xs text-muted-foreground mt-1">
            {getRelativeTime(new Date(task.dueDate))}
          </span>
        )}
      </div>
    </div>
  );
}