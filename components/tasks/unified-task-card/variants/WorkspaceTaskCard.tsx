"use client";

import Link from "next/link";
import { Flag } from "lucide-react";
import { getPriorityColor } from "@/utils/task.utils";
import type { Task } from "@/hooks/useTask";
import {
  StatusOrb,
  TitleBlock,
  TaskChipsRow,
  ProgressAndAssignees,
} from "../shared";
import { RichCardShell } from "./DetailedTaskCard";

export interface WorkspaceTaskCardProps {
  task: Task;
  cardHref: string;
  isCompleted: boolean;
  progress: number | null;
  showDescription: boolean;
  showProject: boolean;
  showAssignees: boolean;
  showTimeTracking: boolean;
  showEngagementCounts: boolean;
  showStatusPill: boolean;
  showPriorityFlag: boolean;
  className?: string;

  // Add-to-daily/secondary buttons
  showButtons: boolean;
  onPrimaryClick: (e: React.MouseEvent) => void;
  onSecondaryClick: (e: React.MouseEvent) => void;
  primaryDisabled: boolean;
  secondaryDisabled: boolean;
  isPrimaryLoading: boolean;
  isSecondaryLoading: boolean;
  isPrimaryDisabled?: boolean;
  isInPrimary?: boolean;
  isInSecondary?: boolean;
}

/** Workspace tasks card with optional add buttons — original source:
 * components/Dashboard/AllTasks/WorkspaceTasks/TaskCard.tsx */
export function WorkspaceTaskCard({
  task,
  cardHref,
  isCompleted,
  progress,
  showDescription,
  showProject,
  showAssignees,
  showTimeTracking,
  showEngagementCounts,
  showStatusPill,
  showPriorityFlag,
  className = "",
  showButtons,
  onPrimaryClick,
  onSecondaryClick,
  primaryDisabled,
  secondaryDisabled,
  isPrimaryLoading,
  isSecondaryLoading,
  isPrimaryDisabled = false,
  isInPrimary = false,
  isInSecondary = false,
}: WorkspaceTaskCardProps) {
  return (
    <Link href={cardHref}>
      <RichCardShell completed={isCompleted} className={className}>
        <div className="p-4 sm:p-5">
          {/* Header */}
          <div className="flex items-start gap-3">
            <StatusOrb status={task.status} />
            <TitleBlock
              title={task.title}
              description={task.description}
              completed={isCompleted}
              showDescription={showDescription}
            />
            {showPriorityFlag && (
              <Flag
                size={16}
                strokeWidth={2.2}
                className={`${getPriorityColor(task.priority)} shrink-0 mt-0.5`}
              />
            )}
          </div>

          {/* Add buttons (if enabled) */}
          {showButtons && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={onPrimaryClick}
                disabled={primaryDisabled}
                title={
                  isInPrimary
                    ? "Already your primary task"
                    : isPrimaryDisabled
                    ? "Primary task already set"
                    : "Set as Primary task"
                }
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  primaryDisabled
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {isPrimaryLoading ? <span className="animate-spin">⏳</span> : "Add to Primary"}
              </button>
              <button
                onClick={onSecondaryClick}
                disabled={secondaryDisabled}
                title={isInSecondary ? "Already a secondary task" : "Add to Secondary"}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  secondaryDisabled
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {isSecondaryLoading ? <span className="animate-spin">⏳</span> : "Add to Secondary"}
              </button>
            </div>
          )}

          <TaskChipsRow
            task={task}
            showProject={showProject}
            showStatusPill={showStatusPill}
            showTimeTracking={showTimeTracking}
            showEngagementCounts={showEngagementCounts}
          />

          {(progress !== null || (showAssignees && task.assignees.length > 0)) && (
            <ProgressAndAssignees progress={progress} task={task} showAssignees={showAssignees} />
          )}
        </div>
      </RichCardShell>
    </Link>
  );
}
