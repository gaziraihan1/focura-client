"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Columns, Plus, MoreHorizontal, Loader2, Trash2, ListChecks } from "lucide-react";
import { ConfirmModal } from "@/components/Shared/ConfirmModal";
import FeatureListError from "@/components/Dashboard/ProjectDetails/FeatureListError";
import {
  useProjectSections,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
  useReorderSections,
  type ProjectSectionItem,
  type TaskStatus,
} from "@/hooks/useProjectFeatures";

interface SectionListProps {
  projectId: string;
  // Base href of the project (…/projects/[projectSlug]); when provided, each
  // card gets a "View tasks" link deep-linking into the filtered tasks page.
  tasksBaseHref?: string;
}

const SECTION_COLORS = [
  "#667eea", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#84cc16",
];

const TASK_STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "BLOCKED", label: "Blocked" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function SectionList({ projectId, tasksBaseHref }: SectionListProps) {
  const { data: sections, isLoading, error } = useProjectSections(projectId);
  const createSection = useCreateSection();
  const updateSection = useUpdateSection();
  const deleteSection = useDeleteSection();
  const reorderSections = useReorderSections();
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [color, setColor] = useState(SECTION_COLORS[0]);
  // Defaults to "No status": a fresh section never claims a board column.
  // Only an explicit choice turns it into a board column.
  const [status, setStatus] = useState<TaskStatus | "">("");
  const [wip, setWip] = useState("20");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  const items = useMemo(
    () => (sections ? [...sections].sort((a, b) => a.position - b.position) : []),
    [sections],
  );

  // Section that is currently awaiting delete confirmation, if any
  const confirmingDelete = items.find((section) => section.id === confirmingDeleteId) ?? null;

  // Statuses already claimed by another section — can't be picked twice
  const usedStatuses = useMemo(
    () =>
      new Set(
        items
          .map((section) => section.taskStatus)
          .filter((value): value is TaskStatus => !!value),
      ),
    [items],
  );

  const handleCreate = async () => {
    if (!name.trim() || createSection.isPending) return;
    await createSection.mutateAsync({
      name: name.trim(),
      description: desc.trim() || undefined,
      color,
      // "" (No status) → omit the mapping so the board stays untouched
      taskStatus: status || undefined,
      wipLimit: Number(wip) || 0,
      projectId,
    });
    setName("");
    setDesc("");
    setColor(SECTION_COLORS[0]);
    setStatus("");
    setWip("20");
    setShowNew(false);
  };

  const handleRename = async (sectionId: string) => {
    if (!editName.trim() || !editingId) return;
    await updateSection.mutateAsync({ sectionId, projectId, name: editName.trim() });
    setEditingId(null);
    setEditName("");
  };

  const handleStatusChange = async (section: ProjectSectionItem, next: TaskStatus | null) => {
    await updateSection.mutateAsync({ sectionId: section.id, projectId, taskStatus: next });
  };

  const handleWipChange = async (section: ProjectSectionItem, raw: string) => {
    const value = Number(raw);
    if (!Number.isFinite(value) || value < 0) return;
    await updateSection.mutateAsync({ sectionId: section.id, projectId, wipLimit: value });
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    reorderSections.mutateAsync({ projectId, sectionIds: next.map((section) => section.id) });
  };

  const handleConfirmDelete = async () => {
    if (!confirmingDelete) return;
    await deleteSection.mutateAsync({ sectionId: confirmingDelete.id, projectId });
    setConfirmingDeleteId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <FeatureListError feature="sections" error={error} />;
  }

  return (
    <div className="space-y-2">
      {items.map((section, index) => (
        <div
          key={section.id}
          className="rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: section.color ?? "#667eea" }} />
              {editingId === section.id ? (
                <input
                  className="flex-1 px-2 py-1 rounded border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRename(section.id)}
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
                  onClick={() => move(index, -1)}
                  disabled={index === 0 || reorderSections.isPending}
                  aria-label={`Move ${section.name} left`}
                  className="p-1 rounded-lg hover:bg-accent transition disabled:opacity-30"
                >
                  <ChevronUp size={14} className="text-muted-foreground" />
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1 || reorderSections.isPending}
                  aria-label={`Move ${section.name} right`}
                  className="p-1 rounded-lg hover:bg-accent transition disabled:opacity-30"
                >
                  <ChevronDown size={14} className="text-muted-foreground" />
                </button>
              </div>

              <select
                value={section.taskStatus ?? ""}
                onChange={(e) =>
                  handleStatusChange(section, e.target.value === "" ? null : (e.target.value as TaskStatus))
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
                onBlur={(e) => handleWipChange(section, e.target.value)}
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
                  onClick={() => {
                    setEditingId(section.id);
                    setEditName(section.name);
                  }}
                  aria-label={`Edit ${section.name}`}
                  className="flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition"
                >
                  <MoreHorizontal size={12} />
                </button>
              )}
              {editingId === section.id && (
                <>
                  <button
                    onClick={() => handleRename(section.id)}
                    className="rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition"
                  >
                    Cancel
                  </button>
                </>
              )}
              <button
                onClick={() => setConfirmingDeleteId(section.id)}
                aria-label={`Delete ${section.name}`}
                className="flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-red-500/40 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 transition"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {items.length === 0 && !showNew && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          <Columns className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>No sections yet — organize your project into logical sections.</p>
        </div>
      )}

      {showNew ? (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <input
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Section name (e.g., Backend, Frontend, Design)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <input
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Description (optional)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <div className="flex items-center gap-2">
            {SECTION_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full transition-all ${color === c ? "ring-2 ring-offset-2 ring-primary" : "ring-1 ring-border"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus | "")}
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
                onChange={(e) => setWip(e.target.value)}
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
              onClick={handleCreate}
              disabled={!name.trim() || createSection.isPending}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {createSection.isPending ? "Adding..." : "Add Section"}
            </button>
            <button
              onClick={() => setShowNew(false)}
              className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-accent transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowNew(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-solid transition"
        >
          <Plus size={16} />
          Add Section
        </button>
      )}

      <ConfirmModal
        isOpen={!!confirmingDelete}
        onClose={() => setConfirmingDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title={confirmingDelete ? `Delete section “${confirmingDelete.name}”?` : ""}
        message="This removes the section from your project. Tasks inside it are not deleted — they simply become unassigned."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteSection.isPending}
      />
    </div>
  );
}
