"use client"
import { FileManagementPage } from '@/components/Dashboard/Storage/Files/FileManagementPage';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useParams } from 'next/navigation';

export default function WorkspaceFilesPage() {
  const params = useParams();
  const workspaceSlug = params.workspaceSlug as string;
  const {data} = useWorkspace(workspaceSlug)

  const workspaceId = data?.id || "";
  
  return (
    <FileManagementPage
      workspaceId={workspaceId} 
    />
  );
}