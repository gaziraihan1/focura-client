"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FocusBadge } from "./FocusTaskCard/FocusBadge";
import { TaskStatusIcon } from "./FocusTaskCard/TaskStatusIcon";
import { TaskHeader } from "./FocusTaskCard/TaskHeader";
import { TaskProgressBar } from "./FocusTaskCard/TaskProgressBar";
import { TaskMetadata } from "./FocusTaskCard/TaskMetadata";
import { FocusTaskCardProps } from "@/types/focusTask.types";

export function FocusTaskCard({ task, timeRemaining }: FocusTaskCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <div className="absolute -inset-1 bg-linear-to-r from-purple-600/20 via-purple-500/20 to-purple-600/20 rounded-2xl blur-xl" />

      <Link href={`/dashboard/tasks/${task.id}`}>
        <div className="relative p-5 rounded-2xl bg-linear-to-br from-purple-500/10 via-card to-card border-2 border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500 transition-all cursor-pointer group">
          <FocusBadge timeRemaining={timeRemaining} />

          <div className="flex items-start gap-4">
            <div className="shrink-0 mt-1">
              <TaskStatusIcon status={task.status} />
            </div>

            <div className="flex-1 min-w-0">
              <TaskHeader
                title={task.title}
                description={task.description}
                priority={task.priority}
              />

              <TaskProgressBar timeRemaining={timeRemaining} />

              <TaskMetadata task={task} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}