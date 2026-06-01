import { Task } from "@/hooks/useTask";
import { cn } from "@/lib/utils";
import { AlertCircle, Calendar, CheckCircle2, Circle, Clock, GripVertical, MessageSquare } from "lucide-react";
import { memo } from "react";
import { Assignees } from "./Assignees";
import { PriorityBadge } from "./PriorityBadge";
import Link from "next/link";

type TaskStatus   = Task['status'];

export const COLUMNS: {
  status: TaskStatus;
  label:  string;
  icon:   React.ReactNode;
  color:  string;
}[] = [
  { status: 'TODO',        label: 'To Do',      icon: <Circle       className="size-3.5" />, color: 'text-muted-foreground' },
  { status: 'IN_PROGRESS', label: 'In Progress', icon: <Clock        className="size-3.5" />, color: 'text-blue-500'         },
  { status: 'IN_REVIEW',   label: 'In Review',   icon: <AlertCircle  className="size-3.5" />, color: 'text-amber-500'        },
  { status: 'COMPLETED',   label: 'Completed',   icon: <CheckCircle2 className="size-3.5" />, color: 'text-emerald-500'      },
];


export const ListRow = memo(function ListRow({ task, workspaceSlug }: { task: Task; workspaceSlug: string }) {
  const col       = COLUMNS.find((c) => c.status === task.status);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    /*
     * data-task-id → attach dnd-kit useSortable({ id: task.id }) ref here.
     * GripVertical is the visual drag handle — dnd-kit's dragHandle ref goes on it.
     */
    <Link href={`/dashboard/workspaces/${workspaceSlug}/projects/${task.project?.slug}/tasks/${task.id}`}><div
      data-task-id={task.id}
      className="group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_130px_100px_90px_80px] items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors"
    >
      <GripVertical className="size-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors cursor-grab active:cursor-grabbing shrink-0" />

      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
        {task.description && (
          <p className="hidden sm:block text-xs text-muted-foreground truncate mt-0.5">{task.description}</p>
        )}
      </div>

      {col && (
        <div className={cn('hidden sm:flex items-center gap-1.5 text-xs font-medium', col.color)}>
          {col.icon}
          <span className="truncate">{col.label}</span>
        </div>
      )}

      <div className="hidden sm:block">
        <PriorityBadge priority={task.priority} />
      </div>

      <div className="hidden sm:flex items-center">
        {task.dueDate ? (
          <span className={cn('flex items-center gap-1 text-[11px] font-medium', isOverdue ? 'text-red-500' : 'text-muted-foreground')}>
            <Calendar className="size-3 shrink-0" />
            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/40">—</span>
        )}
      </div>

      <div className="flex items-center gap-2 justify-end">
        {task._count.comments > 0 && (
          <span className="hidden sm:flex items-center gap-0.5 text-[11px] text-muted-foreground">
            <MessageSquare className="size-3" />
            {task._count.comments}
          </span>
        )}
        <Assignees assignees={task.assignees} />
      </div>
    </div>
    </Link>
    
  );
});
