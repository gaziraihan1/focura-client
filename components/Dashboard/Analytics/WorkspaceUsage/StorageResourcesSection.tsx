// components/Analytics/WorkspaceUsage/StorageResourcesSection.tsx
"use client";

import { HardDrive, AlertTriangle } from "lucide-react";
import type { ResourceUsageMetrics } from "@/types/workspace-usage.types";
import {
  StorageUsageCard,
  TotalFilesCard,
  StorageGrowthChart,
  TopProjectsChart,
  FileTypeDistribution,
} from "./StorageResourcesSectionParts";

interface StorageResourcesSectionProps {
  resourceUsage: ResourceUsageMetrics;
}

export function StorageResourcesSection({
  resourceUsage,
}: StorageResourcesSectionProps) {
  const { totalStorage, storageByProject, filesByUser } = resourceUsage;

  const totalFiles = filesByUser.reduce((sum, u) => sum + u.fileCount, 0);

  const storageGrowthData = [
    { month: "Jan", storage: 800 },
    { month: "Feb", storage: 1200 },
    { month: "Mar", storage: 1800 },
    { month: "Apr", storage: 2100 },
    { month: "May", storage: 2300 },
    { month: "Jun", storage: totalStorage.usedMB },
  ];

  const isCritical = totalStorage.percentage >= 90;
  const isWarning = totalStorage.percentage >= 75;

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <HardDrive className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Storage & Resources</h2>
      </div>

      {isCritical && (
        <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-destructive/10 border border-destructive/40">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-destructive">
                Storage Critical — {totalStorage.percentage}% used
              </p>
              <p className="text-xs text-destructive/80 mt-0.5">
                Upgrade your plan to avoid service interruption.
              </p>
            </div>
          </div>
          <button className="shrink-0 px-3 py-1.5 rounded-lg bg-destructive text-white text-xs font-semibold hover:bg-destructive/90 transition-colors w-full sm:w-auto text-center">
            Upgrade
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <StorageUsageCard
          totalStorage={totalStorage}
          isCritical={isCritical}
          isWarning={isWarning}
        />
        <TotalFilesCard totalFiles={totalFiles} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <StorageGrowthChart data={storageGrowthData} />
        <TopProjectsChart storageByProject={storageByProject} />
      </div>

      <FileTypeDistribution />
    </section>
  );
}
