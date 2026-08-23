// components/StorageOverview/StorageOverviewPage.tsx
'use client';

import dynamic from 'next/dynamic';
import { useStorageOverview } from '@/hooks/useStorageOverview';
import { LoadingState } from './StorageOverviewPage/LoadingState';
import { EmptyState } from './StorageOverviewPage/EmptyState';
import { ErrorState } from './StorageOverviewPage/ErrorState';
import { PageHeader } from './StorageOverviewPage/PageHeader';
import { StorageWarningBanner } from './StorageOverviewPage/StorageWarningBanner';
import { StorageSummaryCards } from './StorageSummaryCards';
import { MyContributionCard } from './MyContributionCard';
import { UserContributionsTable } from './UserContributionsTable';
import { StorageBreakdownChart } from './StorageBreakdownChart';
import { LargestFilesTable } from './LargestFilesTable';
import { PlanComparison } from './PlanComparison';

const StorageTrendChart = dynamic(
  () => import('./StorageTrendChart').then((m) => m.StorageTrendChart),
  { ssr: false }
);
const FileTypeChart = dynamic(
  () => import('./FileTypeChart').then((m) => m.FileTypeChart),
  { ssr: false }
);

export function StorageOverviewPage() {
  const {
    loadingWorkspaces,
    hasWorkspaces,
    selectedWorkspaceId,
    setSelectedWorkspaceId,
    currentWorkspaceId,
    data,
    isLoading,
    error,
    warning,
  } = useStorageOverview();

  // Loading workspaces
  if (loadingWorkspaces) {
    return <LoadingState message="Loading workspaces..." />;
  }

  // No workspaces
  if (!hasWorkspaces) {
    return <EmptyState />;
  }

  // Loading storage data
  if (isLoading) {
    return (
      <div className="space-y-8 pb-8">
        <PageHeader
          selectedWorkspaceId={selectedWorkspaceId}
          isAdmin={false}
          onWorkspaceChange={setSelectedWorkspaceId}
        />
        <LoadingState message="Loading storage data..." />
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="space-y-8 pb-8">
        <PageHeader
          selectedWorkspaceId={selectedWorkspaceId}
          isAdmin={false}
          onWorkspaceChange={setSelectedWorkspaceId}
        />
        <ErrorState error={error} />
      </div>
    );
  }

  // Main content
  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <PageHeader
        selectedWorkspaceId={selectedWorkspaceId}
        isAdmin={data.isAdmin}
        onWorkspaceChange={setSelectedWorkspaceId}
      />

      {/* Warning Banner */}
      <StorageWarningBanner warning={warning} />

      {/* Storage Summary */}
      <StorageSummaryCards storageInfo={data.storageInfo} />

      {/* User Contributions (Admin Only) */}
      {data.isAdmin && data.userContributions && (
        <UserContributionsTable
          contributions={data.userContributions}
          totalStorageMB={data.storageInfo.usedMB}
        />
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StorageBreakdownChart breakdown={data.breakdown} />
        </div>

        <div className="lg:col-span-2">
          <StorageTrendChart trend={data.trend} />
        </div>

        <div className="lg:col-span-1">
          <FileTypeChart types={data.fileTypes ?? []} />
        </div>

        <div className="lg:col-span-2">
          <MyContributionCard
            contribution={data.myContribution}
            workspaceName={data.storageInfo.workspaceName}
          />
        </div>
      </div>

      {/* Largest Files */}
      <LargestFilesTable
        files={data.largestFiles}
        workspaceId={currentWorkspaceId}
        isAdmin={data.isAdmin}
      />

      {/* Plan Comparison (Admin Only) */}
      {data.isAdmin && (
        <PlanComparison
          currentPlan={data.storageInfo.plan}
          workspaceName={data.storageInfo.workspaceName}
        />
      )}
    </div>
  );
}