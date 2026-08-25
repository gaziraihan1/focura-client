"use client";

import Link from "next/link";
import { ArrowUpRight, Briefcase, FolderOpen } from "lucide-react";
import type { Task } from "@/hooks/useTask";
import { StatusBadge, PriorityBadgeWithIcon, TaskMeta } from "../shared";

export interface LabelTaskCardProps {
  task: Task;
  cardHref: string;
  showWorkspaceMeta: boolean;
  className?: string;
}

/** Label detail card — original source: components/Dashboard/Labels/LabelDetails/TaskCard.tsx */
export function LabelTaskCard({
  task,
  cardHref,
  showWorkspaceMeta,
  className = "",
}: LabelTaskCardProps) {
  return (
    <Link
      href={cardHref}
      className={`group relative flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm transition-colors duration-200 hover:border-ring hover:shadow-md hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      {/* Arrow icon top-right */}
      <span className="absolute right-3 top-3 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <ArrowUpRight className="h-4 w-4" />
      </span>

      {/* Title */}
      <p className="pr-6 text-sm font-medium leading-snug text-card-foreground line-clamp-2">
        {task.title}
      </p>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={task.status} />
        <PriorityBadgeWithIcon priority={task.priority} />
      </div>

      {/* Meta: workspace & project */}
      {showWorkspaceMeta && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 border-t border-border">
          <TaskMeta icon={<Briefcase className="h-3 w-3" />} label={task.project?.workspace?.name || "Workspace"} />
          <TaskMeta icon={<FolderOpen className="h-3 w-3" />} label={task.project?.name || "Project"} />
        </div>
      )}
    </Link>
  );
}
