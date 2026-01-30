import { motion } from "framer-motion";
import { AlertCircle, Calendar, Flag } from "lucide-react";
import { CreateProjectDto } from "@/hooks/useProjects";

type ProjectForm = Omit<CreateProjectDto, "workspaceId">;

const priorityOptions: CreateProjectDto["priority"][] = [
  "URGENT",
  "HIGH",
  "MEDIUM",
  "LOW",
];

const priorityColors: Record<string, string> = {
  URGENT: "bg-red-500/10 text-red-500 border-red-500/20",
  HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  MEDIUM: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  LOW: "bg-green-500/10 text-green-500 border-green-500/20",
};

interface ProjectPlanningSectionProps {
  form: ProjectForm;
  errors: Record<string, string>;
  onFieldChange: <K extends keyof ProjectForm>(
    field: K,
    value: ProjectForm[K]
  ) => void;
}

export function ProjectPlanningSection({
  form,
  errors,
  onFieldChange,
}: ProjectPlanningSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-xl bg-card border border-border p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Planning</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Priority
          </label>
          <div className="grid grid-cols-2 gap-2">
            {priorityOptions.map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => onFieldChange("priority", priority)}
                className={`px-4 py-2.5 rounded-lg border transition text-sm font-medium ${
                  form.priority === priority
                    ? priorityColors[priority as string]
                    : "border-border text-muted-foreground hover:bg-accent"
                }`}
              >
                <Flag size={14} className="inline mr-2" />
                {priority}
              </button>
            ))}
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <Calendar size={16} className="inline mr-2" />
            Start Date
          </label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => onFieldChange("startDate", e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <Calendar size={16} className="inline mr-2" />
            Due Date
          </label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => onFieldChange("dueDate", e.target.value)}
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
    </motion.div>
  );
}