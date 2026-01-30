import React from "react";
import { Task } from "@/hooks/useTask";
import { cn } from "@/lib/utils";
import { KanbanCardHeader } from "./KanbanCard/KanbanCardHeader";
import { KanbanCardTitle } from "./KanbanCard/KanbanCardTitle";
import { KanbanCardMetadata } from "./KanbanCard/KanbanCardMetadata";
import { KanbanCardFooter } from "./KanbanCard/KanbanCardFooter";
import { KanbanCardProjectIndicator } from "./KanbanCard/KanbanCardProjectIndicator";
import { useKanbanCard } from "@/hooks/useKanbanCard";

interface KanbanCardProps {
  task: Task;
  onClick: () => void;
  isBlocked?: boolean;
}

export function KanbanCard({
  task,
  onClick,
  isBlocked = false,
}: KanbanCardProps) {
  const {
    daysStale,
    agingStatus,
    isOverdue,
    subtaskProgress,
    getPriorityColor,
    getAgingBorder,
  } = useKanbanCard({ task, isBlocked });

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 sm:p-4 rounded-lg border-l-4 transition-all group hover:shadow-md relative",
        getPriorityColor(),
        getAgingBorder(),
        isBlocked && "bg-destructive/10",
        agingStatus === "critical" && "animate-pulse"
      )}
    >
      <KanbanCardHeader
        priority={task.priority}
        isCompleted={task.status === "COMPLETED"}
        isBlocked={isBlocked}
      />

      <KanbanCardTitle title={task.title} description={task.description} />

      <KanbanCardMetadata
        daysStale={daysStale}
        agingStatus={agingStatus}
        taskStatus={task.status}
        isBlocked={isBlocked}
        subtasksCount={task._count.subtasks}
        subtaskProgress={subtaskProgress}
      />

      <KanbanCardFooter
        assignees={task.assignees}
        commentsCount={task._count.comments}
        filesCount={task._count.files}
        dueDate={task.dueDate}
        isOverdue={!!isOverdue}
      />

      <KanbanCardProjectIndicator project={task.project} />
    </button>
  );
}