import { motion } from "framer-motion";
import { Flag, Calendar, Clock, AlertCircle } from "lucide-react";
import { CreateTaskDto } from "@/hooks/useTask";
import { PRIORITY_COLORS } from "@/constant/intent.constant";
import { IntentSelector } from "./IntentSelector";
import { EnergySelector } from "./EnergySelector";



interface TaskDetailsSectionProps {
  status: CreateTaskDto["status"];
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  intent?: "EXECUTION" | "PLANNING" | "REVIEW" | "LEARNING" | "COMMUNICATION";
  energyType?: "LOW" | "MEDIUM" | "HIGH";
  focusRequired?: boolean;
  startDate?: string;
  dueDate?: string;
  estimatedHours?: number | null;
  errors: Record<string, string>;
  onStatusChange: (status: CreateTaskDto["status"]) => void;
  onPriorityChange: (priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW") => void;
  onIntentChange: (intent: "EXECUTION" | "PLANNING" | "REVIEW" | "LEARNING" | "COMMUNICATION") => void;
  onEnergyTypeChange: (energyType: "LOW" | "MEDIUM" | "HIGH") => void;
  onFocusRequiredChange: (focusRequired: boolean) => void;
  onStartDateChange: (startDate: string) => void;
  onDueDateChange: (dueDate: string) => void;
  onEstimatedHoursChange: (estimatedHours: number | undefined) => void;
}

export function TaskDetailsSection({
  status,
  priority,
  intent,
  energyType,
  focusRequired,
  startDate,
  dueDate,
  estimatedHours,
  errors,
  onStatusChange,
  onPriorityChange,
  onIntentChange,
  onEnergyTypeChange,
  onFocusRequiredChange,
  onStartDateChange,
  onDueDateChange,
  onEstimatedHoursChange,
}: TaskDetailsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-xl bg-card border border-border p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Task Details
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) =>
              onStatusChange(e.target.value as CreateTaskDto["status"])
            }
            className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="BLOCKED">Blocked</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <Flag size={16} className="inline mr-2" />
            Priority
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["URGENT", "HIGH", "MEDIUM", "LOW"] as const).map((priorityLevel) => (
              <button
                key={priorityLevel}
                type="button"
                onClick={() => onPriorityChange(priorityLevel)}
                className={`px-4 py-2.5 rounded-lg border transition text-sm font-medium ${
                  priority === priorityLevel
                    ? PRIORITY_COLORS[priorityLevel]
                    : "border-border text-muted-foreground hover:bg-accent"
                }`}
              >
                {priorityLevel}
              </button>
            ))}
          </div>
        </div>

        {/* Intent Selector */}
        <IntentSelector selectedIntent={intent} onIntentChange={onIntentChange} />

        {/* Energy Selector */}
        <EnergySelector
          selectedEnergy={energyType}
          onEnergyChange={onEnergyTypeChange}
        />

        {/* Focus Required Checkbox */}
        <div className="flex items-center gap-3 mt-2">
          <input
            type="checkbox"
            checked={focusRequired}
            onChange={(e) => onFocusRequiredChange(e.target.checked)}
            className="rounded border-border"
          />
          <span className="text-sm text-foreground">
            Requires deep focus (Focus Mode)
          </span>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <Calendar size={16} className="inline mr-2" />
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <Calendar size={16} className="inline mr-2" />
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground focus:ring-2 ring-primary outline-none ${
              errors.dueDate ? "border-red-500" : "border-border"
            }`}
          />
          {errors.dueDate && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.dueDate}
            </p>
          )}
        </div>
      </div>

      {/* Estimated Hours */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          <Clock size={16} className="inline mr-2" />
          Estimated Hours
        </label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={estimatedHours || ""}
          onChange={(e) =>
            onEstimatedHoursChange(
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none ${
            errors.estimatedHours ? "border-red-500" : "border-border"
          }`}
          placeholder="e.g., 8"
        />
        {errors.estimatedHours && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.estimatedHours}
          </p>
        )}
      </div>
    </motion.div>
  );
}