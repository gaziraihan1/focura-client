import { Check, Loader2, Palette } from "lucide-react";
import { Section } from "./Section";
import { ProjectDetails, useUpdateProject } from "@/hooks/useProjects";
import { useState } from "react";

const PRESET_COLORS = [
  "#667eea", "#f59e0b", "#10b981", "#ef4444",
  "#8b5cf6", "#06b6d4", "#f97316", "#ec4899",
  "#14b8a6", "#6366f1", "#84cc16", "#a855f7",
];


export function AppearanceTab({
  project,
  canManage,
}: {
  project?: ProjectDetails;
  canManage: boolean;
}) {
  const [selected, setSelected] = useState<string>(project?.color ?? "#667eea");
  const [custom,   setCustom]   = useState("");
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  const activeColor = custom || selected;
  const updateProject = useUpdateProject();

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    if ( saving || !project?.id) return;
    await updateProject.mutateAsync({
      projectId: project.id,
      data: { color: activeColor },
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      <Section
        title="Project Color"
        description="Choose a color to identify this project across the dashboard."
      >
        <div className="space-y-4">
          {/* Preview */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-md transition-all duration-300"
              style={{ backgroundColor: activeColor }}
            >
              {project?.name?.charAt(0).toUpperCase() ?? "P"}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{project?.name ?? "Project"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Preview</p>
              <p className="text-[10px] font-mono text-muted-foreground mt-1">{activeColor}</p>
            </div>
          </div>

          {/* Preset grid */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Presets
            </p>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCustom(""); setSelected(c); }}
                  disabled={!canManage}
                  className="relative w-8 h-8 rounded-lg transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ backgroundColor: c }}
                  title={c}
                >
                  {selected === c && !custom && (
                    <Check size={12} className="absolute inset-0 m-auto text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom hex */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Custom Hex
            </label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg shrink-0 border border-border transition-all"
                style={{ backgroundColor: activeColor }}
              />
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                disabled={!canManage}
                placeholder="#667eea"
                maxLength={7}
                className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm font-mono text-foreground
                           placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring
                           disabled:opacity-50 disabled:cursor-not-allowed transition"
              />
            </div>
          </div>

          {canManage && (
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className={[
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                  saved
                    ? "bg-emerald-500 text-white"
                    : "bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40",
                ].join(" ")}
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Palette size={14} />}
                {saved ? "Applied!" : saving ? "Applying…" : "Apply Color"}
              </button>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}