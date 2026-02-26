'use client';

import { HardDrive, AlertTriangle, Shield, Users, Loader2 } from 'lucide-react';
import { useWorkspaceStorageOverview } from '@/hooks/useStorage';
import { useStorageWarning } from '@/hooks/useStoragePage';
import { StorageSummaryCards } from './StorageSummaryCards';
import { MyContributionCard } from './MyContributionCard';
import { UserContributionsTable } from './UserContributionsTable';
import { StorageBreakdownChart } from './StorageBreakdownChart';
import { StorageTrendChart } from './StorageTrendChart';
import { LargestFilesTable } from './LargestFilesTable';
import { PlanComparison } from './PlanComparison';

interface WorkspaceStoragePageProps {
  workspaceId: string;
}

export function WorkspaceStorageOverviewPage({ workspaceId }: WorkspaceStoragePageProps) {
  const { data, isLoading, error } = useWorkspaceStorageOverview(workspaceId);
  const warning = useStorageWarning(data?.storageInfo);

  // Show loading for workspace data
  if (isLoading) {
    return (
      <div className="space-y-8 pb-8">
        {/* Header */}
        <div className="flex-1">
          <h1 className="text-3xl font-semibold tracking-tight">Storage Overview</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage workspace file storage
          </p>
        </div>

        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading storage data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-8 pb-8">
        {/* Header */}
        <div className="flex-1">
          <h1 className="text-3xl font-semibold tracking-tight">Storage Overview</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage workspace file storage
          </p>
        </div>

        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-4 text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-destructive" />
            <div>
              <h3 className="text-lg font-semibold">Failed to load storage data</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {error?.message ||
                  "There was an error loading storage information."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <HardDrive className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Storage Overview</h1>
              <p className="text-muted-foreground mt-1">
                {data.storageInfo.workspaceName}
              </p>
            </div>
          </div>
        </div>
        
        {/* Role Badge */}
        {data.isAdmin ? (
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
              Admin View
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 bg-muted border rounded-lg">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Member</span>
          </div>
        )}
      </div>

      {/* Warning Banner */}
      {warning.level !== 'normal' && warning.message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-lg border ${
            warning.level === 'critical'
              ? 'bg-destructive/10 border-destructive/30 text-destructive'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-500'
          }`}
        >
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{warning.message}</p>
        </div>
      )}

      {/* Summary Cards */}
      <StorageSummaryCards storageInfo={data.storageInfo} />

      {/* My Contribution Card (Always Visible) */}
      <MyContributionCard
        contribution={data.myContribution}
        workspaceName={data.storageInfo.workspaceName}
      />

      {/* User Contributions Table (Admin Only) */}
      {data.isAdmin && data.userContributions && (
        <UserContributionsTable
          contributions={data.userContributions}
          totalStorageMB={data.storageInfo.usedMB}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breakdown Chart */}
        <StorageBreakdownChart breakdown={data.breakdown} />

        {/* Trend Chart */}
        <StorageTrendChart trend={data.trend} />
      </div>

      {/* Largest Files */}
      <LargestFilesTable
        files={data.largestFiles}
        workspaceId={workspaceId}
        isAdmin={data.isAdmin}
      />

      {/* Plan Comparison */}
      <PlanComparison
        currentPlan={data.storageInfo.plan}
        workspaceName={data.storageInfo.workspaceName}
      />
    </div>
  );
}