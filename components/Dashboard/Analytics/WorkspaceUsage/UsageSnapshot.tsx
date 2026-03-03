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

function KPICard({
  icon: Icon,
  label,
  value,
  subtitle,
  accentClass,
  iconBgClass,
}: KPICardProps) {
  return (
    <div className="group relative bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5 hover:shadow-md hover:border-primary/20 transition-all duration-300">
      <div className="flex items-start justify-between mb-2.5 sm:mb-4">
        <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl ${iconBgClass}`}>
          <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${accentClass}`} />
        </div>
      </div>

      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5 sm:mb-1">
        {label}
      </p>
      <p className="text-lg sm:text-2xl font-bold text-foreground">{value}</p>
      
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
}

export function UsageSnapshot({ data }: UsageSnapshotProps) {
  // ✅ 100% REAL DATA from backend snapshot
  const snapshot = data.snapshot;

  const kpis: KPICardProps[] = [
    {
      icon: Users,
      label: "Total Members",
      value: snapshot.totalMembers,
      accentClass: "text-blue-600 dark:text-blue-400",
      iconBgClass: "bg-blue-50 dark:bg-blue-900/30",
    },
    {
      icon: UserCheck,
      label: "Active Members",
      value: snapshot.activeMembers,
      subtitle: "Last 7 days",
      accentClass: "text-green-600 dark:text-green-400",
      iconBgClass: "bg-green-50 dark:bg-green-900/30",
    },
    {
      icon: ListTodo,
      label: "Total Tasks",
      value: snapshot.totalTasks.toLocaleString(),
      accentClass: "text-purple-600 dark:text-purple-400",
      iconBgClass: "bg-purple-50 dark:bg-purple-900/30",
    },
    {
      icon: Folder,
      label: "Total Projects",
      value: snapshot.totalProjects,
      accentClass: "text-orange-600 dark:text-orange-400",
      iconBgClass: "bg-orange-50 dark:bg-orange-900/30",
    },
    {
      icon: HardDrive,
      label: "Storage Used",
      value: snapshot.storageUsedMB >= 1024
        ? `${(snapshot.storageUsedMB / 1024).toFixed(1)} GB`
        : `${Math.round(snapshot.storageUsedMB)} MB`,
      accentClass: "text-cyan-600 dark:text-cyan-400",
      iconBgClass: "bg-cyan-50 dark:bg-cyan-900/30",
    },
    {
      icon: Activity,
      label: "Activity Events",
      value: snapshot.activityEvents.toLocaleString(),
      subtitle: "Last 7 days",
      accentClass: "text-rose-600 dark:text-rose-400",
      iconBgClass: "bg-rose-50 dark:bg-rose-900/30",
    },
    {
      icon: TrendingUp,
      label: "Avg Daily Users",
      value: snapshot.avgDailyUsers,
      accentClass: "text-indigo-600 dark:text-indigo-400",
      iconBgClass: "bg-indigo-50 dark:bg-indigo-900/30",
    },
    {
      icon: Zap,
      label: "Engagement Score",
      value: `${snapshot.engagementScore}%`,
      subtitle: "Active vs Total",
      accentClass: "text-amber-600 dark:text-amber-400",
      iconBgClass: "bg-amber-50 dark:bg-amber-900/30",
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