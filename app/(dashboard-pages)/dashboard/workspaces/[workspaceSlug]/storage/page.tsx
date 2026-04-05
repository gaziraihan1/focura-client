"use client";

import { useParams } from "next/navigation";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useWorkspacePlan } from "@/context/workspacePlan/WorkspacePlanContext";
import { WorkspaceStorageOverviewPage } from "@/components/Dashboard/Storage/WorkspaceStorageOverviewPage";
import { UpgradePlanCard } from "@/components/Shared/UpgradePlanCard";

export default function WorkspaceStorage() {
  const params = useParams();
  const workspaceSlug = params.workspaceSlug as string;

  const { isFree, isLoading: isPlanLoading } = useWorkspacePlan();
  const { data: workspace } = useWorkspace(workspaceSlug); // already cached, no extra fetch

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
      <WorkspaceStorageOverviewPage workspaceId={workspace?.id ?? ""} />
    </div>
  );
}