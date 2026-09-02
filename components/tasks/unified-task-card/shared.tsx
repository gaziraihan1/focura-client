"use client";

// Re-export all building blocks from their dedicated modules.
// This file is kept for backward compatibility — new code should import
// directly from ./badges or ./building-blocks.

export {
  SimplePriorityBadge,
  StatusBadge,
  PriorityBadgeWithIcon,
  TaskMeta,
} from "./badges";

export {
  StatusOrb,
  TitleBlock,
  ProjectPill,
  StatusPill,
  EngagementCounts,
  TaskChipsRow,
  AssigneeStack,
  ProgressAndAssignees,
} from "./building-blocks";
