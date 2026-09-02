"use client";

import { useState } from "react";
import Link from "next/link";
import { useProjectRouteSlugs } from "@/hooks/useRouteParams";
import { Flag, Plus, MoreHorizontal, AlertTriangle, CheckCircle2, Loader2, Trash2, ExternalLink } from "lucide-react";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import FeatureListError from "@/components/dashboard/projects/project-details/FeatureListError";
import { useProjectMilestones, useCreateMilestone, useDeleteMilestone, useUpdateMilestoneProgress, MilestoneItem } from "@/hooks/useProjectFeatures";
import { Button } from "@/components/ui/Button";

const STATUS_COLORS: Record<string, string> = {
  ON_TRACK: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20",
  AT_RISK: "text-amber-500 bg-amber-50 dark:bg-amber-950/20",
  DELAYED: "text-red-500 bg-red-50 dark:bg-red-950/20",
  COMPLETED: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
};

const STATUS_LABELS: Record<string, string> = {
  ON_TRACK: "On Track",
  AT_RISK: "At Risk",
  DELAYED: "Delayed",
  COMPLETED: "Completed",
};

interface MilestoneListProps {
  projectId: string;
}

export default function MilestoneList({ projectId }: MilestoneListProps) {
  const { data: stats, isLoading, error } = useProjectMilestones(projectId);
  const createMilestone = useCreateMilestone();
  const deleteMilestone = useDeleteMilestone();
  const updateProgress = useUpdateMilestoneProgress();
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MilestoneItem | null>(null);
  const { workspaceSlug, projectSlug } = useProjectRouteSlugs();

  const handleCreate = async () => {
    if (!title.trim() || createMilestone.isPending) return;
    await createMilestone.mutateAsync({
      title: title.trim(),
      dueDate: dueDate || undefined,
      projectId,
    });
    setTitle("");
    setDueDate("");
    setShowNew(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleteMilestone.isPending) return;
    await deleteMilestone.mutateAsync({ milestoneId: deleteTarget.id, projectId });
    setDeleteTarget(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <FeatureListError feature="milestones" error={error} />;
  }

  const items = stats?.milestones ?? [];

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <StatCard label="Total" value={stats.total} color="text-muted-foreground" />
          <StatCard label="On Track" value={stats.onTrack} color="text-emerald-500" />
          <StatCard label="At Risk" value={stats.atRisk} color="text-amber-500" />
          <StatCard label="Delayed" value={stats.delayed} color="text-red-500" />
          <StatCard label="Completed" value={stats.completed} color="text-blue-500" />
        </div>
      )}

      {/* Progress bar */}
      {stats && stats.total > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Overall Progress</span>
            <span>{stats.avgProgress}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-colors duration-500"
              style={{ width: `${stats.avgProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Milestone list */}
      <div className="space-y-2">
        {items.map((milestone) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            tasksHref={
              workspaceSlug && projectSlug
                ? `/dashboard/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks?milestone=${milestone.id}`
                : undefined
            }
            onDelete={() => setDeleteTarget(milestone)}
            onUpdateProgress={(p) => updateProgress.mutateAsync({ milestoneId: milestone.id, projectId, progress: p })}
          />
        ))}

        {items.length === 0 && !showNew && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            <Flag className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>No milestones yet — set key project milestones to track progress.</p>
          </div>
        )}

        {/* New milestone form */}
        {showNew ? (
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <input aria-label="Milestone title..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Milestone title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
            />
            <div className="flex items-center gap-2">
              <input aria-label="Date"
                type="date"
                className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <Button
                onClick={handleCreate}
                disabled={!title.trim() || createMilestone.isPending}
                className="h-auto px-3 py-1.5 text-xs font-semibold hover:opacity-90"
              >
                {createMilestone.isPending ? "Creating..." : "Create"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNew(false)}
                className="h-auto px-3 py-1.5 text-xs hover:bg-accent"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setShowNew(true)}
            className="w-full h-auto gap-2 py-2.5 rounded-xl border-dashed text-sm text-muted-foreground hover:text-foreground hover:border-solid hover:border-border"
          >
            <Plus size={16} />
            Add Milestone
          </Button>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete milestone?"
        message={`This will delete "${deleteTarget?.title}". Linked tasks stay untouched.`}
        confirmText="Delete"
        isLoading={deleteMilestone?.isPending}
      />
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

function MilestoneCard({
  milestone,
  tasksHref,
  onDelete,
  onUpdateProgress,
}: {
  milestone: MilestoneItem;
  tasksHref?: string;
  onDelete: () => void;
  onUpdateProgress: (progress: number) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const statusClass = STATUS_COLORS[milestone.status] ?? "text-muted-foreground";

  const dangerIcon = milestone.status === "AT_RISK" || milestone.status === "DELAYED"
    ? <AlertTriangle size={14} className="text-amber-500" />
    : milestone.status === "COMPLETED"
    ? <CheckCircle2 size={14} className="text-blue-500" />
    : null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusClass}`}>
              {STATUS_LABELS[milestone.status]}
            </span>
            {dangerIcon}
          </div>
          <h4 className="text-sm font-semibold text-foreground">{milestone.title}</h4>
          {milestone.description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{milestone.description}</p>
          )}
        </div>
        <div className="relative">
          <Button
            aria-label="Delete"
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
            className="h-auto w-auto p-1 rounded-lg"
          >
            <MoreHorizontal size={14} className="text-muted-foreground" />
          </Button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} role="presentation" />
              <div className="absolute right-0 top-8 z-20 w-32 rounded-lg border border-border bg-popover shadow-lg py-1">
                <Button onClick={onDelete} variant="ghost" className="h-auto w-full justify-start px-3 py-1.5 text-left text-xs text-red-500 hover:bg-accent">
                  <Trash2 size={12} /> Delete
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Progress slider */}
      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-colors duration-300"
            style={{ width: `${milestone.progress}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground w-8 text-right">{milestone.progress}%</span>
      </div>

      {/* Quick progress buttons */}
      <div className="mt-2 flex gap-1">
        {[0, 25, 50, 75, 100].map((pct) => (
          <Button
            key={pct}
            variant="ghost"
            onClick={() => onUpdateProgress(pct)}
            className={`h-auto flex-1 py-1 rounded text-[10px] font-medium ${
              milestone.progress === pct
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            {pct}%
          </Button>
        ))}
      </div>

      {milestone.dueDate && (
        <p className="mt-2 text-[10px] text-muted-foreground">
          Due: {new Date(milestone.dueDate).toLocaleDateString("en-US", { timeZone: "UTC" })}
        </p>
      )}

      {/* Linked tasks summary (auto-derived from tasks when present) */}
      {milestone.tasks && milestone.tasks.length > 0 && (
        <div className="mt-2 flex items-center justify-between rounded-lg bg-muted/50 px-2.5 py-1.5">
          <span className="text-[10px] text-muted-foreground">
            {milestone.tasksDone ?? 0}/{milestone.tasks.length} linked task{milestone.tasks.length === 1 ? "" : "s"} done
          </span>
          {tasksHref && (
            <Link href={tasksHref} className="inline-flex items-center gap-1 text-[10px] font-medium text-primary hover:underline transition">
              <ExternalLink className="size-3" /> View tasks
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
