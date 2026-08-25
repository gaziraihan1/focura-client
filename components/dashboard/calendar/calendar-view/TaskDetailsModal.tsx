import { Task } from "@/hooks/useTask";
import { TaskModalHeader } from "./TaskModal/TaskModalHeader";
import { TaskModalContent } from "./TaskModal/TaskModalContent";

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetailsModal({ task, onClose }: TaskDetailsModalProps) {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "COMPLETED";

  return (
    <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click(); } }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4 py-6"
      onClick={onClose}
    >
      {/* react-doctor-disable-next-line react-doctor/no-transition-all -- tailwindcss-animate `animate-in` entry animation only animates opacity/transform/filter, not `all` (false positive) */}
      <div
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <TaskModalHeader
          title={task.title}
          status={task.status}
          priority={task.priority}
          isOverdue={!!isOverdue}
          onClose={onClose}
          project={task.project}
          dueDate={task.dueDate}
        />

        <TaskModalContent
          description={task.description}
          startDate={task.startDate}
          dueDate={task.dueDate}
          estimatedHours={task.estimatedHours}
          createdAt={task.createdAt}
          updatedAt={task.updatedAt}
          timeProgress={task.timeTracking?.timeProgress ?? null}
          isOverdue={!!isOverdue}
          createdBy={task.createdBy}
          assignees={task.assignees}
          project={task.project}
          commentsCount={task._count.comments}
          subtasksCount={task._count.subtasks}
          filesCount={task._count.files}
          milestone={task.milestone}
          sprint={task.sprint}
          recurrence={task.recurrence}
          energyType={task.energyType ?? null}
          focusRequired={task.focusRequired ?? null}
          focusLevel={task.focusLevel ?? null}
          distractionCost={task.distractionCost ?? null}
        />
      </div>
    </div>
  );
}
