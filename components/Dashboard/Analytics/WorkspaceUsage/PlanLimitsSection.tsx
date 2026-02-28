// components/Analytics/WorkspaceUsage/PlanLimitsSection.tsx
"use client";

import {
  Users,
  HardDrive,
  Folder,
  Zap,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Infinity,
} from "lucide-react";
import type {
  ResourceUsageMetrics,
  WorkspaceGrowthMetrics,
} from "@/types/workspace-usage.types";

interface PlanLimitsSectionProps {
  resourceUsage: ResourceUsageMetrics;
  workspaceGrowth: WorkspaceGrowthMetrics;
}

interface LimitCardProps {
  icon: React.ElementType;
  label: string;
  current: number;
  max: number | null; // null = unlimited
  unit: string;
  percentage: number;
}

function LimitCard({ icon: Icon, label, current, max, unit, percentage }: LimitCardProps) {
  const isUnlimited = max === null;
  const isCritical = !isUnlimited && percentage >= 90;
  const isWarning = !isUnlimited && percentage >= 75 && !isCritical;

  const barColor = isCritical
    ? "bg-red-500"
    : isWarning
    ? "bg-orange-500"
    : isUnlimited
    ? "bg-blue-400"
    : "bg-blue-500";

  const borderColor = isCritical
    ? "border-red-200 dark:border-red-900"
    : isWarning
    ? "border-orange-200 dark:border-orange-900"
    : "border-border";

  const bgColor = isCritical
    ? "bg-red-50/50 dark:bg-red-950/20"
    : isWarning
    ? "bg-orange-50/50 dark:bg-orange-950/20"
    : "bg-card";

  return (
    <div className={`rounded-xl sm:rounded-2xl border-2 p-3.5 sm:p-5 transition-all ${borderColor} ${bgColor}`}>
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div
            className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${
              isCritical
                ? "bg-red-100 dark:bg-red-900/30"
                : isWarning
                ? "bg-orange-100 dark:bg-orange-900/30"
                : "bg-muted"
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                isCritical
                  ? "text-red-600 dark:text-red-400"
                  : isWarning
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-muted-foreground"
              }`}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">Current usage</p>
          </div>
        </div>
        {(isCritical || isWarning) && (
          <AlertTriangle
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
              isCritical
                ? "text-red-500"
                : "text-orange-500"
            }`}
          />
        )}
        {isUnlimited && (
          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
        )}
      </div>

      <div className="w-full h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden mb-2 sm:mb-3">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: isUnlimited ? "30%" : `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-xl font-bold text-foreground">
          {current}
          {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          {isUnlimited ? (
            <>
              <Infinity className="w-3 h-3" /> <span className="hidden sm:inline">Unlimited</span><span className="sm:hidden">∞</span>
            </>
          ) : (
            `/ ${max} ${unit}`
          )}
        </span>
      </div>

      {!isUnlimited && (
        <p
          className={`text-xs font-medium mt-1.5 sm:mt-2 ${
            isCritical
              ? "text-red-600 dark:text-red-400"
              : isWarning
              ? "text-orange-600 dark:text-orange-400"
              : "text-muted-foreground"
          }`}
        >
          {percentage.toFixed(0)}% used
        </p>
      )}
    </div>
  );
}

export function PlanLimitsSection({
  resourceUsage,
  workspaceGrowth,
}: PlanLimitsSectionProps) {
  const { totalStorage } = resourceUsage;

  const totalMembers = 8;
  const maxMembers = 10;
  const memberPercentage = (totalMembers / maxMembers) * 100;

  const automations = 12;
  const maxAutomations = 50;
  const automationPercentage = (automations / maxAutomations) * 100;

  const totalProjects =
    workspaceGrowth.projectLifecycle.active +
    workspaceGrowth.projectLifecycle.completed;

  const hasWarnings =
    totalStorage.percentage >= 75 || memberPercentage >= 75;

  const limits: LimitCardProps[] = [
    {
      icon: Users,
      label: "Members",
      current: totalMembers,
      max: maxMembers,
      unit: "",
      percentage: memberPercentage,
    },
    {
      icon: HardDrive,
      label: "Storage",
      current: Math.round(totalStorage.usedMB),
      max: totalStorage.totalMB,
      unit: "MB",
      percentage: totalStorage.percentage,
    },
    {
      icon: Folder,
      label: "Projects",
      current: totalProjects,
      max: null,
      unit: "",
      percentage: 0,
    },
    {
      icon: Zap,
      label: "Automations",
      current: automations,
      max: maxAutomations,
      unit: "",
      percentage: automationPercentage,
    },
  ];

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Plan Limits</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor capacity and upgrade when needed
          </p>
        </div>
        {hasWarnings && (
          <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Upgrade
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        {limits.map((limit) => (
          <LimitCard key={limit.label} {...limit} />
        ))}
      </div>

      {hasWarnings && (
        <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-primary/10 shrink-0">
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Unlock More with Pro
              </h3>
              <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1">
                {[
                  "Unlimited storage & members",
                  "Advanced analytics",
                  "Priority support",
                  "Custom automations",
                ].map((benefit) => (
                  <span
                    key={benefit}
                    className="text-xs text-muted-foreground flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
            <button className="shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors w-full sm:w-auto text-center">
              Learn More
            </button>
          </div>
        </div>
      )}
    </section>
  );
}