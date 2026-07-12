"use client";

import { ProjectAnalyticsKPIs } from "@/hooks/useProjectAnalytics";
import { BarChart3, CheckCircle2, Clock, Users, TrendingUp, AlertTriangle, HardDrive, Timer } from "lucide-react";

interface ProjectKPICardsProps {
  kpis: ProjectAnalyticsKPIs;
  accentColor: string;
}

const kpiConfigs: Array<{
  key: keyof ProjectAnalyticsKPIs;
  label: string;
  icon: React.ElementType;
  color: string;
  subtitle?: (kpis: ProjectAnalyticsKPIs) => string;
}> = [
  { key: "totalTasks", label: "Total Tasks", icon: BarChart3, color: "#667eea" },
  { key: "completedTasks", label: "Completed", icon: CheckCircle2, color: "#10b981", subtitle: (k) => `${k.completionRate}% rate` },
  { key: "inProgressTasks", label: "In Progress", icon: Timer, color: "#f59e0b" },
  { key: "overdueTasks", label: "Overdue", icon: AlertTriangle, color: "#ef4444" },
  { key: "totalMembers", label: "Members", icon: Users, color: "#8b5cf6" },
  { key: "totalHours", label: "Total Hours", icon: Clock, color: "#06b6d4" },
  { key: "storageUsed", label: "Storage", icon: HardDrive, color: "#ec4899", subtitle: (k) => `${(k.storageUsed / (1024 * 1024 * 1024)).toFixed(2)} GB` },
  { key: "completionRate", label: "Completion Rate", icon: TrendingUp, color: "#10b981", subtitle: () => "Overall progress" },
];

export function ProjectKPICards({ kpis, accentColor }: ProjectKPICardsProps) {
  const cards = kpiConfigs.map((config) => {
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

    return {
      ...config,
      value: displayValue,
      accentColor: config.key === "completionRate" ? accentColor : config.color,
    };
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-card border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2 sm:mb-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${card.accentColor}18` }}
            >
              <card.icon size={16} style={{ color: card.accentColor }} />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground leading-tight min-w-0 break-all">
              {card.value}
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-widest truncate">
            {card.label}
          </p>
          {card.subtitle && (
            <p className="text-[11px] text-muted-foreground mt-1">{card.subtitle(kpis)}</p>
          )}
        </div>
      ))}
    </div>
  );
}