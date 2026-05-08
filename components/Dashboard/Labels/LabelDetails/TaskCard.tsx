"use client";

import Link from "next/link";
import { ArrowUpRight, Briefcase, FolderOpen } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    status: string;
    priority: string;
    workspace: {
      id: string;
      name: string;
      slug: string;
    };
    project: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export function TaskCard({ task }: TaskCardProps) {
  const href = `/dashboard/workspaces/${task.workspace.slug}/projects/${task.project.slug}/tasks/${task.id}`;

  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:border-ring hover:shadow-md hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Meta: workspace & project */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 border-t border-border">
        <TaskMeta icon={<Briefcase className="h-3 w-3" />} label={task.workspace.name} />
        <TaskMeta icon={<FolderOpen className="h-3 w-3" />} label={task.project.name} />
      </div>
    </Link>
  );
}

function TaskMeta({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      {icon}
      <span className="truncate max-w-36">{label}</span>
    </span>
  );
}