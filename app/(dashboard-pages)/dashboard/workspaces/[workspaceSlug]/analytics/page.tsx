'use client';

import { useWorkspacePlan } from '@/context/workspacePlan/WorkspacePlanContext';
import { useWorkspace } from '@/hooks/useWorkspace';
import { AnalyticsPage } from '@/components/dashboard/workspace/analytics/AnalyticsPage';
import { UpgradePlanCard } from '@/components/shared/UpgradePlanCard';
import { useWorkspaceSlug } from '@/hooks/useRouteParams';

export default function WorkspaceAnalyticsPage() {
  const workspaceSlug = useWorkspaceSlug();

  const { isFree, isPro, isLoading } = useWorkspacePlan();
  const { data: workspace } = useWorkspace(workspaceSlug); // already cached, no extra fetch

  if (isLoading) return null; // layout already shows loading, no double spinner

  if (isFree) {
    return (
      <UpgradePlanCard
        feature="Analytics"
        description="Get deep insights into your workspace activity, team performance, and project progress."
      />
    );
  }

  return <AnalyticsPage workspaceId={workspace!.id} isPro={isPro} />;
}