import { formatDate } from "@/app/(dashboard-pages)/dashboard/workspaces/[workspaceSlug]/projects/[projectSlug]/page";
import { ProjectData } from "@/types/project.types";
import { Activity, Calendar, Target } from "lucide-react";
import { MemberAvatars } from "./MemberAvatars";
import { ProgressRing } from "./ProgressRing";

interface ProjectHeaderProps {
  project: ProjectData;
  accentColor: string;
  completionPct: number;
  isOverdue: boolean;
  dueLabel: string;
  totalMembers: number;
}

export function ProjectHeader({
  project,
  accentColor,
  completionPct,
  isOverdue,
  dueLabel,
  totalMembers,
}: ProjectHeaderProps) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-border p-6 sm:p-8"
      style={{
        background: `linear-gradient(135deg, ${accentColor}22 0%, ${accentColor}08 60%, var(--card) 100%)`,
      }}
    >
      {/* Decorative blob */}
      <div
        className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 blur-2xl pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative flex flex-col sm:flex-row sm:items-start gap-5">
        {/* Avatar */}
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-lg"
          style={{ backgroundColor: accentColor }}
        >
          {project.name.charAt(0).toUpperCase()}
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-none">
              {project.name}
            </h1>

            {/* Status badge */}
            <span
              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: `${accentColor}20`,
                color: accentColor,
              }}
            >
              <Activity size={10} />
              {(project as ProjectData).status ?? "Active"}
            </span>
          </div>

          {project.description ? (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              {project.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground/50 italic">
              No description added yet.
            </p>
          )}

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              Created {formatDate((project as ProjectData).createdAt)}
            </span>

            {(project as ProjectData).dueDate && (
              <span
                className={[
                  "flex items-center gap-1 font-medium",
                  isOverdue ? "text-destructive" : "",
                ].join(" ")}
              >
                <Target size={11} />
                {dueLabel}
                {isOverdue && " ⚠"}
              </span>
            )}

            {totalMembers > 0 && (
              <span className="flex items-center gap-2">
                <MemberAvatars members={project.members ?? []} />
                <span>
                  {totalMembers} member{totalMembers !== 1 ? "s" : ""}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Completion ring */}
        <div className="relative shrink-0 flex items-center justify-center">
          <ProgressRing
            pct={completionPct}
            size={88}
            stroke={7}
            color={accentColor}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black text-foreground leading-none">
              {completionPct}%
            </span>
            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wide">
              done
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
