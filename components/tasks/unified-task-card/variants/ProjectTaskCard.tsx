"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Clock,
  Flag,
  MessageSquare,
  Repeat,
  Sprout,
} from "lucide-react";
import type { Task } from "@/hooks/useTask";
import type { TaskSectionBadge } from "../types";
import { SimplePriorityBadge } from "../shared";

export interface ProjectTaskCardProps {
  task: Task;
  cardHref: string;
  section?: TaskSectionBadge | null;
  showAssignees: boolean;
  showEngagementCounts: boolean;
  className?: string;
}

/** Project board card — original source: components/Dashboard/ProjectDetails/TaskCard.tsx */
export function ProjectTaskCard({
  task,
  cardHref,
  section,
  showAssignees,
  showEngagementCounts,
  className = "",
}: ProjectTaskCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(cardHref);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click(); } }}
      onClick={handleClick}
      className={`p-4 rounded-lg bg-card border border-border hover:border-primary cursor-pointer transition space-y-3 ${className}`}
    >
      <div className="flex items-start justify-between">
        <h4 className="font-medium text-foreground line-clamp-2">{task.title}</h4>
        <SimplePriorityBadge priority={task.priority} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {section && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {section.name}
          </span>
        )}
        {task.sprint && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400">
            <Sprout size={10} />
            {task.sprint.name}
          </span>
        )}
        {task.milestone && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
            <Flag size={10} />
            {task.milestone.title}
          </span>
        )}
        {task.recurrence && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-50 text-cyan-600 dark:bg-cyan-950/20 dark:text-cyan-400">
            <Repeat size={10} />
            {task.recurrence.pattern.charAt(0) +
              task.recurrence.pattern.slice(1).toLowerCase()}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {showEngagementCounts && task._count.comments > 0 && (
          <div className="flex items-center gap-1">
            <MessageSquare size={14} />
            <span>{task._count.comments}</span>
          </div>
        )}
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{new Date(task.dueDate).toLocaleDateString("en-US", { timeZone: "UTC" })}</span>
          </div>
        )}
      </div>

      {showAssignees && task.assignees.length > 0 && (
        <div className="flex -space-x-2">
          {task.assignees.slice(0, 3).map(assignee => (
            <div key={assignee.user.id} className="relative">
              {assignee.user.image ? (
                <Image
                  width={24}
                  height={24}
                  src={assignee.user.image}
                  alt={assignee.user.name}
                  className="w-6 h-6 rounded-full border-2 border-card"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-medium">
                  {assignee.user.name.charAt(0)}
                </div>
              )}
            </div>
          ))}
          {task.assignees.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
