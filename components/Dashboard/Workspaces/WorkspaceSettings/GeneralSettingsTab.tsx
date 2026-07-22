import { motion } from "framer-motion";
import { Save, Loader2, AlertTriangle } from "lucide-react";
import { WorkspaceForm, PREDEFINED_COLORS } from "@/hooks/useWorkspaceSettings";

const COLOR_NAMES: Record<string, string> = {
  "#6366f1": "Indigo",
  "#8b5cf6": "Violet",
  "#ec4899": "Pink",
  "#ef4444": "Red",
  "#f97316": "Orange",
  "#eab308": "Yellow",
  "#22c55e": "Green",
  "#06b6d4": "Cyan",
};

interface GeneralSettingsTabProps {
  formData: WorkspaceForm;
  initialData?: WorkspaceForm;
  errors: Record<string, string>;
  isAdmin: boolean;
  isUpdating: boolean;
  onUpdateField: <K extends keyof WorkspaceForm>(
    field: K,
    value: WorkspaceForm[K]
  ) => void;
  onSave: () => void;
}

export function GeneralSettingsTab({
  formData,
  initialData,
  errors,
  isAdmin,
  isUpdating,
  onUpdateField,
  onSave,
}: GeneralSettingsTabProps) {
  // Check if form has unsaved changes
  const isDirty = initialData
    ? JSON.stringify(formData) !== JSON.stringify(initialData)
    : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Unsaved changes banner */}
      {isDirty && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 px-4 py-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 text-sm"
        >
          <AlertTriangle size={16} aria-hidden="true" />
          You have unsaved changes
        </div>
      )}

      <div className="rounded-xl bg-card border border-border p-6 space-y-6">
        {/* Workspace Name */}
        <div>
          <label
            htmlFor="workspace-name"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Workspace Name <span className="text-red-500">*</span>
          </label>
          <input
            id="workspace-name"
            type="text"
            value={formData.name}
            onChange={(e) => onUpdateField("name", e.target.value)}
            disabled={!isAdmin}
            maxLength={50}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground focus:ring-2 ring-primary outline-none ${
              errors.name ? "border-red-500" : "border-border"
            } disabled:opacity-50`}
          />
          <div className="flex justify-between mt-1">
            {errors.name ? (
              <p id="name-error" className="text-red-500 text-sm" role="alert">
                {errors.name}
              </p>
            ) : (
              <span />
            )}
            <span className="text-xs text-muted-foreground">
              {formData.name.length}/50
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="workspace-description"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Description
          </label>
          <textarea
            id="workspace-description"
            value={formData.description}
            onChange={(e) => onUpdateField("description", e.target.value)}
            disabled={!isAdmin}
            rows={4}
            maxLength={200}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none resize-none disabled:opacity-50"
          />
          <p className="text-xs text-muted-foreground text-right mt-1">
            {formData.description.length}/200
          </p>
        </div>

        {/* Workspace Color */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Workspace Color
          </label>
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Workspace color">
            {PREDEFINED_COLORS.map((color) => {
              const colorName = COLOR_NAMES[color] || color;
              const isSelected = formData.color === color;
              return (
                <button
                  key={color}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={colorName}
                  onClick={() => isAdmin && onUpdateField("color", color)}
                  disabled={!isAdmin}
                  className={`w-10 h-10 rounded-lg transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isSelected
                      ? "ring-2 ring-offset-2 ring-primary scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) =>
                isAdmin && onUpdateField("isPublic", e.target.checked)
              }
              disabled={!isAdmin}
              className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            <div>
              <p className="font-medium text-foreground">Public workspace</p>
              <p className="text-sm text-muted-foreground">
                Anyone with the link can view this workspace
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.allowInvites}
              onChange={(e) =>
                isAdmin && onUpdateField("allowInvites", e.target.checked)
              }
              disabled={!isAdmin}
              className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            <div>
              <p className="font-medium text-foreground">Allow invitations</p>
              <p className="text-sm text-muted-foreground">
                Members can invite others to this workspace
              </p>
            </div>
          </label>
        </div>

        {/* Save Button */}
        {isAdmin && (
          <button
            onClick={onSave}
            disabled={isUpdating || !isDirty}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUpdating ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
