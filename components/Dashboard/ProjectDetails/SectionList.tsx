"use client";

import { useState } from "react";
import { Columns, Plus, MoreHorizontal, Loader2 } from "lucide-react";
import {
  useProjectSections,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
} from "@/hooks/useProjectFeatures";

interface SectionListProps {
  projectId: string;
}

const SECTION_COLORS = [
  "#667eea", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#84cc16",
];

export default function SectionList({ projectId }: SectionListProps) {
  const { data: sections, isLoading } = useProjectSections(projectId);
  const createSection = useCreateSection();
  const updateSection = useUpdateSection();
  const deleteSection = useDeleteSection();
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [color, setColor] = useState(SECTION_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createSection.mutateAsync({
      name: name.trim(),
      description: desc.trim() || undefined,
      color,
      projectId,
    });
    setName("");
    setDesc("");
    setColor(SECTION_COLORS[0]);
    setShowNew(false);
  };

  const handleRename = async (sectionId: string) => {
    if (!editName.trim() || !editingId) return;
    await updateSection.mutateAsync({ sectionId, projectId, name: editName.trim() });
    setEditingId(null);
    setEditName("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const items = sections ?? [];

  return (
    <div className="space-y-2">
      {items.map((section) => (
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
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{section.name}</h4>
                  {section.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{section.description}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                section.status === "ACTIVE" ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" :
                section.status === "COMPLETED" ? "text-blue-500 bg-blue-50 dark:bg-blue-950/20" :
                "text-muted-foreground bg-muted"
              }`}>
                {section.status}
              </span>
              {editingId !== section.id && (
                <button
                  onClick={() => { setEditingId(section.id); setEditName(section.name); }}
                  className="p-1 rounded-lg hover:bg-accent transition"
                >
                  <MoreHorizontal size={12} className="text-muted-foreground" />
                </button>
              )}
              {editingId === section.id && (
                <>
                  <button
                    onClick={() => handleRename(section.id)}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-xs text-muted-foreground hover:underline"
                  >
                    Cancel
                  </button>
                </>
              )}
              <button
                onClick={() => deleteSection.mutateAsync({ sectionId: section.id, projectId })}
                className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition"
              >
                <span className="text-[10px] text-red-500">×</span>
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
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreate}
              disabled={!name.trim() || createSection.isPending}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {createSection.isPending ? "Adding..." : "Add Section"}
            </button>
            <button onClick={() => setShowNew(false)} className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-accent transition">
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
    </div>
  );
}
