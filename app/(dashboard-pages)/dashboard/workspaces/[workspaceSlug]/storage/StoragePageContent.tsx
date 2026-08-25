"use client";

import { useWorkspace } from "@/hooks/useWorkspace";
import { useWorkspacePlan } from "@/context/workspacePlan/WorkspacePlanContext";
import { WorkspaceStorageOverviewPage } from "@/components/dashboard/storage/overview/WorkspaceStorageOverviewPage";
import { UpgradePlanCard } from "@/components/shared/UpgradePlanCard";

interface StoragePageContentProps {
  workspaceSlug: string;
}

export function StoragePageContent({ workspaceSlug }: StoragePageContentProps) {
  const { isFree, isPro, isLoading: isPlanLoading } = useWorkspacePlan();
  const { data: workspace } = useWorkspace(workspaceSlug);

  if (isPlanLoading) return null;

  if (isFree) {
    return (
      <UpgradePlanCard
        feature="Storage"
        description="Monitor your workspace storage usage, manage files, and get insights into what's taking up space across your projects."
      />
    );
  }

  return (
    <div className="space-y-6 min-w-0">
      <WorkspaceStorageOverviewPage workspaceId={workspace?.id ?? ""} isPro={isPro} />
    </div>
  );
}
