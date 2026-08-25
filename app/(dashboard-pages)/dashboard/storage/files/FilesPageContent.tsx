"use client";

import { FileManagementPage } from "@/components/dashboard/storage/files/FileManagementPage";
import { useWorkspacesSummary } from "@/hooks/useStorage";
import { useState } from "react";

export function FilesPageContent() {
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
