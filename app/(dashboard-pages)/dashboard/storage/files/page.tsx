"use client"
import { FileManagementPage } from '@/components/Dashboard/Storage/Files/FileManagementPage';
import { useWorkspacesSummary } from '@/hooks/useStorage';
import { useState } from 'react';

export default function FilesPage() {
  const { data: workspaces } = useWorkspacesSummary();
  const firstWorkspaceId = workspaces?.[0].workspaceId;
  
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | undefined>(undefined);
  
  const workspaceId = selectedWorkspaceId || firstWorkspaceId || '';
  
  return (
    <FileManagementPage
      workspaceId={workspaceId} 
      selectedWorkspaceId={workspaceId} 
      setSelectedWorkspaceId={setSelectedWorkspaceId}
    />
  );
}