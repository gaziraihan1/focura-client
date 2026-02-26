"use client"
import { WorkspaceStorageOverviewPage } from '@/components/Dashboard/Storage/WorkspaceStorageOverviewPage';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useParams } from 'next/navigation';

export default function WorkspaceStorage() {
  const params = useParams();
  const workspaceSlug = params.workspaceSlug as string;
  const { data: workspace } = useWorkspace(workspaceSlug);
  const workspaceId = workspace?.id || "";
  
  return <WorkspaceStorageOverviewPage workspaceId={workspaceId} />;
}