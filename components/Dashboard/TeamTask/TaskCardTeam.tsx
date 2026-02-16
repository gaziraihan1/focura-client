"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { getTaskTimeInfo } from '@/lib/task/time';
import { calculateTimeProgress } from '@/utils/taskcard.utils';

// types/task-card-team.types.ts
import { Task } from '@/hooks/useTask';
import { TeamTaskStatusIcon } from './TaskCardTeam/TeamTaskStatusIcon';
import { TeamTaskHeader } from './TaskCardTeam/TeamTaskHeader';
import { TeamTaskProjectInfo } from './TaskCardTeam/TeamTaskProjectInfo';
import { TeamTaskBadges } from './TaskCardTeam/TeamTaskBadges';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/dashboard/tasks/${task.id}`}>
        <div className="p-4 rounded-xl bg-card border border-border hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group">
          <div className="flex items-start gap-4">
            {/* Status Icon */}
            <div className="shrink-0 mt-1">
              <TeamTaskStatusIcon status={task.status} />
            </div>

            {/* Task Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <TeamTaskHeader
                title={task.title}
                description={task.description}
                priority={task.priority}
              />

              {/* Project Info */}
              {task.project && (
                <TeamTaskProjectInfo
                  workspaceName={task.project.workspace.name}
                  projectName={task.project.name}
                />
              )}

              {/* Badges */}
              <TeamTaskBadges
                task={task}
                timeInfo={timeInfo}
                timeProgress={timeProgress}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}