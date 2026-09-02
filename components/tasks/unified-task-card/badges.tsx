"use client";

import { AlertCircle, Flag } from "lucide-react";

// ─── Small badges ─────────────────────────────────────────────────────────────

export function SimplePriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    URGENT: "bg-red-500",
    HIGH: "bg-orange-500",
    MEDIUM: "bg-yellow-500",
    LOW: "bg-green-500",
  };
  return (
    <div className={`w-2 h-2 rounded-full ${colors[priority] || "bg-gray-500"}`} />
  );
}

export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    todo: { label: "To Do", className: "bg-muted text-muted-foreground" },
    in_progress: { label: "In Progress", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
    in_review: { label: "In Review", className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" },
    done: { label: "Done", className: "bg-green-500/10 text-green-600 dark:text-green-400" },
    cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive" },
  };

  const normalizedStatus = status.toLowerCase().replace(" ", "_");
  const configValue = config[normalizedStatus] || { label: status, className: "bg-muted text-muted-foreground" };

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${configValue.className}`}>
      {configValue.label}
    </span>
  );
}

export function PriorityBadgeWithIcon({ priority }: { priority: string }) {
  const config: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    urgent: { label: "Urgent", className: "bg-red-500/10 text-red-600 dark:text-red-400", icon: <AlertCircle className="h-3 w-3" /> },
    high: { label: "High", className: "bg-orange-500/10 text-orange-600 dark:text-orange-400", icon: <Flag className="h-3 w-3" /> },
    medium: { label: "Medium", className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400", icon: <Flag className="h-3 w-3" /> },
    low: { label: "Low", className: "bg-sky-500/10 text-sky-600 dark:text-sky-400", icon: <Flag className="h-3 w-3" /> },
  };

  const normalizedPriority = priority.toLowerCase();
  const configValue = config[normalizedPriority] || { label: priority, className: "bg-muted text-muted-foreground", icon: <Flag className="h-3 w-3" /> };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${configValue.className}`}>
      {configValue.icon}
      {configValue.label}
    </span>
  );
}

export function TaskMeta({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      {icon}
      <span className="truncate max-w-36">{label}</span>
    </span>
  );
}
