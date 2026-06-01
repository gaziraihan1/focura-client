// import { TaskCard } from "@/components/Dashboard/AllTasks/WorkspaceTasks/TaskCard";
import TaskCard from "@/components/Dashboard/ProjectDetails/TaskCard";
import { Task } from "@/hooks/useTask";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { memo } from "react";

type TaskStatus   = Task['status'];


export const BoardColumn = memo(function BoardColumn({
  status, label, icon, color,
  tasks, workspaceSlug, onAddTask,
}: {
  status:        TaskStatus;
  label:         string;
  icon:          React.ReactNode;
  color:         string;
  tasks:         Task[];
  workspaceSlug: string;
  onAddTask:     () => void;
}) {
  return (
    /*
     * data-column-status  → dnd-kit <Droppable id> will match this
     * The column div itself becomes the droppable container.
     * When integrating dnd-kit: wrap this with <SortableContext items={tasks.map(t=>t.id)}>
     */
    <div
      data-column-status={status}
      className="flex flex-col gap-3 min-w-68 max-w-77.5 w-full"
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={cn('flex items-center', color)}>{icon}</span>
          <span className="text-sm font-semibold text-foreground">{label}</span>
          <span className="flex size-5 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddTask}
          aria-label={`Add task to ${label}`}
          className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Plus className="size-3.5" />
        </button>
      </div>

      {/*
       * data-droppable={status} → attach dnd-kit useDroppable({ id: status }) ref here.
       * min-h ensures empty columns remain a valid drop target.
       */}
      <div
        data-droppable={status}
        className="flex flex-col gap-2.5 min-h-35 rounded-xl p-2 bg-muted/40 border border-dashed border-transparent transition-colors"
      >
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <span className={cn('opacity-40', color)}>{icon}</span>
            <p className="text-xs text-muted-foreground">No tasks</p>
          </div>
        ) : (
          tasks.map((task) => (
            /*
             * data-task-id → attach dnd-kit useSortable({ id: task.id }) ref here.
             * cursor-grab signals to the user that this is draggable.
             */
            <div
              key={task.id}
              data-task-id={task.id}
              className="cursor-grab active:cursor-grabbing"
            >
              <TaskCard task={task} workspaceSlug={workspaceSlug}  />
            </div>
          ))
        )}

        <button
          onClick={onAddTask}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mt-auto"
        >
          <Plus className="size-3.5" /> Add task
        </button>
      </div>
    </div>
  );
});