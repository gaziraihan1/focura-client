import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";

interface TaskDatesSectionProps {
  startDate: string;
  dueDate: string;
  estimatedHours: number | undefined;
  errors: Record<string, string>;
  onStartDateChange: (startDate: string) => void;
  onDueDateChange: (dueDate: string) => void;
  onEstimatedHoursChange: (estimatedHours: number | undefined) => void;
}

export function TaskDatesSection({
  startDate,
  dueDate,
  estimatedHours,
  errors,
  onStartDateChange,
  onDueDateChange,
  onEstimatedHoursChange,
}: TaskDatesSectionProps) {
  return (
    <motion.div className="rounded-xl bg-card border border-border p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="text-sm mb-2 block">
          <Calendar size={14} className="inline mr-1" />
          Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-border"
        />
      </div>

      <div>
        <label className="text-sm mb-2 block">
          <Calendar size={14} className="inline mr-1" />
          Due Date
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => onDueDateChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-border"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          <Clock size={14} className="inline mr-1" />
          Estimated Time (hours)
        </label>
        <input
          type="number"
          min={0}
          step={0.5}
          value={estimatedHours ?? ""}
          onChange={(e) =>
            onEstimatedHoursChange(
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          className={`w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 ring-primary ${
            errors.estimatedHours ? "border-red-500" : "border-border"
          }`}
          placeholder="e.g. 1.5"
        />
      </div>
    </motion.div>
  );
}