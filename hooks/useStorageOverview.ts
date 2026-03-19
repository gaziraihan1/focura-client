// hooks/useStorageOverview.ts
import { useState, useMemo } from 'react';
import {
  useWorkspaceStorageOverview,
  useWorkspacesSummary,
} from '@/hooks/useStorage';
import { useStorageWarning } from '@/hooks/useStoragePage';

export function useStorageOverview() {
  const { data: workspaces, isLoading: loadingWorkspaces } =
    useWorkspacesSummary();

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('');

  const firstWorkspaceId = workspaces?.[0]?.workspaceId;
  const currentWorkspaceId = selectedWorkspaceId || firstWorkspaceId || '';

  const { data, isLoading, error } =
    useWorkspaceStorageOverview(currentWorkspaceId);

  const warning = useStorageWarning(data?.storageInfo);

  const hasWorkspaces = useMemo(
    () => workspaces && workspaces.length > 0,
    [workspaces]
  );

  return {
    // Workspaces
    workspaces,
    loadingWorkspaces,
    hasWorkspaces,

    // Selected workspace
    selectedWorkspaceId,
    setSelectedWorkspaceId,
    currentWorkspaceId,

    // Storage data
    data,
    isLoading,
    error,

    // Warning
    warning,
  };
}