import { ProjectDetails, useDeleteProject, useUpdateProject } from "@/hooks/useProjects";
import { AlertTriangle, Loader2, Shield, Trash2, Lock, ArchiveRestore, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Section } from "./Section";
import { useState } from "react";

type ProjectStatus = "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "PLANNING",  label: "Planning"   },
  { value: "ACTIVE",    label: "Active"     },
  { value: "ON_HOLD",   label: "On Hold"    },
  { value: "COMPLETED", label: "Completed"  },
];

const STATUS_STYLES: Record<ProjectStatus, string> = {
  PLANNING:  "bg-blue-100   text-blue-700   dark:bg-blue-950/40   dark:text-blue-300",
  ACTIVE:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  ON_HOLD:   "bg-amber-100  text-amber-700  dark:bg-amber-950/40  dark:text-amber-300",
  COMPLETED: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
  ARCHIVED:  "bg-muted      text-muted-foreground",
};

export function DangerTab({
  project,
  canManage,
  isOwnerOrAdmin,
  workspaceSlug,
}: {
  project?: ProjectDetails;
  canManage: boolean;
  isOwnerOrAdmin: boolean;
  workspaceSlug: string;
}) {
  const router = useRouter();
  const [archiveConfirm, setArchiveConfirm] = useState("");
  const [deleteConfirm,  setDeleteConfirm]  = useState("");
  const [archiving,      setArchiving]      = useState(false);
  const [unarchiving,    setUnarchiving]    = useState(false);
  const [deleting,       setDeleting]       = useState(false);
  const [newStatus,      setNewStatus]      = useState<ProjectStatus>("ACTIVE");

  const projectName  = project?.name   ?? "";
  const isArchived   = project?.status === "ARCHIVED";
  const updateProject       = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  // ── Archive ────────────────────────────────────────────────────────────────
  const handleArchive = async () => {
    if (archiving || archiveConfirm !== projectName || !project?.id) return;
    setArchiving(true);
    try {
      await updateProject.mutateAsync({
        projectId: project.id,
        data: { status: "ARCHIVED" },
      });
      setArchiveConfirm("");
    } finally {
      setArchiving(false);
    }
  };

  // ── Unarchive ──────────────────────────────────────────────────────────────
  const handleUnarchive = async () => {
    if (unarchiving || !project?.id) return;
    setUnarchiving(true);
    try {
      await updateProject.mutateAsync({
        projectId: project.id,
        data: { status: newStatus },
      });
    } finally {
      setUnarchiving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (deleting || deleteConfirm !== projectName || !project?.id) return;
    setDeleting(true);
    try {
      await deleteProjectMutation.mutateAsync(project.id);
      router.push(`/dashboard/workspaces/${workspaceSlug}/projects`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">

      {/* ── Unarchive — shown when project is archived ─────────────────────── */}
      {isArchived && canManage && (
        <Section
          title="Unarchive Project"
          description="Restore this project to an active status so members can resume work."
        >
          <div className="space-y-4">
            <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50">
              <ArchiveRestore size={14} className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                Restoring this project will re-enable task creation, announcements and all member actions.
              </p>
            </div>

            {/* Status picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Restore as
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setNewStatus(s.value)}
                    className={[
                      "px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
                      newStatus === s.value
                        ? `${STATUS_STYLES[s.value]} border-current ring-1 ring-current/30`
                        : "border-border text-muted-foreground hover:bg-accent",
                    ].join(" ")}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleUnarchive}
              disabled={unarchiving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                         bg-emerald-500 text-white hover:bg-emerald-600 transition-all
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {unarchiving
                ? <Loader2 size={14} className="animate-spin" />
                : <ArchiveRestore size={14} />}
              {unarchiving ? "Restoring…" : `Restore as ${STATUS_OPTIONS.find(s => s.value === newStatus)?.label}`}
            </button>
          </div>
        </Section>
      )}

      {/* ── Archive — only shown when NOT archived ────────────────────────── */}
      {!isArchived && canManage && (
        <Section
          title="Archive Project"
          description="Archiving hides the project from active lists but preserves all data. You can unarchive it later."
          danger
        >
          <div className="space-y-3">
            <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
              <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                Members will lose access to active project features while archived. Tasks and history are preserved.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Type <span className="font-mono bg-muted px-1 py-0.5 rounded text-foreground">{projectName}</span> to confirm
              </label>
              <input
                value={archiveConfirm}
                onChange={(e) => setArchiveConfirm(e.target.value)}
                placeholder={projectName}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground
                           placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/30 transition"
              />
            </div>

            <button
              disabled={archiveConfirm !== projectName || archiving}
              onClick={handleArchive}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                         bg-amber-500 text-white hover:bg-amber-600 transition-all
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {archiving ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
              {archiving ? "Archiving…" : "Archive Project"}
            </button>
          </div>
        </Section>
      )}

      {/* ── Change Status — shown when not archived ───────────────────────── */}
      {!isArchived && canManage && (
        <Section
          title="Change Status"
          description="Update the current project status without archiving."
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() =>
                    project?.id &&
                    updateProject.mutateAsync({ projectId: project.id, data: { status: s.value } })
                  }
                  disabled={project?.status === s.value || updateProject.isPending}
                  className={[
                    "px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
                    project?.status === s.value
                      ? `${STATUS_STYLES[s.value]} border-current ring-1 ring-current/30 cursor-default`
                      : "border-border text-muted-foreground hover:bg-accent disabled:opacity-40",
                  ].join(" ")}
                >
                  {updateProject.isPending && project?.status !== s.value
                    ? <RefreshCw size={11} className="animate-spin mx-auto" />
                    : s.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Current status: <span className={`font-semibold px-1.5 py-0.5 rounded-md text-[10px] ${STATUS_STYLES[project?.status as ProjectStatus ?? "ACTIVE"]}`}>{project?.status ?? "—"}</span>
            </p>
          </div>
        </Section>
      )}

      {/* ── Delete — workspace admins/owners only ─────────────────────────── */}
      {isOwnerOrAdmin && (
        <Section
          title="Delete Project"
          description="Permanently delete this project and all associated tasks, announcements and data. This cannot be undone."
          danger
        >
          <div className="space-y-3">
            <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-destructive/8 border border-destructive/20">
              <Trash2 size={14} className="text-destructive mt-0.5 shrink-0" />
              <p className="text-xs text-destructive/90 leading-relaxed">
                <strong>This is irreversible.</strong> All tasks, announcements, files and member associations will be permanently deleted.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Type <span className="font-mono bg-muted px-1 py-0.5 rounded text-foreground">{projectName}</span> to confirm deletion
              </label>
              <input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder={projectName}
                className="w-full px-3.5 py-2.5 rounded-xl border border-destructive/30 bg-background text-sm text-foreground
                           placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-destructive/30 transition"
              />
            </div>

            <button
              disabled={deleteConfirm !== projectName || deleting}
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                         bg-destructive text-white hover:bg-destructive/90 transition-all
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              {deleting ? "Deleting…" : "Delete Project Forever"}
            </button>
          </div>
        </Section>
      )}

      {!canManage && !isOwnerOrAdmin && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <Lock size={20} className="text-muted-foreground/50" />
          </div>
          <p className="text-sm text-muted-foreground">
            You don&apos;t have permission to access danger zone settings.
          </p>
        </div>
      )}
    </div>
  );
}