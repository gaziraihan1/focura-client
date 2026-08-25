"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useProjectRouteSlugs } from "@/hooks/useRouteParams";
import { Sprout, Plus, MoreHorizontal, Target, Loader2, Trash2, ExternalLink } from "lucide-react";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import FeatureListError from "@/components/dashboard/projects/project-details/FeatureListError";
import {
  useProjectSprints,
  useCreateSprint,
  useCompleteSprint,
  useDeleteSprint,
  SprintItem,
} from "@/hooks/useProjectFeatures";

const SPRINT_STATUS_COLORS: Record<string, string> = {
  PLANNING: "text-purple-500 bg-purple-50 dark:bg-purple-950/20",
  ACTIVE: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20",
  COMPLETED: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
  CANCELLED: "text-muted-foreground bg-muted",
};

interface SprintListProps {
  projectId: string;
}

export default function SprintList({ projectId }: SprintListProps) {
  const { data: stats, isLoading, error } = useProjectSprints(projectId);
  const createSprint = useCreateSprint();
  const completeSprint = useCompleteSprint();
  const deleteSprint = useDeleteSprint();
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [retroModal, setRetroModal] = useState<{ sprintId: string; name: string } | null>(null);
  const [retroText, setRetroText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<SprintItem | null>(null);
  const { workspaceSlug, projectSlug } = useProjectRouteSlugs();

  const handleCreate = async () => {
    if (!name.trim() || !startDate || !endDate || createSprint.isPending) return;
    await createSprint.mutateAsync({
      name: name.trim(),
      goal: goal.trim() || undefined,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      projectId,
    });
    setName("");
    setGoal("");
    setStartDate("");
    setEndDate("");
    setShowNew(false);
  };

  const handleCompleteWithRetro = async () => {
    if (!retroModal || completeSprint.isPending) return;
    await completeSprint.mutateAsync({
      sprintId: retroModal.sprintId,
      projectId,
      retrospective: retroText || undefined,
    });
    setRetroModal(null);
    setRetroText("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <FeatureListError feature="sprints" error={error} />;
  }

  const sprints = stats?.sprints ?? [];
  const activeSprint = stats?.activeSprint;

  return (
    <div className="space-y-4">
      {/* Velocity summary */}
      {stats && stats.avgVelocity > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-primary" />
            <span className="text-sm font-semibold text-foreground">Avg Velocity</span>
          </div>
          <p className="text-2xl font-black text-foreground mt-1">
            {stats.avgVelocity.toFixed(1)}
            <span className="text-xs font-normal text-muted-foreground ml-1">pts/sprint</span>
          </p>
        </div>
      )}

      {/* Active sprint banner */}
      {activeSprint && (
        <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Active Sprint</p>
              <h3 className="text-base font-bold text-foreground mt-0.5">{activeSprint.name}</h3>
              {activeSprint.goal && (
                <p className="text-xs text-muted-foreground mt-0.5 italic">Goal: {activeSprint.goal}</p>
              )}
            </div>
            <button
              onClick={() => setRetroModal({ sprintId: activeSprint.id, name: activeSprint.name })}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition"
            >
              Complete Sprint
            </button>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>{new Date(activeSprint.startDate).toLocaleDateString("en-US", { timeZone: "UTC" })} → {new Date(activeSprint.endDate).toLocaleDateString("en-US", { timeZone: "UTC" })}</span>
          </div>
        </div>
      )}

      {/* Sprint list */}
      <div className="space-y-2">
        {sprints.map((sprint) => (
          <SprintCard
            key={sprint.id}
            sprint={sprint}
            tasksHref={
              workspaceSlug && projectSlug
                ? `/dashboard/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks?sprint=${sprint.id}`
                : undefined
            }
            onDelete={() => setDeleteTarget(sprint)}
            onComplete={() => setRetroModal({ sprintId: sprint.id, name: sprint.name })}
          />
        ))}

        {sprints.length === 0 && !showNew && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            <Sprout className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>No sprints yet — plan your work in time-boxed iterations.</p>
          </div>
        )}

        {/* New sprint form */}
        {showNew ? (
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <input aria-label="Sprint name (e.g., Sprint 1)"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Sprint name (e.g., Sprint 1)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <input aria-label="Sprint goal (optional)"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Sprint goal (optional)"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block" htmlFor="fld-25">Start Date</label>
                <input id="fld-25"
                  type="date"
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block" htmlFor="fld-26">End Date</label>
                <input id="fld-26"
                  type="date"
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCreate}
                disabled={!name.trim() || !startDate || !endDate || createSprint.isPending}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {createSprint.isPending ? "Creating..." : "Create Sprint"}
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
            New Sprint
          </button>
        )}
      </div>

      {/* Retrospective modal */}
      {retroModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md mx-4 rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h3 className="text-base font-bold text-foreground mb-1">Complete: {retroModal.name}</h3>
            <p className="text-xs text-muted-foreground mb-4">Add any retrospective notes before closing the sprint.</p>
            <textarea aria-label="What went well? What could improve?"
              className="w-full h-24 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="What went well? What could improve?"
              value={retroText}
              onChange={(e) => setRetroText(e.target.value)}
            />
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handleCompleteWithRetro}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
              >
                Complete Sprint
              </button>
              <button
                onClick={() => setRetroModal(null)}
                className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteSprint.mutateAsync({ sprintId: deleteTarget.id, projectId });
            setDeleteTarget(null);
          }
        }}
        title="Delete sprint?"
        message={`This will delete "${deleteTarget?.name}". Tasks in it stay untouched but lose their sprint assignment.`}
        confirmText="Delete"
        isLoading={deleteSprint?.isPending}
      />
    </div>
  );
}

function SprintCard({
  sprint,
  tasksHref,
  onDelete,
  onComplete,
}: {
  sprint: SprintItem;
  tasksHref?: string;
  onDelete: () => void;
  onComplete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const statusClass = SPRINT_STATUS_COLORS[sprint.status] ?? "text-muted-foreground";

  useEffect(() => {
    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const totalDays = Math.ceil(
    (new Date(sprint.endDate).getTime() - new Date(sprint.startDate).getTime()) / (1000 * 60 * 60 * 24),
  );
  const daysElapsed = sprint.status === "ACTIVE"
    ? Math.max(0, Math.ceil((currentTime - new Date(sprint.startDate).getTime()) / (1000 * 60 * 60 * 24)))
    : null;
  const progressPct = daysElapsed !== null ? Math.min(100, Math.round((daysElapsed / totalDays) * 100)) : null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusClass}`}>
              {sprint.status}
            </span>
            {sprint.totalPoints != null && (
              <span className="text-[10px] text-muted-foreground">
                {sprint.completedPoints ?? 0}/{sprint.totalPoints} pts
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-foreground">{sprint.name}</h4>
          {sprint.goal && (
            <p className="text-xs text-muted-foreground mt-0.5 italic">{sprint.goal}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
            <span>{new Date(sprint.startDate).toLocaleDateString("en-US", { timeZone: "UTC" })} → {new Date(sprint.endDate).toLocaleDateString("en-US", { timeZone: "UTC" })}</span>
            <span>({totalDays} days)</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            {sprint._count?.tasks != null && (
              <span className="text-[10px] text-muted-foreground">
                {sprint._count.tasks} task{sprint._count.tasks === 1 ? "" : "s"}
              </span>
            )}
            {tasksHref && (
              <Link href={tasksHref} className="inline-flex items-center gap-1 text-[10px] font-medium text-primary hover:underline transition">
                <ExternalLink className="size-3" /> View tasks
              </Link>
            )}
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 rounded-lg hover:bg-accent transition" aria-label="More options">
            <MoreHorizontal size={14} className="text-muted-foreground" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" role="presentation" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 w-36 rounded-lg border border-border bg-popover shadow-lg py-1">
                {sprint.status === "ACTIVE" && (
                  <button onClick={() => { setMenuOpen(false); onComplete(); }} className="w-full px-3 py-1.5 text-xs text-left text-emerald-500 hover:bg-accent transition">
                    Complete
                  </button>
                )}
                <button onClick={() => { setMenuOpen(false); onDelete(); }} className="w-full flex items-center gap-1.5 px-3 py-1.5 text-xs text-left text-red-500 hover:bg-accent transition">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sprint progress bar (for active) */}
      {progressPct !== null && (
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Day {daysElapsed} of {totalDays}</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-colors duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Retro text */}
      {sprint.retrospective && (
        <details className="mt-2">
          <summary className="text-[10px] text-muted-foreground cursor-pointer hover:text-foreground transition">
            Retrospective
          </summary>
          <p className="mt-1 text-xs text-muted-foreground">{sprint.retrospective}</p>
        </details>
      )}
    </div>
  );
}
