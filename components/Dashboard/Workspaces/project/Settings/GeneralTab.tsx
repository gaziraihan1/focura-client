import { ProjectDetails, useUpdateProject } from "@/hooks/useProjects";
import { Check, Loader2, Save, Lock } from "lucide-react";
import { useState } from "react";
import { Section } from "./Section";

export function GeneralTab({
  project,
  canManage,
}: {
  project?: ProjectDetails  ;
  canManage: boolean;
}) {
  const [name,        setName]        = useState(project?.name        ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [saved,       setSaved]       = useState(false);
 
  const updateProject = useUpdateProject();
  const saving = updateProject.isPending;
 
  const isDirty =
    name !== (project?.name ?? "") ||
    description !== (project?.description ?? "");
 
  const handleSave = async () => {
    if (!isDirty || saving || !project?.id) return;
    await updateProject.mutateAsync({
      projectId: project.id,
      data: { name: name.trim(), description: description.trim() },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
 
  return (
    <div className="space-y-5">
      <Section
        title="Project Info"
        description="Update the project's name and description."
      >
        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Project Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!canManage}
              maxLength={80}
              placeholder="Project name…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground
                         placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring
                         disabled:opacity-50 disabled:cursor-not-allowed transition"
            />
          </div>
 
          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!canManage}
              rows={3}
              maxLength={500}
              placeholder="Describe this project…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground
                         placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring
                         disabled:opacity-50 disabled:cursor-not-allowed transition resize-none"
            />
            <p className="text-[10px] text-muted-foreground text-right">
              {description.length}/500
            </p>
          </div>
 
          {canManage && (
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={!isDirty || saving}
                className={[
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                  saved
                    ? "bg-emerald-500 text-white"
                    : "bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed",
                ].join(" ")}
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : saved ? (
                  <Check size={14} />
                ) : (
                  <Save size={14} />
                )}
                {saved ? "Saved!" : saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </Section>
 
      {/* Visibility info */}
      <Section
        title="Project Visibility"
        description="Visibility is managed at the workspace level. Contact a workspace admin to change it."
      >
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/50 border border-border">
          <Lock size={14} className="text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">
            Visibility settings are inherited from the workspace and cannot be changed here.
          </p>
        </div>
      </Section>
    </div>
  );
}