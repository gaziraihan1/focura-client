// app/analytics/[workspaceId]/workspace-usage/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Loader2, AlertCircle } from "lucide-react";
import { useWorkspaceUsage } from "@/hooks/useWorkspaceUsage";
import { WorkspaceUsageHeader } from "@/components/Dashboard/Analytics/WorkspaceUsage/WorkspaceUsageHeader";
import { UsageSnapshot } from "@/components/Dashboard/Analytics/WorkspaceUsage/UsageSnapshot";
import { PlanLimitsSection } from "@/components/Dashboard/Analytics/WorkspaceUsage/PlanLimitsSection";
import type { DateRangeFilter } from "@/types/workspace-usage.types";
import { useWorkspaces } from "@/hooks/useWorkspace";

const EngagementSection = dynamic(
  () => import("@/components/Dashboard/Analytics/WorkspaceUsage/EngagementSection").then((m) => m.EngagementSection),
  { ssr: false }
);

const StorageResourcesSection = dynamic(
  () => import("@/components/Dashboard/Analytics/WorkspaceUsage/StorageResourcesSection").then((m) => m.StorageResourcesSection),
  { ssr: false }
);

const FeatureUsageSection = dynamic(
  () => import("@/components/Dashboard/Analytics/WorkspaceUsage/FeatureUsageSection").then((m) => m.FeatureUsageSection),
  { ssr: false }
);

const GrowthInsightsSection = dynamic(
  () => import("@/components/Dashboard/Analytics/WorkspaceUsage/GrowthInsightsSection").then((m) => m.GrowthInsightsSection),
  { ssr: false }
);

export default function WorkspaceUsagePage() {
  const { workspaceSlug } = useParams();
  const { data: workspaces } = useWorkspaces();
  const workspace = workspaces?.find((w) => w.slug === workspaceSlug);
  const workspaceId = workspace?.id;

  const [dateRange, setDateRange] = useState<DateRangeFilter>("30d");

  const { data, isLoading, isError, refetch } = useWorkspaceUsage(
    workspaceId as string
  );

  const handleExportCSV = () => {
    console.log("Exporting CSV...");
  };

  // ─── Loading State ────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading workspace data…</p>
      </div>
    );
  }

  // ─── Error State ──────────────────────────────────────────────
  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <div className="text-center">
          <h2 className="text-base font-semibold text-foreground">
            Failed to load workspace usage
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Please try again or contact support if the issue persists.
          </p>
        </div>
        <button
          onClick={() => refetch?.()}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ─── Page ─────────────────────────────────────────────────────
  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-8 px-2 sm:px-0">
        <WorkspaceUsageHeader
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onExport={handleExportCSV}
        />

        <UsageSnapshot data={data} />

        {data.isAdmin && (
          <EngagementSection
            userEngagement={data.userEngagement}
            projectActivity={data.projectActivity}
          />
        )}

        <StorageResourcesSection resourceUsage={data.resourceUsage} />

        <FeatureUsageSection
          workspaceGrowth={data.workspaceGrowth}
          projectActivity={data.projectActivity}
        />

        <PlanLimitsSection
          resourceUsage={data.resourceUsage}
          workspaceGrowth={data.workspaceGrowth}
        />

        <GrowthInsightsSection workspaceGrowth={data.workspaceGrowth} />
      </div>
  );
}