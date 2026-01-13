import { motion } from "framer-motion";
import { Clock, Calendar, User, Folder, Check, Lock } from "lucide-react";
import { Task } from "@/types/task.types";
import { getStatusColor, getPriorityColor } from "@/utils/task.utils";

interface TaskSidebarProps {
  task: Task;
  isPersonalTask: boolean;
  isUpdatingStatus: boolean;
  onStatusChange: (status: Task["status"]) => void;
  canChangeStatus?: boolean; // NEW: Permission prop
}

export const TaskSidebar = ({
  task,
  isPersonalTask,
  isUpdatingStatus,
  onStatusChange,
  canChangeStatus = true, // NEW: Default to true for backwards compatibility
}: TaskSidebarProps) => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-card border border-border p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Status
          </label>
          
          {/* NEW: Show read-only status if no permission */}
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
            // NEW: Show editable dropdown if permission granted
            <div>
              <select
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
                {!isPersonalTask && <option value="IN_REVIEW">In Review</option>}
                {!isPersonalTask && <option value="BLOCKED">Blocked</option>}
                <option value="COMPLETED">Completed</option>
                {!isPersonalTask && <option value="CANCELLED">Cancelled</option>}
              </select>
              {isPersonalTask && (
                <p className="text-xs text-muted-foreground mt-2">
                  Personal tasks support: To Do, In Progress, Completed
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Priority
          </label>
          <div
            className={`px-4 py-2 rounded-lg border ${getPriorityColor(
              task.priority
            )} font-medium text-center`}
          >
            {task.priority}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl bg-card border border-border p-6 space-y-4"
      >
        <h3 className="font-semibold text-foreground mb-4">Details</h3>

        {task.project && (
          <div className="flex items-center gap-3">
            <Folder size={16} className="text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Project</p>
              <p
                className="text-sm font-medium"
                style={{ color: task.project.color }}
              >
                {task.project.name}
              </p>
            </div>
          </div>
        )}

        {task.estimatedHours && (
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Estimated Hours</p>
              <p className="text-sm font-medium text-foreground">
                {task.estimatedHours}h
              </p>
            </div>
          </div>
        )}

        {task.startDate && (
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Start Date</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(task.startDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {task.dueDate && (
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Due Date</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <User size={16} className="text-muted-foreground" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Created By</p>
            <p className="text-sm font-medium text-foreground">
              {task.createdBy.name}
            </p>
          </div>
        </div>

        {task.assignees && task.assignees.length > 0 && (
          <div className="flex items-start gap-3">
            <User size={16} className="text-muted-foreground mt-1" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-2">Assignees</p>
              <div className="space-y-2">
                {task.assignees.map((assignee) => (
                  <div
                    key={assignee.user.id}
                    className="flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                      {assignee.user.name.charAt(0)}
                    </div>
                    <span className="text-sm text-foreground">
                      {assignee.user.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Clock size={14} />
            Created {new Date(task.createdAt).toLocaleDateString()}
          </div>
          {task.completedAt && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
              <Check size={14} />
              Completed {new Date(task.completedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};