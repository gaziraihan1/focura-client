// hooks/useFileManagementPage.ts

export interface FileManagementPageProps {
  workspaceId: string;
  selectedWorkspaceId?: string;
  setSelectedWorkspaceId?: (id: string) => void;
}

export type ViewMode = 'grid' | 'list';

export interface FileManagementState {
  filters: FileFilters;
  viewMode: ViewMode;
}
import { useState, useCallback } from 'react';
import {
  useFiles,
  useFileStats,
  useUploaders,
  FileFilters,
} from '@/hooks/useFileManagement';

export function useFileManagementPage(workspaceId: string) {
  const [filters, setFilters] = useState<FileFilters>({
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 50,
  });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const { data, isLoading, error, refetch } = useFiles(workspaceId, filters);
  const { data: stats } = useFileStats(workspaceId);
  const { data: uploaders } = useUploaders(
    workspaceId,
    data?.isAdmin || false
  );

  const handleFiltersChange = useCallback((newFilters: FileFilters) => {
    setFilters(newFilters);
  }, []);

  const loadMore = useCallback(() => {
    setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }));
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    // State
    filters,
    viewMode,
    setViewMode,

    // Data
    data,
    stats,
    uploaders,
    isLoading,
    error,

    // Handlers
    handleFiltersChange,
    loadMore,
    handleRetry,
  };
}

