"use client";

import { ProjectAnalyticsKPIs } from "@/hooks/useProjectAnalytics";
import { BarChart3, CheckCircle2, Clock, Users, TrendingUp, AlertTriangle, HardDrive, Timer } from "lucide-react";

interface ProjectKPICardsProps {
  kpis: ProjectAnalyticsKPIs;
  accentColor: string;
}

// Static, literal class pairs so Tailwind v4 generates each utility.
const KPI_TOKEN_CLASSES: Array<{ color: string; bgColor: string }> = [
  { color: "text-chart-1", bgColor: "bg-chart-1/10" },
  { color: "text-chart-2", bgColor: "bg-chart-2/10" },
  { color: "text-chart-3", bgColor: "bg-chart-3/10" },
  { color: "text-chart-4", bgColor: "bg-chart-4/10" },
  { color: "text-chart-5", bgColor: "bg-chart-5/10" },
];

const kpiConfigs: Array<{
  key: keyof ProjectAnalyticsKPIs;
  label: string;
  icon: React.ElementType;
  tokenIndex: number;
  subtitle?: (kpis: ProjectAnalyticsKPIs) => string;
}> = [
  { key: "totalTasks", label: "Total Tasks", icon: BarChart3, tokenIndex: 0 },
  { key: "completedTasks", label: "Completed", icon: CheckCircle2, tokenIndex: 1, subtitle: (k) => `${k.completionRate}% rate` },
  { key: "inProgressTasks", label: "In Progress", icon: Timer, tokenIndex: 2 },
  { key: "overdueTasks", label: "Overdue", icon: AlertTriangle, tokenIndex: 3 },
  { key: "totalMembers", label: "Members", icon: Users, tokenIndex: 4 },
  { key: "totalHours", label: "Total Hours", icon: Clock, tokenIndex: 0 },
  { key: "storageUsed", label: "Storage", icon: HardDrive, tokenIndex: 1, subtitle: (k) => `${(k.storageUsed / (1024 * 1024 * 1024)).toFixed(2)} GB` },
  { key: "completionRate", label: "Completion Rate", icon: TrendingUp, tokenIndex: 2, subtitle: () => "Overall progress" },
];

export function ProjectKPICards({ kpis, accentColor }: ProjectKPICardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
      {kpiConfigs.map((config) => {
        const value = kpis[config.key];
        const displayValue =
          config.key === "storageUsed"
            ? `${(value / (1024 * 1024 * 1024)).toFixed(2)} GB`
            : config.key === "totalHours"
            ? `${value}h`
            : config.key === "completionRate"
            ? `${value}%`
            : typeof value === "number"
            ? value.toLocaleString()
            : String(value);

        // Completion rate is highlighted with the project's accent color.
        const isAccent = config.key === "completionRate";
        const token = isAccent ? null : KPI_TOKEN_CLASSES[config.tokenIndex];

        return (
          <div
            key={config.key}
            className="bg-card border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2 sm:mb-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isAccent ? "" : token?.bgColor
                }`}
                style={isAccent ? { backgroundColor: `${accentColor}18` } : undefined}
              >
                <config.icon
                  size={16}
                  className={isAccent ? "" : token?.color}
                  style={isAccent ? { color: accentColor } : undefined}
                />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-foreground leading-tight min-w-0 break-all">
                {displayValue}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-widest truncate">
              {config.label}
            </p>
            {config.subtitle && (
              <p className="text-[11px] text-muted-foreground mt-1">{config.subtitle(kpis)}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}