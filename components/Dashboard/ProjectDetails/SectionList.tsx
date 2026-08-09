"use client";

import { useMemo, useState } from "react";
import { Columns, Plus, Loader2 } from "lucide-react";
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
import { NewSectionForm } from "./NewSectionForm";
import { SectionCard } from "./SectionCard"

interface SectionListProps {
  projectId: string;
  // Base href of the project (…/projects/[projectSlug]); when provided, each
  // card gets a "View tasks" link deep-linking into the filtered tasks page.
  tasksBaseHref?: string;
}

export const SECTION_COLORS = [
  "#667eea", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#84cc16",
];

export const TASK_STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
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
        <SectionCard
          key={section.id}
          section={section}
          index={index}
          isLast={index === items.length - 1}
          editingId={editingId}
          editName={editName}
          usedStatuses={usedStatuses}
          reorderPending={reorderSections.isPending}
          tasksBaseHref={tasksBaseHref}
          onMove={move}
          onRename={handleRename}
          onStartEdit={(s) => {
            setEditingId(s.id);
            setEditName(s.name);
          }}
          onEditNameChange={setEditName}
          onCancelEdit={() => setEditingId(null)}
          onStatusChange={handleStatusChange}
          onWipChange={handleWipChange}
          onDelete={(sectionId) => setConfirmingDeleteId(sectionId)}
        />
      ))}

      {items.length === 0 && !showNew && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          <Columns className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>No sections yet — organize your project into logical sections.</p>
        </div>
      )}

      {showNew ? (
        <NewSectionForm
          name={name}
          desc={desc}
          color={color}
          status={status}
          wip={wip}
          usedStatuses={usedStatuses}
          isPending={createSection.isPending}
          canSubmit={!!name.trim()}
          onChangeName={setName}
          onChangeDesc={setDesc}
          onChangeColor={setColor}
          onChangeStatus={setStatus}
          onChangeWip={setWip}
          onCreate={handleCreate}
          onCancel={() => setShowNew(false)}
        />
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
