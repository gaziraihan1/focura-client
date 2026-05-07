"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { getTaskTimeInfo } from "@/lib/task/time";
import { calculateTimeProgress } from "@/utils/taskcard.utils";

import { Task } from "@/hooks/useTask";
import { TeamTaskStatusIcon } from "./TaskCardTeam/TeamTaskStatusIcon";
import { TeamTaskHeader } from "./TaskCardTeam/TeamTaskHeader";
import { TeamTaskProjectInfo } from "./TaskCardTeam/TeamTaskProjectInfo";
import { TeamTaskBadges } from "./TaskCardTeam/TeamTaskBadges";

export interface TaskCardTeamProps {
  task: Task;
  index: number;
}

export interface TaskTimeInfo {
  isOverdue: boolean;
  hoursUntilDue: number | null;
}

export function TaskCardTeam({ task, index }: TaskCardTeamProps) {
  const timeInfo = getTaskTimeInfo(task);
  const timeProgress = calculateTimeProgress(
    task.startDate,
    task.dueDate,
    task.estimatedHours
  );

  const isCompleted = task.status === "COMPLETED";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25, ease: "easeOut" }}
    >
      <Link href={`/dashboard/tasks/${task.id}`}>
        <div
          className={`
            group relative rounded-2xl border bg-card overflow-hidden
            transition-all duration-300 ease-out
            hover:shadow-[0_8px_32px_-4px_hsl(var(--foreground)/0.12)]
            hover:-translate-y-0.5 hover:border-primary/30
            ${isCompleted ? "opacity-70" : ""}
          `}
        >
          <div className="p-5">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <TeamTaskStatusIcon status={task.status} />
              </div>

              <div className="flex-1 min-w-0">
                <TeamTaskHeader
                  title={task.title}
                  description={task.description}
                  priority={task.priority}
                />

                {task.project && (
                  <div className="mt-2">
                    <TeamTaskProjectInfo
                      workspaceName={task.project.workspace.name}
                      projectName={task.project.name}
                    />
                  </div>
                )}

                <div className="mt-3">
                  <TeamTaskBadges
                    task={task}
                    timeInfo={timeInfo}
                    timeProgress={timeProgress}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}