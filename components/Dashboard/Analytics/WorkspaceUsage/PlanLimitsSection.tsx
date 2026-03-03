"use client";

import {
  Users,
  HardDrive,
  Folder,
  Zap,
  ArrowUpRight,
  Crown,
  AlertTriangle,
  // Infinity,
} from "lucide-react";
import type { PlanLimitsMetrics } from "@/types/workspace-usage.types";
import Link from "next/link";

interface PlanLimitsSectionProps {
  // ✅ Correct prop — page.tsx passes data.planLimits, not resourceUsage+workspaceGrowth
  planLimits: PlanLimitsMetrics;
}

interface LimitCardProps {
  icon: React.ElementType;
  label: string;
  current: number;
  max: number | null; // null or -1 = unlimited
  unit?: string;
  percentage: number;
}

function formatStorage(mb: number): string {
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`;
}

function LimitCard({ icon: Icon, label, current, max, unit, percentage }: LimitCardProps) {
  const isUnlimited = max === null || max === -1;
  const isCritical  = !isUnlimited && percentage >= 95;
  const isWarning   = !isUnlimited && percentage >= 75 && !isCritical;

  const displayValue =
    unit === "MB" ? formatStorage(current) : `${current}${unit ? ` ${unit}` : ""}`;

  const displayMax =
    isUnlimited
      ? null
      : unit === "MB"
      ? formatStorage(max as number)
      : `${max}${unit ? ` ${unit}` : ""}`;

  return (
    <div
      className={`bg-card border rounded-xl sm:rounded-2xl p-3.5 sm:p-5 hover:shadow-md transition-all duration-300 ${
        isCritical
          ? "border-red-300 dark:border-red-800"
          : isWarning
          ? "border-amber-300 dark:border-amber-800"
          : "border-border hover:border-primary/20"
      }`}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div
            className={`p-2 rounded-lg ${
              isCritical
                ? "bg-red-50 dark:bg-red-900/20"
                : isWarning
                ? "bg-amber-50 dark:bg-amber-900/20"
                : "bg-muted"
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                isCritical
                  ? "text-red-600 dark:text-red-400"
                  : isWarning
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground"
              }`}
            />
          </div>
          <h3 className="text-xs font-semibold text-foreground">{label}</h3>
        </div>

        {(isCritical || isWarning) && !isUnlimited && (
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
              isCritical
                ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
            }`}
          >
            {isCritical ? "At Limit" : "Near Limit"}
          </span>
        )}
      </div>

      {isUnlimited ? (
        <div className="space-y-2">
          <p className="text-lg sm:text-2xl font-bold text-foreground">{displayValue}</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-lg p-2">
            <Crown className="w-3.5 h-3.5" />
            <span>Unlimited</span>
          </div>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground mb-2">
            {displayValue} / {displayMax}
          </p>

          <div className="w-full bg-muted rounded-full h-2 overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isCritical
                  ? "bg-red-500 dark:bg-red-400"
                  : isWarning
                  ? "bg-amber-500 dark:bg-amber-400"
                  : "bg-primary"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-medium ${
                isCritical
                  ? "text-red-600 dark:text-red-400"
                  : isWarning
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground"
              }`}
            >
              {Math.round(percentage)}% used
            </span>
            {isWarning && (
              <button className="text-xs font-medium text-primary hover:underline">
                Upgrade →
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function PlanLimitsSection({ planLimits }: PlanLimitsSectionProps) {
  // ✅ All percentages computed from real planLimits data
  const pct = (used: number, limit: number) =>
    limit === -1 ? 0 : Math.round((used / limit) * 100);

  const memberPct     = pct(planLimits.memberCount,    planLimits.memberLimit);
  const storagePct    = pct(planLimits.storageUsedMB,  planLimits.storageLimitMB);
  const projectPct    = pct(planLimits.projectCount,   planLimits.projectLimit);
  const automationPct = pct(planLimits.automationCount, planLimits.automationLimit);

  const hasWarnings =
    memberPct >= 75 || storagePct >= 75 || projectPct >= 75 || automationPct >= 75;

  const limits: LimitCardProps[] = [
    {
      icon:       Users,
      label:      "Members",
      current:    planLimits.memberCount,
      max:        planLimits.memberLimit,
      percentage: memberPct,
    },
    {
      icon:       HardDrive,
      label:      "Storage",
      current:    Math.round(planLimits.storageUsedMB),
      max:        planLimits.storageLimitMB,
      unit:       "MB",
      percentage: storagePct,
    },
    {
      icon:       Folder,
      label:      "Projects",
      current:    planLimits.projectCount,
      max:        planLimits.projectLimit,
      percentage: projectPct,
    },
    {
      icon:       Zap,
      label:      "Automations",
      current:    planLimits.automationCount,
      max:        planLimits.automationLimit,
      percentage: automationPct,
    },
  ];

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            Plan Limits
          </h2>
          <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2 py-1 rounded-full">
            <Crown className="w-3 h-3" />
            <span className="text-xs font-medium">{planLimits.currentPlan}</span>
          </div>
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

      {/* Warning banner when nearing limits */}
      {hasWarnings && (
        <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-amber-50 dark:bg-amber-900/20 shrink-0">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground mb-1">
                You&apos;re approaching your plan limits
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                Upgrade to continue using all features without interruption.
              </p>
              <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1">
                {["Unlimited storage", "More team members", "Advanced features", "Priority support"].map(
                  (benefit) => (
                    <span
                      key={benefit}
                      className="text-xs text-muted-foreground flex items-center gap-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                      {benefit}
                    </span>
                  )
                )}
              </div>
            </div>
            <button className="shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors w-full sm:w-auto text-center">
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* Upsell CTA for FREE plan when not yet at limits */}
      {planLimits.currentPlan === "FREE" && !hasWarnings && (
        <div className="bg-linear-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-primary/10 shrink-0">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Unlock More with Pro
              </h3>
              <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1">
                {["50 team members", "5 GB storage", "Unlimited projects", "50 automations"].map(
                  (benefit) => (
                    <span
                      key={benefit}
                      className="text-xs text-muted-foreground flex items-center gap-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                      {benefit}
                    </span>
                  )
                )}
              </div>
            </div>
            <Link href={'/pricing'} className="shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors w-full sm:w-auto text-center">
              Learn More
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}