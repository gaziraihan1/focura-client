import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";
import { WorkspaceForm, PREDEFINED_COLORS } from "@/hooks/useWorkspaceSettings";

interface GeneralSettingsTabProps {
  formData: WorkspaceForm;
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
  errors,
  isAdmin,
  isUpdating,
  onUpdateField,
  onSave,
}: GeneralSettingsTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="rounded-xl bg-card border border-border p-6 space-y-6">
        {/* Workspace Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Workspace Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onUpdateField("name", e.target.value)}
            disabled={!isAdmin}
            className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground focus:ring-2 ring-primary outline-none ${
              errors.name ? "border-red-500" : "border-border"
            } disabled:opacity-50`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onUpdateField("description", e.target.value)}
            disabled={!isAdmin}
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none resize-none disabled:opacity-50"
          />
        </div>

        {/* Workspace Color */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Workspace Color
          </label>
          <div className="flex flex-wrap gap-3">
            {PREDEFINED_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => isAdmin && onUpdateField("color", color)}
                disabled={!isAdmin}
                className={`w-10 h-10 rounded-lg transition-all disabled:opacity-50 ${
                  formData.color === color
                    ? "ring-2 ring-offset-2 ring-primary scale-110"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
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
            disabled={isUpdating}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdating ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Save Changes
          </button>
        )}
      </div>
    </motion.div>
  );
}