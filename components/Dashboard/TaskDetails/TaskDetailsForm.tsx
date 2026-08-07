// components/TaskDetails/TaskDetailsForm.tsx
import { Loader2 } from "lucide-react";
import { RepeatControl, type RepeatValue } from "@/components/Tasks/form/RepeatControl";
import { TaskStartDateInput } from "@/components/Dashboard/ProjectDetails/TaskModal/TaskStartDateInput";
import { TaskDueDateInput } from "@/components/Dashboard/ProjectDetails/TaskModal/TaskDueDateInput";
import { TaskPriorityPicker } from "@/components/Dashboard/ProjectDetails/TaskModal/TaskPriorityPicker";
import { getStatusColor } from "@/utils/task.utils";
import type { TaskStatus } from "@/types/task.types";
import type { Priority } from "@/types/taskForm.types";

interface EditData {
  title: string;
  description: string;
  priority: string;
  status: string;
  estimatedHours: string;
  sectionId?: string;
  sprintId?: string;
  milestoneId?: string;
  startDate?: string;
  dueDate?: string;
  recurrence: RepeatValue;
}

interface TaskDetailsFormProps {
  editData: EditData;
  sections?: Array<{ id: string; name: string; status?: string }>;
  sprints?: Array<{ id: string; name: string }>;
  milestones?: Array<{ id: string; title: string }>;
  isPersonalTask?: boolean;
  isUpdating: boolean;
  onEditDataChange: (data: EditData) => void;
  onSave: () => void;
  onCancel: () => void;
}

const selectClass =
  "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20";

export const TaskDetailsForm = ({
  editData,
  sections,
  sprints,
  milestones,
  isPersonalTask = false,
  isUpdating,
  onEditDataChange,
  onSave,
  onCancel,
}: TaskDetailsFormProps) => {
  return (
    <div className="space-y-4">
      <input
        type="text"
        value={editData.title}
        onChange={(e) =>
          onEditDataChange({ ...editData, title: e.target.value })
        }
        className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground text-xl font-bold focus:ring-2 ring-primary outline-none"
      />

      <textarea
        value={editData.description}
        onChange={(e) =>
          onEditDataChange({ ...editData, description: e.target.value })
        }
        rows={6}
        className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground resize-none focus:ring-2 ring-primary outline-none"
        placeholder="Add description..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Status
          </label>
          <select
            value={editData.status}
            onChange={(e) =>
              onEditDataChange({ ...editData, status: e.target.value })
            }
            className={`w-full px-3 py-2 rounded-lg border ${getStatusColor(
              editData.status as TaskStatus
            )} font-medium focus:ring-2 ring-primary outline-none bg-background`}
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

        <TaskPriorityPicker
          value={editData.priority as Priority}
          onChange={(priority) =>
            onEditDataChange({ ...editData, priority })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Estimated Hours
        </label>
        <input
          type="number"
          value={editData.estimatedHours}
          onChange={(e) =>
            onEditDataChange({ ...editData, estimatedHours: e.target.value })
          }
          min="0"
          step="0.5"
          placeholder="e.g., 8"
          className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
        />
      </div>

      <TaskStartDateInput
        value={editData.startDate}
        onChange={(startDate) => onEditDataChange({ ...editData, startDate })}
      />

      <TaskDueDateInput
        value={editData.dueDate}
        onChange={(dueDate) => onEditDataChange({ ...editData, dueDate })}
      />

      {sections && sections.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Section
          </label>
          <select
            value={editData.sectionId ?? ""}
            onChange={(e) =>
              onEditDataChange({ ...editData, sectionId: e.target.value })
            }
            className={selectClass}
          >
            <option value="">No section</option>
            {sections
              .filter((section) => section.status === "ACTIVE")
              .map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
          </select>
        </div>
      )}

      {sprints && sprints.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Sprint
          </label>
          <select
            value={editData.sprintId ?? ""}
            onChange={(e) =>
              onEditDataChange({ ...editData, sprintId: e.target.value })
            }
            className={selectClass}
          >
            <option value="">No sprint</option>
            {sprints.map((sprint) => (
              <option key={sprint.id} value={sprint.id}>
                {sprint.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {milestones && milestones.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Milestone
          </label>
          <select
            value={editData.milestoneId ?? ""}
            onChange={(e) =>
              onEditDataChange({ ...editData, milestoneId: e.target.value })
            }
            className={selectClass}
          >
            <option value="">No milestone</option>
            {milestones.map((milestone) => (
              <option key={milestone.id} value={milestone.id}>
                {milestone.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <RepeatControl
        value={editData.recurrence}
        onChange={(recurrence) => onEditDataChange({ ...editData, recurrence })}
      />

      <div className="flex gap-3">
        <button
          onClick={onSave}
          disabled={isUpdating}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
        >
          {isUpdating && <Loader2 size={16} className="animate-spin" />}
          Save Changes
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};