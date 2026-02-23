"use client"
import { AnalyticsPage } from '@/components/Dashboard/Workspaces/Analytics/AnalyticsPage';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useParams } from 'next/navigation';

export default function WorkspaceAnalyticsPage() {
  const params = useParams();
  const workspaceSlug = params.workspaceSlug as string;
  const { data: workspace } = useWorkspace(workspaceSlug);
  const workspaceId = workspace?.id || "";
  
  return (
    <AnalyticsPage workspaceId={workspaceId} />
  );
}