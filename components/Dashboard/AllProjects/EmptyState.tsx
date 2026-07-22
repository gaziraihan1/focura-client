"use client";

import { motion } from "framer-motion";
import { FolderKanban } from "lucide-react";
import { EmptyState as SharedEmptyState } from "@/components/Shared/EmptyState";

interface EmptyStateProps {
  hasSearchOrFilters: boolean;
  onBrowseWorkspaces: () => void;
}

export function EmptyState({ hasSearchOrFilters, onBrowseWorkspaces }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="text-center py-20 rounded-2xl bg-card border border-dashed border-border"
    >
      <SharedEmptyState
        icon={FolderKanban}
        title={
          hasSearchOrFilters
            ? "No projects match your search"
            : "No projects yet"
        }
        description={
          hasSearchOrFilters
            ? "Try adjusting your search terms or filters to find what you're looking for"
            : "Get started by joining a workspace or creating your first project"
        }
        action={
          !hasSearchOrFilters
            ? { label: "Browse Workspaces", onClick: onBrowseWorkspaces }
            : undefined
        }
      />
    </motion.div>
  );
}
