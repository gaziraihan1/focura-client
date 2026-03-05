'use client';

import { useState } from 'react';
import { useWorkspaces } from '@/hooks/useWorkspace';
import { AnalyticsPage } from '@/components/Dashboard/Workspaces/Analytics/AnalyticsPage';
import LoadingAnalytics from '@/components/Dashboard/Workspaces/Analytics/LoadingAnalytics';

export default function Analytics() {
  const { data: workspaces, isLoading: workspacesLoading } = useWorkspaces();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | undefined>(undefined);

  const workspaceId = selectedWorkspaceId || workspaces?.[0]?.id;

  if (workspacesLoading || !workspaceId) {
    <LoadingAnalytics />
  }

  return (
    <AnalyticsPage
      workspaceId={workspaceId!}
      selectedWorkspaceId={workspaceId}
      setSelectedWorkspaceId={setSelectedWorkspaceId}
    />
  );
}