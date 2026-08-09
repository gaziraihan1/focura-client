import { TaskStatus } from "@/hooks/useProjectFeatures";
import { SECTION_COLORS, TASK_STATUS_OPTIONS } from "./SectionList";

interface NewSectionFormProps {
  name: string;
  desc: string;
  color: string;
  status: TaskStatus | "";
  wip: string;
  usedStatuses: Set<TaskStatus>;
  isPending: boolean;
  canSubmit: boolean;
  onChangeName: (value: string) => void;
  onChangeDesc: (value: string) => void;
  onChangeColor: (value: string) => void;
  onChangeStatus: (value: TaskStatus | "") => void;
  onChangeWip: (value: string) => void;
  onCreate: () => void;
  onCancel: () => void;
}

export function NewSectionForm({
  name,
  desc,
  color,
  status,
  wip,
  usedStatuses,
  isPending,
  canSubmit,
  onChangeName,
  onChangeDesc,
  onChangeColor,
  onChangeStatus,
  onChangeWip,
  onCreate,
  onCancel,
}: NewSectionFormProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <input aria-label="Section name (e.g., Backend, Frontend, Design)"
        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        placeholder="Section name (e.g., Backend, Frontend, Design)"
        value={name}
        onChange={(e) => onChangeName(e.target.value)}
        autoFocus
      />
      <input aria-label="Description (optional)"
        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
        placeholder="Description (optional)"
        value={desc}
        onChange={(e) => onChangeDesc(e.target.value)}
      />
      <div className="flex items-center gap-2">
        {SECTION_COLORS.map((c) => (
          <button
            key={c}
            aria-label={`Select section color ${c}`}
            onClick={() => onChangeColor(c)}
            className={`w-6 h-6 rounded-full transition-all ${color === c ? "ring-2 ring-offset-2 ring-primary" : "ring-1 ring-border"}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={status}
          onChange={(e) => onChangeStatus(e.target.value as TaskStatus | "")}
          aria-label="Status for new section"
          className="px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">No status</option>
          {TASK_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} disabled={usedStatuses.has(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          WIP
          <input
            type="number"
            min={0}
            value={wip}
            onChange={(e) => onChangeWip(e.target.value)}
            className="w-16 px-2 py-1 rounded-lg border border-border bg-background text-xs text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Tip: a section with a task status becomes a board column. Leave it on &ldquo;No status&rdquo; for a
        folder-only section — the board stays untouched.
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={onCreate}
          disabled={!canSubmit || isPending}
          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {isPending ? "Adding..." : "Add Section"}
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-accent transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
