"use client";

import { motion } from "framer-motion";
import { Plus, Tag } from "lucide-react";

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
      <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />

      <h3 className="text-lg font-medium text-foreground mb-2">
        {isSearching ? "No labels found" : "No labels yet"}
      </h3>

      <p className="text-muted-foreground mb-4">
        {isSearching
          ? "Try adjusting your search query"
          : "Create your first label to organize your tasks"}
      </p>

      {!isSearching && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateLabel}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Create Label</span>
        </motion.button>
      )}
    </div>
  );
}
