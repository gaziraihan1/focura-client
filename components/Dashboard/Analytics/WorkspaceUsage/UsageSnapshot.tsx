"use client";

import {
  Users,
  UserCheck,
  ListTodo,
  Folder,
  HardDrive,
  Activity,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { WorkspaceUsageData } from "@/types/workspace-usage.types";

interface UsageSnapshotProps {
  data: WorkspaceUsageData;
}

interface KPICardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtitle?: string;
  accentClass: string;
  iconBgClass: string;
}

function KPICard({ icon: Icon, label, value, subtitle, accentClass, iconBgClass }: KPICardProps) {
  return (
    <div className="group bg-card border border-border rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:shadow-md hover:border-primary/20 transition-all duration-300">
      <div className={`p-2 rounded-lg ${iconBgClass} w-fit mb-2.5 sm:mb-4`}>
        <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${accentClass}`} />
      </div>
      <p className="text-[11px] sm:text-xs font-medium text-muted-foreground sm:uppercase sm:tracking-wider mb-0.5 sm:mb-1 truncate">
        {label}
      </p>
      <p className="text-base sm:text-2xl font-bold text-foreground leading-tight">
        {value}
      </p>
      {subtitle && (
        <p className="text-[11px] text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
}
export function UsageSnapshot({ data }: UsageSnapshotProps) {
  // ✅ 100% REAL DATA from backend snapshot
  const snapshot = data.snapshot;

  // Theme-aware chart tokens (defined in globals.css) — consistent with the rest
  // of the analytics palette in both light and dark mode.
  const tokenClasses = [
    { accentClass: "text-chart-1", iconBgClass: "bg-chart-1/10" },
    { accentClass: "text-chart-2", iconBgClass: "bg-chart-2/10" },
    { accentClass: "text-chart-3", iconBgClass: "bg-chart-3/10" },
    { accentClass: "text-chart-4", iconBgClass: "bg-chart-4/10" },
    { accentClass: "text-chart-5", iconBgClass: "bg-chart-5/10" },
  ];

  const kpis: KPICardProps[] = [
    {
      icon: Users,
      label: "Total Members",
      value: snapshot.totalMembers,
      ...tokenClasses[0],
    },
    {
      icon: UserCheck,
      label: "Active Members",
      value: snapshot.activeMembers,
      subtitle: "Last 7 days",
      ...tokenClasses[1],
    },
    {
      icon: ListTodo,
      label: "Total Tasks",
      value: snapshot.totalTasks.toLocaleString(),
      ...tokenClasses[2],
    },
    {
      icon: Folder,
      label: "Total Projects",
      value: snapshot.totalProjects,
      ...tokenClasses[3],
    },
    {
      icon: HardDrive,
      label: "Storage Used",
      value: snapshot.storageUsedMB >= 1024
        ? `${(snapshot.storageUsedMB / 1024).toFixed(1)} GB`
        : `${Math.round(snapshot.storageUsedMB)} MB`,
      ...tokenClasses[4],
    },
    {
      icon: Activity,
      label: "Activity Events",
      value: snapshot.activityEvents.toLocaleString(),
      subtitle: "Last 7 days",
      ...tokenClasses[0],
    },
    {
      icon: TrendingUp,
      label: "Avg Daily Users",
      value: snapshot.avgDailyUsers,
      ...tokenClasses[1],
    },
    {
      icon: Zap,
      label: "Engagement Score",
      value: `${snapshot.engagementScore}%`,
      subtitle: "Active vs Total",
      ...tokenClasses[2],
    },
  ];

  return (
    <section>
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">
        Overview
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>
    </section>
  );
}