import { motion } from "framer-motion";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { IntentSelector } from "./IntentSelector";
import { FocusEnergySection } from "@/components/Tasks/form/FocusEnergySection";
import { TaskDetailsSectionProps } from "@/types/taskDetails.types";
import StatusDetailsSection from "./TaskDetailsSection/StatusDetailsSection";
import PriorityDetailsSection from "./TaskDetailsSection/PriorityDetailsSection";



export function TaskDetailsSection({
  status,
  priority,
  intent,
  energyType,
  focusRequired,
  focusLevel,
  distractionCost,
  startDate,
  dueDate,
  estimatedHours,
  errors,
  onStatusChange,
  onPriorityChange,
  onIntentChange,
  onEnergyTypeChange,
  onFocusRequiredChange,
  onFocusLevelChange,
  onDistractionCostChange,
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
       <StatusDetailsSection status={status} onStatusChange={onStatusChange} />
        <PriorityDetailsSection priority={priority} onPriorityChange={onPriorityChange} />
        <IntentSelector selectedIntent={intent} onIntentChange={onIntentChange} />
      </div>

      <FocusEnergySection
        focusRequired={focusRequired || false}
        focusLevel={focusLevel}
        energyType={energyType || "MEDIUM"}
        distractionCost={distractionCost}
        onFocusRequiredChange={onFocusRequiredChange}
        onFocusLevelChange={onFocusLevelChange}
        onEnergyTypeChange={onEnergyTypeChange}
        onDistractionCostChange={onDistractionCostChange}
      />

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