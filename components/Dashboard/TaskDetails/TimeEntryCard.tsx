"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Clock, Plus, Trash2, Pencil, Check, X, Briefcase } from "lucide-react";
import type { TimeEntry, TimeEntryCategory } from "@/types/task.types";
import {
  useTaskTimeEntries,
  useAddTimeEntry,
  useUpdateTimeEntry,
  useDeleteTimeEntry,
} from "@/hooks/useTimeEntries";

interface TimeEntryCardProps {
  taskId: string;
  workspaceId?: string | null;
}

const CATEGORY_META: Record<TimeEntryCategory, { label: string; className: string }> = {
  DEEP_WORK: { label: "Deep Work", className: "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400" },
  MEETINGS:  { label: "Meetings",  className: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400" },
  ADMIN:     { label: "Admin",     className: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400" },
  LEARNING:  { label: "Learning",  className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" },
  BREAK:     { label: "Break",     className: "bg-pink-500/10 border-pink-500/20 text-pink-600 dark:text-pink-400" },
  OTHER:     { label: "Other",     className: "bg-neutral-500/10 border-neutral-500/20 text-neutral-600 dark:text-neutral-400" },
};

const CATEGORY_OPTIONS = Object.keys(CATEGORY_META) as TimeEntryCategory[];

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function initials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TimeEntryCard({ taskId, workspaceId }: TimeEntryCardProps) {
  const { data: session } = useSession();
  const { data: entries = [], isLoading } = useTaskTimeEntries(taskId);
  const addEntry = useAddTimeEntry();
  const updateEntry = useUpdateTimeEntry();
  const deleteEntry = useDeleteTimeEntry();

  const [duration, setDuration] = useState<string>("");
  const [category, setCategory] = useState<TimeEntryCategory>("DEEP_WORK");
  const [billable, setBillable] = useState(false);
  const [description, setDescription] = useState("");

  // Inline-edit state — editingId is the entry currently being edited.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDuration, setEditDuration] = useState<string>("");
  const [editCategory, setEditCategory] = useState<TimeEntryCategory>("OTHER");
  const [editBillable, setEditBillable] = useState(false);
  const [editDescription, setEditDescription] = useState("");

  const totalMinutes = entries.reduce((sum, e) => sum + e.duration, 0);
  const currentUserId = session?.user?.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minutes = Number(duration);
    if (!Number.isFinite(minutes) || minutes <= 0) return;

    addEntry.mutate(
      {
        taskId,
        duration: minutes,
        category,
        billable,
        description: description.trim() ? description.trim() : null,
      },
      {
        onSuccess: () => {
          setDuration("");
          setDescription("");
          setBillable(false);
          setCategory("DEEP_WORK");
        },
      }
    );
  };

  const startEdit = (entry: TimeEntry) => {
    setEditingId(entry.id);
    setEditDuration(String(entry.duration));
    setEditCategory(entry.category);
    setEditBillable(entry.billable);
    setEditDescription(entry.description ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDuration("");
    setEditCategory("OTHER");
    setEditBillable(false);
    setEditDescription("");
  };

  const saveEdit = (entry: TimeEntry) => {
    const minutes = Number(editDuration);
    if (!Number.isFinite(minutes) || minutes <= 0) return;

    updateEntry.mutate(
      {
        id: entry.id,
        taskId,
        duration: minutes,
        category: editCategory,
        billable: editBillable,
        description: editDescription.trim() ? editDescription.trim() : null,
      },
      { onSuccess: cancelEdit }
    );
  };

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold">Time Entries</h3>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Total</span>
          <span className="font-bold tabular-nums">{formatDuration(totalMinutes)}</span>
        </div>
      </div>

      {/* Add form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-muted-foreground mb-1 block">Duration (min)</label>
            <input
              type="number"
              min={1}
              max={1440}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="30"
              className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-muted-foreground mb-1 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TimeEntryCategory)}
              className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_META[c].label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs text-muted-foreground mb-1 block">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you work on?"
              maxLength={500}
              className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={billable}
              onChange={(e) => setBillable(e.target.checked)}
              className="accent-primary"
            />
            <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Billable</span>
          </label>

          <button
            type="submit"
            disabled={addEntry.isPending || !duration || Number(duration) <= 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            {addEntry.isPending ? "Adding…" : "Add Entry"}
          </button>
        </div>
      </form>

      {/* Entries list */}
      {isLoading ? (
        <div className="text-sm text-muted-foreground py-4">Loading time entries…</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-6 border border-dashed rounded-lg">
          <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
          <p className="text-sm text-muted-foreground">No time logged on this task yet</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-start gap-3 p-3 rounded-lg border bg-background/50"
            >
              {editingId === entry.id ? (
                /* ── Inline edit form ── */
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground mb-1 block">Duration (min)</label>
                      <input
                        type="number"
                        min={1}
                        max={1440}
                        value={editDuration}
                        onChange={(e) => setEditDuration(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground mb-1 block">Category</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as TimeEntryCategory)}
                        className="w-full px-2.5 py-1.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        {CATEGORY_OPTIONS.map((c) => (
                          <option key={c} value={c}>
                            {CATEGORY_META[c].label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground mb-1 block">Description</label>
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="What did you work on?"
                      maxLength={500}
                      className="w-full px-2.5 py-1.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editBillable}
                        onChange={(e) => setEditBillable(e.target.checked)}
                        className="accent-primary"
                      />
                      <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Billable</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={updateEntry.isPending}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => saveEdit(entry)}
                        disabled={updateEntry.isPending || !editDuration || Number(editDuration) <= 0}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check className="w-3.5 h-3.5" />
                        {updateEntry.isPending ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* ── Read-only row ── */
                <>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    {initials(entry.user?.name)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">
                        {entry.user?.name ?? "Unknown"}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${CATEGORY_META[entry.category]?.className ?? CATEGORY_META.OTHER.className}`}
                      >
                        {CATEGORY_META[entry.category]?.label ?? "Other"}
                      </span>
                      {entry.billable && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          <Briefcase className="w-2.5 h-2.5" />
                          Billable
                        </span>
                      )}
                    </div>

                    {entry.description && (
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {entry.description}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(entry.startedAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold tabular-nums">
                      {formatDuration(entry.duration)}
                    </span>
                    {currentUserId && entry.userId === currentUserId && (
                      <>
                        <button
                          onClick={() => startEdit(entry)}
                          disabled={updateEntry.isPending || deleteEntry.isPending}
                          title="Edit entry"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEntry.mutate({ entry, workspaceId })}
                          disabled={deleteEntry.isPending || updateEntry.isPending}
                          title="Delete entry"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
