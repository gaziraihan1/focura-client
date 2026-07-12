"use client";

import { ProjectTaskStatusItem } from "@/hooks/useProjectAnalytics";

interface ProjectTaskStatusChartProps {
  data: ProjectTaskStatusItem[];
}

const statusColors: Record<string, string> = {
  TODO: "#667eea",
  IN_PROGRESS: "#f59e0b",
  IN_REVIEW: "#8b5cf6",
  DONE: "#10b981",
  COMPLETED: "#10b981",
  BACKLOG: "#6b7280",
  BLOCKED: "#ef4444",
};

const statusLabels: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
  COMPLETED: "Completed",
  BACKLOG: "Backlog",
  BLOCKED: "Blocked",
};

export function ProjectTaskStatusChart({ data }: ProjectTaskStatusChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Task Status</h2>
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          No task status data available
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);
  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className="bg-card border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-6">Task Status Distribution</h2>

      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
          const barWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
          const color = statusColors[item.status.toUpperCase()] || "#667eea";

          return (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-medium text-foreground truncate">
                    {statusLabels[item.status] || item.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold text-foreground w-10 text-right">
                    {item.count}
                  </span>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
        <span>Total: {total} tasks</span>
      </div>
    </div>
  );
}