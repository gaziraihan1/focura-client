'use client';

import { useParams } from 'next/navigation';
import { useWorkspace } from '@/hooks/useWorkspace';
import { AnalyticsPage } from '@/components/Dashboard/Workspaces/Analytics/AnalyticsPage';
import LoadingAnalytics from '@/components/Dashboard/Workspaces/Analytics/LoadingAnalytics';

export default function WorkspaceAnalyticsPage() {
  const params = useParams();
  const workspaceSlug = params.workspaceSlug as string;
  const { data: workspace, isLoading } = useWorkspace(workspaceSlug);
  const workspaceId = workspace?.id;

  if (isLoading || !workspaceId) {
    <LoadingAnalytics />
  }

  return <AnalyticsPage workspaceId={workspaceId!} />;
}