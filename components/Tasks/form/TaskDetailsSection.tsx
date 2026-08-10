import { m as motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { AiSuggestionBar } from "@/components/AI/AiSuggestionBar";
import type { AiTaskSuggestion } from "@/types/ai.types";

interface TaskDetailsSectionProps {
  title: string;
  description: string;
  errors: Record<string, string>;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  /** Workspace for AI rate limiting — omitted for personal tasks. */
  workspaceId?: string | null;
  /** Enables the AI suggestion bar under the title. */
  onApplyAiSuggestion?: (suggestion: AiTaskSuggestion) => void;
  /** Applies a single suggested field (chip click). */
  onApplyAiPartial?: (patch: Partial<AiTaskSuggestion>) => void;
}

export function TaskDetailsSection({
  title,
  description,
  errors,
  onTitleChange,
  onDescriptionChange,
  workspaceId,
  onApplyAiSuggestion,
  onApplyAiPartial,
}: TaskDetailsSectionProps) {
  return (
    <motion.div className="rounded-xl bg-card border border-border p-6 space-y-6">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="text-primary" />
        <h3 className="text-lg font-semibold">Task Details</h3>
      </div>

      <div>
        <label className="block text-sm mb-2" htmlFor="fld-75">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input id="fld-75"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 ring-primary ${
            errors.title ? "border-red-500" : "border-border"
          }`}
          placeholder="What needs to be done?"
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.title}
          </p>
        )}

        {onApplyAiSuggestion && (
          <AiSuggestionBar
            title={title}
            workspaceId={workspaceId}
            onApply={onApplyAiSuggestion}
            onApplyPartial={onApplyAiPartial ?? ((patch) => onApplyAiSuggestion(patch as AiTaskSuggestion))}
          />
        )}
      </div>

      <textarea aria-label="Optional details"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        rows={3}
        className="w-full px-4 py-3 rounded-lg border border-border bg-background resize-none"
        placeholder="Optional details"
      />
    </motion.div>
  );
}