"use client";

import { m as motion } from "framer-motion";
import Link from "next/link";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  Flag,
  FolderOpen,
  TrendingUp,
} from "lucide-react";
import { getTaskTimeInfo } from "@/lib/task/time";
import { calculateTimeProgress } from "@/utils/taskcard.utils";
import { getPriorityColor, formatTimeDuration } from "@/utils/task.utils";
import type { Task } from "@/hooks/useTask";
import { TitleBlock, StatusPill, StatusOrb } from "../shared";
import { RichCardShell } from "./DetailedTaskCard";

export interface TeamTaskCardProps {
  task: Task;
  cardHref: string;
  isCompleted: boolean;
  index?: number;
  enableAnimation?: boolean;
  showDescription: boolean;
  showProject: boolean;
  showTimeTracking: boolean;
  showStatusPill: boolean;
  showPriorityFlag: boolean;
}

/** Team tasks card — original source: components/Dashboard/TeamTask/TaskCardTeam.tsx */
export function TeamTaskCard({
  task,
  cardHref,
  isCompleted,
  index = 0,
  enableAnimation = true,
  showDescription,
  showProject,
  showTimeTracking,
  showStatusPill,
  showPriorityFlag,
}: TeamTaskCardProps) {
  const timeInfo = getTaskTimeInfo(task);
  const timeProgress = calculateTimeProgress(
    task.startDate ?? undefined,
    task.dueDate,
    task.estimatedHours
  );

  const cardContent = (
    <RichCardShell completed={isCompleted}>
      <div className="p-5">
        <div className="flex items-start gap-3">
          <StatusOrb status={task.status} />

          <div className="flex-1 min-w-0">
            <TitleBlock
              title={task.title}
              description={task.description}
              completed={isCompleted}
              showDescription={showDescription}
            />

            {/* NOTE: task.project.workspace resolves to null for legacy
                projects whose workspaceSlug was never backfilled (compound FK
                on Project(workspaceId, workspaceSlug)) — never assume it exists. */}
            {showProject && task.project && (
              <div className="mt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Briefcase size={12} />
                  <span>{task.project.workspace?.name ?? "No workspace"}</span>
                  <span>•</span>
                  <FolderOpen size={12} />
                  <span>{task.project.name}</span>
                </div>
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {/* Status */}
              {showStatusPill && <StatusPill status={task.status} />}

              {/* Priority */}
              {showPriorityFlag && (
                <span className={`inline-flex items-center gap-1 text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  <Flag size={12} />
                  {task.priority}
                </span>
              )}

              {/* Time info */}
              {showTimeTracking && task.dueDate && (
                <span className={`inline-flex items-center gap-1 text-xs ${timeInfo.isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                  <Calendar size={12} />
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}

              {/* Progress */}
              {timeProgress !== null && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp size={12} />
                  {timeProgress}%
                </span>
              )}

              {/* Time until due */}
              {showTimeTracking && timeInfo.hoursUntilDue !== null && (
                <span className={`inline-flex items-center gap-1 text-xs ${timeInfo.isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                  <AlertCircle size={12} />
                  {formatTimeDuration(timeInfo.hoursUntilDue)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </RichCardShell>
  );

  if (enableAnimation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.25, ease: "easeOut" }}
      >
        <Link href={cardHref}>{cardContent}</Link>
      </motion.div>
    );
  }

  return <Link href={cardHref}>{cardContent}</Link>;
}
