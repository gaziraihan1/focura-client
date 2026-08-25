"use client";

import { ActivityFilters } from "@/components/dashboard/activity-logs/ActivityFilters";
import { ActivityPageHeader } from "@/components/dashboard/activity-logs/ActivityPageHeader";
import { ActivityContent } from "@/components/dashboard/activity-logs/ActivityContent";
import { ClearActivitiesDialog } from "@/components/dashboard/activity-logs/ClearActivitiesDialog";
import { useActivityPage } from "@/hooks/useActivityPage";

interface ActivityPageContentProps {
  workspaceId: string;
}

export function ActivityPageContent({ workspaceId }: ActivityPageContentProps) {
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
    <div className="mx-auto max-w-5xl space-y-6">
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
