"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Check, Eye, ExternalLink, Plus, Loader2, Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/Shared/ConfirmModal";
import FeatureListError from "@/components/Dashboard/ProjectDetails/FeatureListError";
import {
  useProjectViews,
  useCreateView,
  useDeleteView,
  useUpdateView,
} from "@/hooks/useProjectFeatures";

interface ViewListProps {
  projectId: string;
}

export default function ViewList({ projectId }: ViewListProps) {
  const { data: views, isLoading, error } = useProjectViews(projectId);
  const createView = useCreateView();
  const deleteView = useDeleteView();
  const updateView = useUpdateView();
  const [showNew, setShowNew] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const params = useParams();
  const workspaceSlug = params?.workspaceSlug as string;
  const projectSlug = params?.projectSlug as string;

  const tasksHref = (viewId: string) =>
    workspaceSlug && projectSlug
      ? `/dashboard/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks?view=${viewId}`
      : "#";
  const [name, setName] = useState("");
  const [type, setType] = useState<"KANBAN" | "LIST" | "CALENDAR" | "TIMELINE">("KANBAN");

  const handleCreate = async () => {
    if (!name.trim() || createView.isPending) return;
    await createView.mutateAsync({
      name: name.trim(),
      type,
      projectId,
    });
    setName("");
    setType("KANBAN");
    setShowNew(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <FeatureListError feature="views" error={error} />;
  }

  const items = views ?? [];

  return (
    <div className="space-y-2">
      {items.map((view) => (
        <div
          key={view.id}
          className="rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye size={14} className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  {view.name}
                  {view.isDefault && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-semibold">
                      Default
                    </span>
                  )}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {view.type}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {view.visibility === "SHARED" ? "Shared" : "Private"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => updateView.mutateAsync({ viewId: view.id, projectId, isDefault: true })}
                disabled={view.isDefault}
                title={view.isDefault ? "Default view" : "Make this the default view"}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition disabled:opacity-40 disabled:cursor-default"
              >
                <Check className="size-3" /> {view.isDefault ? "Default" : "Set default"}
              </button>
              <Link
                href={tasksHref(view.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-[10px] font-medium text-primary hover:bg-primary/5 transition"
              >
                <ExternalLink className="size-3" /> Apply
              </Link>
              <button
                onClick={() => setDeleteTarget(view)}
                aria-label={`Delete view ${view.name}`}
                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {items.length === 0 && !showNew && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          <Eye className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>No saved views yet — create custom views to quickly switch between project perspectives.</p>
        </div>
      )}

      {showNew ? (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <input aria-label="View name (e.g., My Kanban)"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="View name (e.g., My Kanban)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <select aria-label="Select an option"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
          >
            <option value="KANBAN">Kanban</option>
            <option value="LIST">List</option>
            <option value="CALENDAR">Calendar</option>
            <option value="TIMELINE">Timeline</option>
          </select>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreate}
              disabled={!name.trim() || createView.isPending}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {createView.isPending ? "Saving..." : "Create View"}
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
          New View
        </button>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteView.mutateAsync({ viewId: deleteTarget.id, projectId });
            setDeleteTarget(null);
          }
        }}
        title="Delete view?"
        message={`This will permanently delete the "${deleteTarget?.name}" view.`}
        confirmText="Delete"
        isLoading={deleteView?.isPending}
      />
    </div>
  );
}
