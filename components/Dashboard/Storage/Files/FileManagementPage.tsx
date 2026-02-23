'use client';

import { FileManagementPageProps, useFileManagementPage } from '@/hooks/useFileManagemetPage';
import { FileFiltersComponent } from './FileFilters';
import { FileGrid } from './FileGrid';
import { LoadingState } from './FileManagementPage/LoadingState';
import { ErrorState } from './FileManagementPage/ErrorState';
import { PageHeader } from './FileManagementPage/PageHeader';
import { FileCountInfo } from './FileManagementPage/FileCountInfo';
import { FileTypeStats } from './FileTypeStats';
import { LoadMoreButton } from './FileManagementPage/LoadMoreButton';

export function FileManagementPage({
  workspaceId,
  selectedWorkspaceId,
  setSelectedWorkspaceId,
}: FileManagementPageProps) {
  const {
    filters,
    viewMode,
    setViewMode,
    data,
    stats,
    uploaders,
    isLoading,
    error,
    handleFiltersChange,
    loadMore,
    handleRetry,
  } = useFileManagementPage(workspaceId);

  if (!data) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        isAdmin={data?.isAdmin || false}
        selectedWorkspaceId={selectedWorkspaceId}
        setSelectedWorkspaceId={setSelectedWorkspaceId}
      />

      {data && (
        <FileCountInfo
          filesCount={data.files.length}
          totalCount={data.total}
          isAdmin={data.isAdmin}
          onRefresh={handleRetry}
        />
      )}

      {stats && stats.length > 0 && <FileTypeStats stats={stats} />}

      <FileFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        uploaders={uploaders || []}
        isAdmin={data?.isAdmin || false}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <FileGrid
        files={data?.files || []}
        isAdmin={data?.isAdmin || false}
        viewMode={viewMode}
        workspaceId={workspaceId}
      />

      <LoadMoreButton
        hasMore={data?.hasMore || false}
        isLoading={isLoading}
        onLoadMore={loadMore}
      />
    </div>
  );
}