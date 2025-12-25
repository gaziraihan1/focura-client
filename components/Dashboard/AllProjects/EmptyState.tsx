// components/Projects/EmptyState.tsx
"use client";

import { motion } from "framer-motion";
import { FolderKanban } from "lucide-react";

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
      <FolderKanban className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
      <h3 className="text-2xl font-bold text-foreground mb-3">
        {hasSearchOrFilters
          ? "No projects match your search"
          : "No projects yet"}
      </h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        {hasSearchOrFilters
          ? "Try adjusting your search terms or filters to find what you're looking for"
          : "Get started by joining a workspace or creating your first project"}
      </p>
      {!hasSearchOrFilters && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBrowseWorkspaces}
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition shadow-lg shadow-primary/20 font-medium"
        >
          Browse Workspaces
        </motion.button>
      )}
    </motion.div>
  );
}