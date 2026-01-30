import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useActivities,
  useClearActivities,
  activityKeys,
} from "@/hooks/useActivity";

export interface ActivityFilterValues {
  entityType?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

interface UseActivityPageProps {
  workspaceId: string;
}

export function useActivityPage({ workspaceId }: UseActivityPageProps) {
  const [filters, setFilters] = useState<ActivityFilterValues>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const queryClient = useQueryClient();
  const clearActivities = useClearActivities();

  const mergedFilters = {
    ...filters,
    workspaceId,
    limit: 50,
  };

  const { data: activities, isLoading, error } = useActivities(mergedFilters);

  const handleClearActivities = async () => {
    try {
      await clearActivities.mutateAsync({ workspaceId });
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Failed to clear activities:", error);
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: activityKeys.all });
  };

  return {
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
  };
}