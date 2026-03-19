// components/StorageOverview/StorageOverviewPage.tsx
'use client';

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
import { StorageTrendChart } from './StorageTrendChart';
import { LargestFilesTable } from './LargestFilesTable';
import { PlanComparison } from './PlanComparison';

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

      {/* My Contribution */}
      <MyContributionCard
        contribution={data.myContribution}
        workspaceName={data.storageInfo.workspaceName}
      />

      {/* User Contributions (Admin Only) */}
      {data.isAdmin && data.userContributions && (
        <UserContributionsTable
          contributions={data.userContributions}
          totalStorageMB={data.storageInfo.usedMB}
        />
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StorageBreakdownChart breakdown={data.breakdown} />
        <StorageTrendChart trend={data.trend} />
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