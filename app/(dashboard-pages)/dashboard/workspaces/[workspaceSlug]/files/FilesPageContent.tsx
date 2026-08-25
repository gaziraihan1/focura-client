"use client";

import { FileManagementPage } from "@/components/dashboard/storage/files/FileManagementPage";
import { useWorkspace } from "@/hooks/useWorkspace";

interface FilesPageContentProps {
  workspaceSlug: string;
}

export function FilesPageContent({ workspaceSlug }: FilesPageContentProps) {
  const { data } = useWorkspace(workspaceSlug);
  const workspaceId = data?.id || "";

  return <FileManagementPage workspaceId={workspaceId} />;
}
