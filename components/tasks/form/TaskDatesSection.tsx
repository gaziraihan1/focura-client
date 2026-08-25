import { m as motion } from "framer-motion";
import { AlertCircle, Calendar, Clock } from "lucide-react";

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
        <label className="text-sm mb-2 block" htmlFor="fld-72">
          <Calendar size={14} className="inline mr-1" />
          Start Date
        </label>
        <input id="fld-72"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-border"
        />
        {
          errors.startDate && (
            <p className="text-[11px] text-destructive">
              <AlertCircle size={14} /> {errors.startDate}
            </p>
          )
        }
      </div>

      <div>
        <label className="text-sm mb-2 block" htmlFor="fld-73">
          <Calendar size={14} className="inline mr-1" />
          Due Date
        </label>
        <input id="fld-73"
          type="date"
          value={dueDate}
          onChange={(e) => onDueDateChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-border"
        />
        {
          errors.dueDate && (
            <p className="text-[11px] text-destructive">
              <AlertCircle size={14} /> {errors.dueDate}
            </p>
          )
        }
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" htmlFor="fld-74">
          <Clock size={14} className="inline mr-1" />
          Estimated Time (hours)
        </label>
        <input id="fld-74"
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
        {
          errors.estimatedHours && (
            <p className="text-[11px] text-destructive">
              <AlertCircle size={14} /> {errors.estimatedHours}
            </p>
          )
        }
      </div>
    </motion.div>
  );
}