'use client';

import { useParams } from 'next/navigation';
import { useWorkspacePlan } from '@/context/workspacePlan/WorkspacePlanContext';
import { useWorkspace } from '@/hooks/useWorkspace';
import { AnalyticsPage } from '@/components/Dashboard/Workspaces/Analytics/AnalyticsPage';
import { UpgradePlanCard } from '@/components/Shared/UpgradePlanCard';

export default function WorkspaceAnalyticsPage() {
  const params = useParams();
  const workspaceSlug = params.workspaceSlug as string;

  const { isFree, isLoading } = useWorkspacePlan();
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

  return <AnalyticsPage workspaceId={workspace!.id} />;
}