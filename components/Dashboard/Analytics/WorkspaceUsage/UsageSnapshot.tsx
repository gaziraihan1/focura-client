// components/Analytics/WorkspaceUsage/UsageSnapshot.tsx
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
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import type { WorkspaceUsageData } from "@/types/workspace-usage.types";

interface UsageSnapshotProps {
  data: WorkspaceUsageData;
}

interface KPICardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: number;
  sparklineData?: number[];
  accentClass: string;
  iconBgClass: string;
}

function Sparkline({ data, accentClass }: { data: number[]; accentClass: string }) {
  const max = Math.max(...data, 1);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (v / max) * 80;
      return `${x},${y}`;
    })
    .join(" ");

  // Derive stroke color from tailwind accent class
  const strokeColor = accentClass.includes("blue")
    ? "#3b82f6"
    : accentClass.includes("green")
    ? "#22c55e"
    : accentClass.includes("purple")
    ? "#a855f7"
    : accentClass.includes("orange")
    ? "#f97316"
    : accentClass.includes("cyan")
    ? "#06b6d4"
    : accentClass.includes("rose")
    ? "#f43f5e"
    : accentClass.includes("indigo")
    ? "#6366f1"
    : "#f59e0b";

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="w-full h-10 mt-3 opacity-60"
    >
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KPICard({
  icon: Icon,
  label,
  value,
  change,
  sparklineData,
  accentClass,
  iconBgClass,
}: KPICardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className="group relative bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5 hover:shadow-md hover:border-primary/20 transition-all duration-300">
      <div className="flex items-start justify-between mb-2.5 sm:mb-4">
        <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl ${iconBgClass}`}>
          <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${accentClass}`} />
        </div>

        {change !== undefined && (
          <div
            className={`flex items-center gap-0.5 sm:gap-1 text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
              isPositive
                ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                : isNegative
                ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                : "text-muted-foreground bg-muted"
            }`}
          >
            {isPositive && <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
            {isNegative && <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
            {!isPositive && !isNegative && <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5 sm:mb-1">
        {label}
      </p>
      <p className="text-lg sm:text-2xl font-bold text-foreground">{value}</p>

      {sparklineData && sparklineData.length > 0 && (
        <Sparkline data={sparklineData} accentClass={accentClass} />
      )}
    </div>
  );
}

export function UsageSnapshot({ data }: UsageSnapshotProps) {
  const totalMembers =
    data.userEngagement.activeUsers.thisMonth +
    data.userEngagement.inactiveUsers.length;

  const totalProjects =
    data.workspaceGrowth.projectLifecycle.active +
    data.workspaceGrowth.projectLifecycle.completed;

  const activityEvents = data.userEngagement.collaborationIndex.reduce(
    (sum, user) => sum + user.collaborationScore,
    0
  );

  const engagementScore = Math.min(
    100,
    Math.round(
      (data.userEngagement.activeUsers.thisMonth / Math.max(1, totalMembers)) *
        100
    )
  );

  const kpis: KPICardProps[] = [
    {
      icon: Users,
      label: "Total Members",
      value: totalMembers,
      change: 8,
      sparklineData: [40, 55, 45, 70, 60, 80, 75],
      accentClass: "text-blue-600 dark:text-blue-400",
      iconBgClass: "bg-blue-50 dark:bg-blue-900/30",
    },
    {
      icon: UserCheck,
      label: "Active Members",
      value: data.userEngagement.activeUsers.thisMonth,
      change: 12,
      sparklineData: [30, 40, 50, 45, 60, 70, 65],
      accentClass: "text-green-600 dark:text-green-400",
      iconBgClass: "bg-green-50 dark:bg-green-900/30",
    },
    {
      icon: ListTodo,
      label: "Tasks This Month",
      value: data.workspaceGrowth.thisMonth.newTasks,
      change: 15,
      sparklineData: [50, 60, 55, 70, 65, 80, 90],
      accentClass: "text-purple-600 dark:text-purple-400",
      iconBgClass: "bg-purple-50 dark:bg-purple-900/30",
    },
    {
      icon: Folder,
      label: "Total Projects",
      value: totalProjects,
      change: 5,
      sparklineData: [60, 65, 70, 68, 75, 80, 78],
      accentClass: "text-orange-600 dark:text-orange-400",
      iconBgClass: "bg-orange-50 dark:bg-orange-900/30",
    },
    {
      icon: HardDrive,
      label: "Storage Used",
      value: `${data.resourceUsage.totalStorage.usedMB.toFixed(1)} MB`,
      change: 22,
      sparklineData: [20, 30, 35, 45, 50, 60, 70],
      accentClass: "text-cyan-600 dark:text-cyan-400",
      iconBgClass: "bg-cyan-50 dark:bg-cyan-900/30",
    },
    {
      icon: Activity,
      label: "Activity Score",
      value: activityEvents,
      change: 18,
      sparklineData: [40, 50, 60, 55, 70, 75, 85],
      accentClass: "text-rose-600 dark:text-rose-400",
      iconBgClass: "bg-rose-50 dark:bg-rose-900/30",
    },
    {
      icon: TrendingUp,
      label: "Avg Daily Users",
      value: Math.round(data.userEngagement.activeUsers.thisWeek / 7),
      change: 9,
      sparklineData: [45, 50, 55, 60, 58, 65, 70],
      accentClass: "text-indigo-600 dark:text-indigo-400",
      iconBgClass: "bg-indigo-50 dark:bg-indigo-900/30",
    },
    {
      icon: Zap,
      label: "Engagement Score",
      value: `${engagementScore}%`,
      change: 14,
      sparklineData: [50, 55, 60, 65, 70, 75, 80],
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