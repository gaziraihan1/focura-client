import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface WorkspaceDetailsSectionProps {
  name: string;
  description: string;
  color: string;
  isPublic: boolean;
  colors: string[];
  errors: Record<string, string>;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onPublicChange: (value: boolean) => void;
}

export function WorkspaceDetailsSection({
  name,
  description,
  color,
  isPublic,
  colors,
  errors,
  onNameChange,
  onDescriptionChange,
  onColorChange,
  onPublicChange,
}: WorkspaceDetailsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-xl bg-card border border-border p-6 space-y-6"
    >
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Workspace Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g., Acme Inc, My Team, Design Projects"
          className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none transition ${
            errors.name ? "border-red-500" : "border-border"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.name}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          This will be visible to all workspace members
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Description (Optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={4}
          placeholder="What's this workspace about?"
          className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none resize-none transition ${
            errors.description ? "border-red-500" : "border-border"
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Workspace Color
        </label>
        <div className="flex flex-wrap gap-3">
          {colors.map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              onClick={() => onColorChange(colorOption)}
              className={`w-10 h-10 rounded-lg transition-all ${
                color === colorOption
                  ? "ring-2 ring-offset-2 ring-primary scale-110"
                  : "hover:scale-105"
              }`}
              style={{ backgroundColor: colorOption }}
            />
          ))}
        </div>
      </div>

      {/* Public Checkbox */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => onPublicChange(e.target.checked)}
            className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
          />
          <div>
            <p className="font-medium text-foreground">
              Make workspace public
            </p>
            <p className="text-sm text-muted-foreground">
              Anyone with the link can view this workspace
            </p>
          </div>
        </label>
      </div>
    </motion.div>
  );
}