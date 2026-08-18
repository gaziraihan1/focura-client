import { Flame, Users, ChevronRight } from "lucide-react";
import { ProjectData } from "@/types/project.types";
import { MemberAvatars } from "./MemberAvatars"

interface AtAGlanceProps {
  project: ProjectData;
  isOverdue: boolean;
  dueLabel: string;
  totalMembers: number;
  canManage: boolean;
  onManage: () => void;
}


function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AtAGlanceCards({ project, isOverdue, dueLabel, totalMembers, canManage, onManage }: AtAGlanceProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      {/* Deadline card */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <Flame size={15} className={isOverdue ? "text-destructive" : "text-muted-foreground"} />
          </div>
          <p className="text-sm font-semibold text-foreground">Deadline</p>
        </div>

        {project.dueDate ? (
          <div className="space-y-1">
            <p className="text-2xl font-black text-foreground">
              {formatDate(project.dueDate)}
            </p>
            <p
              className={[
                "text-sm font-semibold",
                isOverdue ? "text-destructive" : "text-muted-foreground",
              ].join(" ")}
            >
              {dueLabel}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No deadline set.</p>
        )}
      </div>

      {/* Team card */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Users size={15} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground">Team</p>
          </div>
          {canManage && (
            <button
              onClick={onManage}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              Manage <ChevronRight size={11} />
            </button>
          )}
        </div>

        {totalMembers > 0 ? (
          <div className="flex items-center gap-3">
            <MemberAvatars members={project.members ?? []} max={7} />
            <span className="text-sm text-muted-foreground">
              {totalMembers} member{totalMembers !== 1 ? "s" : ""}
            </span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No members yet.</p>
        )}
      </div>
    </div>
  );
}