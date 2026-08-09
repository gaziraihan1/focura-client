"use client";
import Link from "next/link";
import { ProjectSectionItem, TaskStatus } from "@/hooks/useProjectFeatures";
import { ChevronDown, ChevronUp, ListChecks, MoreHorizontal, Trash2 } from "lucide-react";
import { TASK_STATUS_OPTIONS } from "./SectionList";

interface SectionCardProps {
  section: ProjectSectionItem;
  index: number;
  isLast: boolean;
  editingId: string | null;
  editName: string;
  usedStatuses: Set<TaskStatus>;
  reorderPending: boolean;
  tasksBaseHref?: string;
  onMove: (index: number, direction: -1 | 1) => void;
  onRename: (sectionId: string) => void;
  onStartEdit: (section: ProjectSectionItem) => void;
  onEditNameChange: (value: string) => void;
  onCancelEdit: () => void;
  onStatusChange: (section: ProjectSectionItem, next: TaskStatus | null) => void;
  onWipChange: (section: ProjectSectionItem, raw: string) => void;
  onDelete: (sectionId: string) => void;
}

export function SectionCard({
  section,
  index,
  isLast,
  editingId,
  editName,
  usedStatuses,
  reorderPending,
  tasksBaseHref,
  onMove,
  onRename,
  onStartEdit,
  onEditNameChange,
  onCancelEdit,
  onStatusChange,
  onWipChange,
  onDelete,
}: SectionCardProps) {
  return (
    <div
      className="rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: section.color ?? "#667eea" }} />
          {editingId === section.id ? (
            <input aria-label="Section name"
              className="flex-1 px-2 py-1 rounded border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={editName}
              onChange={(e) => onEditNameChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onRename(section.id)}
              autoFocus
            />
          ) : (
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-foreground">{section.name}</h4>
              {section.description && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{section.description}</p>
              )}
              {tasksBaseHref && (
                <Link
                  href={`${tasksBaseHref}/tasks?section=${section.id}`}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline mt-1"
                >
                  <ListChecks size={11} />
                  View tasks
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onMove(index, -1)}
              disabled={index === 0 || reorderPending}
              aria-label={`Move ${section.name} left`}
              className="p-1 rounded-lg hover:bg-accent transition disabled:opacity-30"
            >
              <ChevronUp size={14} className="text-muted-foreground" />
            </button>
            <button
              onClick={() => onMove(index, 1)}
              disabled={isLast || reorderPending}
              aria-label={`Move ${section.name} right`}
              className="p-1 rounded-lg hover:bg-accent transition disabled:opacity-30"
            >
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>
          </div>

          <select
            value={section.taskStatus ?? ""}
            onChange={(e) =>
              onStatusChange(section, e.target.value === "" ? null : (e.target.value as TaskStatus))
            }
            aria-label={`Status for ${section.name}`}
            className="px-2 py-1 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">No status</option>
            {TASK_STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={usedStatuses.has(option.value) && option.value !== section.taskStatus}
              >
                {option.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            min={0}
            defaultValue={section.wipLimit ?? 0}
            onBlur={(e) => onWipChange(section, e.target.value)}
            aria-label={`WIP limit for ${section.name}`}
            className="w-16 px-2 py-1 rounded-lg border border-border bg-background text-xs text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
          />

          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              section.status === "ACTIVE"
                ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                : section.status === "COMPLETED"
                  ? "text-blue-500 bg-blue-50 dark:bg-blue-950/20"
                  : "text-muted-foreground bg-muted"
            }`}
          >
            {section.status}
          </span>

          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-muted-foreground bg-muted">
            {section._count?.tasks ?? 0} task{section._count?.tasks === 1 ? "" : "s"}
          </span>

          {editingId !== section.id && (
            <button
              onClick={() => onStartEdit(section)}
              aria-label={`Edit ${section.name}`}
              className="flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition"
            >
              <MoreHorizontal size={12} />
            </button>
          )}
          {editingId === section.id && (
            <>
              <button
                onClick={() => onRename(section.id)}
                className="rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={onCancelEdit}
                className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition"
              >
                Cancel
              </button>
            </>
          )}
          <button
            onClick={() => onDelete(section.id)}
            aria-label={`Delete ${section.name}`}
            className="flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-red-500/40 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 transition"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}