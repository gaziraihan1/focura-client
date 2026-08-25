"use client";

import { m as motion } from "framer-motion";
import Link from "next/link";
import { Calendar, CheckCircle2, Clock, Flag, Folder, Timer } from "lucide-react";
import {
  getStatusColor,
  getPriorityColor,
} from "@/utils/task.utils";
import type { Task } from "@/hooks/useTask";
import { TitleBlock } from "../shared";

export interface FocusTaskCardProps {
  task: Task;
  cardHref: string;
  isCompleted: boolean;
  progress: number | null;
  timeRemaining?: number;
  enableAnimation?: boolean;
  showDescription: boolean;
  showPriorityFlag: boolean;
  showProject: boolean;
  showTimeTracking: boolean;
}

/** Focus mode card with purple glow — original source:
 * components/Dashboard/AllTasks/FocusTaskCard.tsx */
export function FocusTaskCard({
  task,
  cardHref,
  isCompleted,
  progress,
  timeRemaining,
  enableAnimation = true,
  showDescription,
  showPriorityFlag,
  showProject,
  showTimeTracking,
}: FocusTaskCardProps) {
  const resolvedTimeRemaining = timeRemaining ?? 0;

  const cardContent = (
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-purple-500/20 to-purple-600/20 rounded-2xl blur-xl" />

      <div className="relative p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-card to-card border-2 border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500 transition-colors cursor-pointer group">
        {/* Focus badge */}
        {resolvedTimeRemaining > 0 && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-600 dark:text-purple-400">
              <Timer size={12} />
              {Math.floor(resolvedTimeRemaining / 60)}m
            </span>
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-1">
            <div
              className={`
                w-9 h-9 rounded-xl flex items-center justify-center
                ${getStatusColor(task.status)}
                shadow-sm ring-1 ring-inset ring-white/10
              `}
            >
              {isCompleted ? (
                <CheckCircle2 size={17} strokeWidth={2.2} />
              ) : (
                <Clock size={17} strokeWidth={2.2} />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <TitleBlock
              title={task.title}
              description={task.description}
              completed={isCompleted}
              showDescription={showDescription}
              hoverClass="group-hover:text-purple-500"
            />

            {/* Progress bar for focus */}
            {progress !== null && task.estimatedHours && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-2 bg-purple-500/20 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-purple-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-semibold tabular-nums text-purple-600 dark:text-purple-400">
                  {progress}%
                </span>
              </div>
            )}

            {/* Metadata */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {showPriorityFlag && (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  <Flag size={12} />
                  {task.priority}
                </span>
              )}
              {showProject && task.project && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Folder size={12} />
                  {task.project.name}
                </span>
              )}
              {showTimeTracking && task.dueDate && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (enableAnimation) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Link href={cardHref}>{cardContent}</Link>
      </motion.div>
    );
  }

  return <Link href={cardHref}>{cardContent}</Link>;
}
