"use client";

import { Plus, Tag } from "lucide-react";
import { EmptyState as SharedEmptyState } from "@/components/Shared/EmptyState";

export interface LabelsEmptyStateProps {
  searchQuery: string;
  onCreateLabel: () => void;
}

export function LabelsEmptyState({
  searchQuery,
  onCreateLabel,
}: LabelsEmptyStateProps) {
  const isSearching = Boolean(searchQuery);

  return (
    <div className="bg-card rounded-lg border border-border p-12 text-center">
      <SharedEmptyState
        icon={Tag}
        title={isSearching ? "No labels found" : "No labels yet"}
        description={
          isSearching
            ? "Try adjusting your search query"
            : "Create your first label to organize your tasks"
        }
        action={
          !isSearching
            ? { label: "Create Label", onClick: onCreateLabel }
            : undefined
        }
      />
    </div>
  );
}
