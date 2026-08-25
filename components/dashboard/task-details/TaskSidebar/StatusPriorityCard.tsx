import { Lock } from "lucide-react";
import { Task } from "@/types/task.types";
import { getStatusColor, getPriorityColor } from "@/utils/task.utils";

interface StatusPriorityCardProps {
  task: Task;
  isPersonalTask: boolean;
  isUpdatingStatus: boolean;
  onStatusChange: (status: Task["status"]) => void;
  canChangeStatus: boolean;
}

export function StatusPriorityCard({
  task,
  isPersonalTask,
  isUpdatingStatus,
  onStatusChange,
  canChangeStatus,
}: StatusPriorityCardProps) {
  return (
    <div className="rounded-xl bg-card border border-border p-6 space-y-4">
      <div>
        <span className="block text-sm font-medium text-foreground mb-2">
          Status
        </span>
        
        {!canChangeStatus ? (
          <div>
            <div
              className={`w-full px-4 py-2 rounded-lg border ${getStatusColor(
                task.status
              )} font-medium text-center opacity-60 cursor-not-allowed`}
            >
              {task.status === "TODO" && "To Do"}
              {task.status === "IN_PROGRESS" && "In Progress"}
              {task.status === "IN_REVIEW" && "In Review"}
              {task.status === "BLOCKED" && "Blocked"}
              {task.status === "COMPLETED" && "Completed"}
              {task.status === "CANCELLED" && "Cancelled"}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Lock size={12} />
              <span>You don&apos;t have permission to change the status</span>
            </div>
          </div>
        ) : (
          <div>
            <select aria-label="Select an option"
              value={task.status}
              onChange={(e) =>
                onStatusChange(e.target.value as Task["status"])
              }
              disabled={isUpdatingStatus}
              className={`w-full px-4 py-2 rounded-lg border ${getStatusColor(
                task.status
              )} font-medium focus:ring-2 ring-primary outline-none disabled:opacity-50`}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="BLOCKED">Blocked</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        )}
      </div>

      <div>
        <span className="block text-sm font-medium text-foreground mb-2">
          Priority
        </span>
        <div
          className={`w-full px-4 py-2 rounded-lg border ${getPriorityColor(
            task.priority
          )} font-medium text-center`}
        >
          {task.priority === "URGENT" && "🔥 Urgent"}
          {task.priority === "HIGH" && "⬆️ High"}
          {task.priority === "MEDIUM" && "➡️ Medium"}
          {task.priority === "LOW" && "⬇️ Low"}
        </div>
      </div>
    </div>
  );
}
