"use client";

import { m as motion } from "framer-motion";
import Link from "next/link";
import { Flag } from "lucide-react";
import {
  getStatusColor,
  getPriorityColor,
} from "@/utils/task.utils";
import type { Task } from "@/hooks/useTask";
import {
  StatusOrb,
  TitleBlock,
  TaskChipsRow,
  ProgressAndAssignees,
} from "../shared";

interface AnimatedLinkProps {
  href: string;
  enableAnimation: boolean;
  index: number;
  children: React.ReactNode;
}

/** Wraps card content in a Link with optional staggered entrance animation. */
export function AnimatedCardLink({ href, enableAnimation, index, children }: AnimatedLinkProps) {
  if (!enableAnimation) return <Link href={href}>{children}</Link>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25, ease: "easeOut" }}
    >
      <Link href={href}>{children}</Link>
    </motion.div>
  );
}

/** Shared outer shell for the detailed/workspace/team card layouts. */
export function RichCardShell({
  completed,
  className,
  children,
}: {
  completed: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`
        group relative rounded-2xl border bg-card overflow-hidden
        transition-all duration-300 ease-out
        hover:shadow-[0_8px_32px_-4px_hsl(var(--foreground)/0.12)]
        hover:-translate-y-0.5 hover:border-primary/30
        ${completed ? "opacity-70" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/** Header row: status orb + title/description + priority flag. */
function CardHeader({
  task,
  completed,
  showDescription,
  showPriorityFlag,
}: {
  task: Task;
  completed: boolean;
  showDescription: boolean;
  showPriorityFlag: boolean;
}) {  return (
    <div className="flex items-start gap-3">
      <StatusOrb status={task.status} />
      <TitleBlock
        title={task.title}
        description={task.description}
        completed={completed}
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
  );
}

export interface DetailedTaskCardProps {
  task: Task;
  cardHref: string;
  isCompleted: boolean;
  progress: number | null;
  index?: number;
  enableAnimation?: boolean;
  showDescription?: boolean;
  showProject?: boolean;
  showAssignees?: boolean;
  showTimeTracking?: boolean;
  showEngagementCounts?: boolean;
  showStatusPill?: boolean;
  showPriorityFlag?: boolean;
  className?: string;
}

/** Rich dashboard card — original source: components/Dashboard/AllTasks/TaskCard.tsx */
export function DetailedTaskCard({
  task,
  cardHref,
  isCompleted,
  progress,
  index = 0,
  enableAnimation = true,
  showDescription = true,
  showProject = true,
  showAssignees = true,
  showTimeTracking = true,
  showEngagementCounts = true,
  showStatusPill = true,
  showPriorityFlag = true,
  className = "",
}: DetailedTaskCardProps) {
  return (
    <AnimatedCardLink href={cardHref} enableAnimation={enableAnimation} index={index}>
      <RichCardShell completed={isCompleted} className={className}>
        <div className="p-5">
          <CardHeader
            task={task}
            completed={isCompleted}
            showDescription={showDescription}
            showPriorityFlag={showPriorityFlag}
          />

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
    </AnimatedCardLink>
  );
}
