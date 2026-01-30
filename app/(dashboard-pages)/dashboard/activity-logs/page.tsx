"use client";

import { ActivityFilters } from "@/components/Dashboard/ActivityLogs/ActivityFilters";
import { ActivityPageHeader } from "@/components/Dashboard/ActivityLogs/ActivityPageHeader";
import { ActivityContent } from "@/components/Dashboard/ActivityLogs/ActivityContent";
import { ClearActivitiesDialog } from "@/components/Dashboard/ActivityLogs/ClearActivitiesDialog";
import { useActivityPage } from "@/hooks/useActivityPage";

interface ActivityPageProps {
  workspaceId: string;
}

export default function ActivityPage({ workspaceId }: ActivityPageProps) {
  const {
    filters,
    setFilters,
    showDeleteDialog,
    setShowDeleteDialog,
    activities,
    isLoading,
    error,
    clearActivities,
    handleClearActivities,
    handleRefresh,
  } = useActivityPage({ workspaceId });

  return (
    <div className="container max-w-7xl space-y-8 py-8">
      <ActivityPageHeader
        onRefresh={handleRefresh}
        onClearAll={() => setShowDeleteDialog(true)}
      />

      <ActivityFilters
        filters={filters}
        onFiltersChange={setFilters}
        showDateFilters
      />

      <ActivityContent
        activities={activities}
        isLoading={isLoading}
        error={error}
      />

      <ClearActivitiesDialog
        isOpen={showDeleteDialog}
        isPending={clearActivities.isPending}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleClearActivities}
      />
    </div>
  );
}