"use client";

import { m as motion } from "framer-motion";
import { FolderKanban } from "lucide-react";
import { EmptyState as SharedEmptyState } from "@/components/shared/EmptyState";

interface ProjectsEmptyStateProps {
  /** Whether a search query or filters are active (changes title/description) */
  hasSearchQuery: boolean;
  /** "page" = animated dashed-border card (all-projects), "panel" = compact solid card (workspace projects) */
  variant?: "page" | "panel";
  /** Override the default description for the current variant/search state */
  description?: string;
  /** Optional action button; pass `undefined` to hide */
  action?: { label: string; onClick: () => void };
}

const DEFAULT_DESCRIPTIONS = {
  page: {
    filtered:
      "Try adjusting your search terms or filters to find what you're looking for",
    empty: "Get started by joining a workspace or creating your first project",
  },
  panel: {
    filtered: "Try a different search",
    empty: "Create your first project to get started",
  },
} as const;

export function ProjectsEmptyState({
  hasSearchQuery,
  variant = "page",
  description,
  action,
}: ProjectsEmptyStateProps) {
  const isPage = variant === "page";
  const resolvedDescription =
    description ??
    (isPage
      ? hasSearchQuery
        ? DEFAULT_DESCRIPTIONS.page.filtered
        : DEFAULT_DESCRIPTIONS.page.empty
      : hasSearchQuery
        ? DEFAULT_DESCRIPTIONS.panel.filtered
        : DEFAULT_DESCRIPTIONS.panel.empty);

  const content = (
    <SharedEmptyState
      icon={FolderKanban}
      title={hasSearchQuery ? "No projects match your search" : "No projects yet"}
      description={resolvedDescription}
      action={hasSearchQuery ? undefined : action}
    />
  );

  if (!isPage) {
    return (
      <div className="text-center py-12 rounded-xl bg-card border border-border">
        {content}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="text-center py-20 rounded-2xl bg-card border border-dashed border-border"
    >
      {content}
    </motion.div>
  );
}
