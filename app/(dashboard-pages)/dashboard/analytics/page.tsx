"use client"
import { AnalyticsPage } from '@/components/Dashboard/Workspaces/Analytics/AnalyticsPage';
import { useWorkspaces } from '@/hooks/useWorkspace';
import { useState } from 'react';

export default function Analytics() {
  const { data: workspaces } = useWorkspaces();
  const firstWorkspaceId = workspaces?.[0]?.id;
  
  // Initialize with undefined, then use firstWorkspaceId as fallback
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | undefined>(undefined);
  
  // Use the selected workspace or fall back to the first one
  const workspaceId = selectedWorkspaceId || firstWorkspaceId || '';
  
  return (
    <AnalyticsPage 
      workspaceId={workspaceId} 
      selectedWorkspaceId={workspaceId} 
      setSelectedWorkspaceId={setSelectedWorkspaceId}
    />
  );
}