import { motion } from "framer-motion";
import { AlertCircle, Palette } from "lucide-react";
import { CreateProjectDto } from "@/hooks/useProjects";

type ProjectForm = Omit<CreateProjectDto, "workspaceId">;

const statusOptions: CreateProjectDto["status"][] = [
  "PLANNING",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "ARCHIVED",
];

interface ProjectBasicInfoSectionProps {
  form: ProjectForm;
  errors: Record<string, string>;
  onFieldChange: <K extends keyof ProjectForm>(
    field: K,
    value: ProjectForm[K]
  ) => void;
}

export function ProjectBasicInfoSection({
  form,
  errors,
  onFieldChange,
}: ProjectBasicInfoSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-card border border-border p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Basic Info
        </h3>
      </div>

      <div className="space-y-4">
        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none transition ${
              errors.name ? "border-red-500" : "border-border"
            }`}
            placeholder="Enter project name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.name}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => onFieldChange("description", e.target.value)}
            rows={5}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none resize-none transition"
            placeholder="Add a short description..."
          />
        </div>

        {/* Color, Icon, Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Palette size={16} className="inline mr-2" />
              Color (hex)
            </label>
            <input
              type="text"
              value={form.color}
              onChange={(e) => onFieldChange("color", e.target.value)}
              className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground focus:ring-2 ring-primary outline-none ${
                errors.color ? "border-red-500" : "border-border"
              }`}
              placeholder="#667eea"
            />
            {errors.color && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.color}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Icon (optional)
            </label>
            <input
              type="text"
              value={form.icon}
              onChange={(e) => onFieldChange("icon", e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
              placeholder="e.g., 📁"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                onFieldChange(
                  "status",
                  e.target.value as CreateProjectDto["status"]
                )
              }
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status?.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
}