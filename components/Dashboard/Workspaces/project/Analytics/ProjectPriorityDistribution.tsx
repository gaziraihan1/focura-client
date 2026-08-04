"use client";

import { ProjectTaskPriorityItem } from "@/hooks/useProjectAnalytics";

interface ProjectPriorityDistributionProps {
  data: ProjectTaskPriorityItem[];
}

// Static, literal class pairs so Tailwind v4 generates each utility.
// Semantic priority hues (matching the workspace PriorityDistribution).
const priorityColors: Record<string, string> = {
  URGENT: "bg-red-500",
  HIGH: "bg-orange-500",
  MEDIUM: "bg-yellow-500",
  LOW: "bg-green-500",
};

const priorityLabels: Record<string, string> = {
  URGENT: "Urgent",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export function ProjectPriorityDistribution({ data }: ProjectPriorityDistributionProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Priority Distribution</h2>
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          No priority data available
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);
  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className="bg-card border rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-6">Priority Distribution</h2>

      <div className="space-y-4 mb-6">
        {data.map((item, index) => {
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
          const barWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
          const color = priorityColors[item.priority.toUpperCase()] || "bg-chart-1";

          return (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${color}`}
                  />
                  <span className="text-sm font-medium text-foreground truncate">
                    {priorityLabels[item.priority] || item.priority}
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
                  className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
        <span>Total: {total} tasks</span>
      </div>
    </div>
  );
}