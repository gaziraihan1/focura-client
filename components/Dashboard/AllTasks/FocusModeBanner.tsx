// components/Dashboard/AllTasks/FocusModeBanner.tsx
"use client";

import { motion } from "framer-motion";
import { Zap, X, Clock, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Shared/Avatar";
import { Task } from "@/hooks/useTask";

interface FocusModeBannerProps {
  task: Task;
  timeRemaining: number; // seconds
  onEndFocus: () => void;
}

export function FocusModeBanner({ task, timeRemaining, onEndFocus }: FocusModeBannerProps) {
  const router = useRouter();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    // Estimate total duration (you'll get this from the active session)
    const totalSeconds = 25 * 60; // Default 25 min, update based on actual session
    const elapsed = totalSeconds - timeRemaining;
    return Math.min(100, (elapsed / totalSeconds) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 relative overflow-hidden rounded-2xl border-2 border-purple-500/50 bg-linear-to-r from-purple-500/10 via-purple-600/5 to-purple-500/10 backdrop-blur-sm"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-purple-500/5 via-purple-600/10 to-purple-500/5"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <motion.div
            className="shrink-0"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </motion.div>

          {/* Task Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500 text-white animate-pulse">
                FOCUS MODE ACTIVE
              </span>
              <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                <Clock className="w-4 h-4" />
                <span className="text-lg font-bold tabular-nums">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
              className="group text-left w-full"
            >
              <h3 className="text-xl font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </button>

            {/* Progress Bar */}
            <div className="mt-3 h-2 bg-muted/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-purple-500 via-purple-600 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgress()}%` }}
                transition={{ duration: 1 }}
              />
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-4 mt-3 text-sm">
              {task.project && (
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: task.project.color }}
                  />
                  <span className="text-muted-foreground">
                    {task.project.name}
                  </span>
                </div>
              )}

              {task.assignees && task.assignees.length > 0 && (
                <div className="flex -space-x-2">
                  {task.assignees.slice(0, 3).map((assignee) => (
                    <Avatar
                      key={assignee.user.id}
                      name={assignee.user.name}
                      image={assignee.user.image}
                      size="sm"
                    />
                  ))}
                </div>
              )}

              {task.estimatedHours && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Target className="w-3.5 h-3.5" />
                  <span>{task.estimatedHours}h</span>
                </div>
              )}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onEndFocus}
            className="shrink-0 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
            title="End focus session"
          >
            <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
          </button>
        </div>

        {/* Bottom Tips */}
        <div className="mt-4 pt-4 border-t border-purple-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>🎯 Stay focused on one task</span>
            <span>⏰ Take breaks regularly</span>
          </div>
          <button
            onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
            className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
          >
            View Details →
          </button>
        </div>
      </div>
    </motion.div>
  );
}