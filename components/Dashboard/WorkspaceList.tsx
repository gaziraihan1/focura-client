import Link from "next/link";
import type { Workspace } from "@/hooks/useWorkspace";
import { Plus } from "lucide-react";

const ROLE_STYLES: Record<string, string> = {
  OWNER:  "bg-green-500/10 text-green-700",
  ADMIN:  "bg-blue-500/10 text-blue-700",
  MEMBER: "bg-muted text-muted-foreground",
  GUEST:  "bg-muted text-muted-foreground",
};

export function WorkspaceList({ workspaces }: { workspaces: Workspace[] }) {
  return (
    <div className="bg-card border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium">Your workspaces</h2>
        <Link href="/dashboard/workspaces" className="text-xs text-muted-foreground hover:text-foreground">
          View all →
        </Link>
      </div>

      <div className="space-y-1">
        {workspaces.slice(0, 4).map((ws) => (
          <Link
            key={ws.id}
            href={`/dashboard/workspaces/${ws.slug}`}
            className="flex items-center gap-3 py-2 px-1 rounded-lg hover:bg-accent/50 transition group"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-medium shrink-0"
              style={{ backgroundColor: ws.color || "#667eea" }}
            >
              {ws.logo || ws.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate group-hover:text-primary transition">
                {ws.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {ws._count.projects} project{ws._count.projects !== 1 ? "s" : ""} ·{" "}
                {ws._count.members} member{ws._count.members !== 1 ? "s" : ""}
              </p>
            </div>
            {/* role derived from members — show owner's role */}
            <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
              ws.ownerId === ws.owner.id ? ROLE_STYLES.OWNER : ROLE_STYLES.MEMBER
            }`}>
              {ws.ownerId === ws.owner.id ? "Owner" : "Member"}
            </span>
          </Link>
        ))}

        <Link
          href="/dashboard/workspaces/new-workspace"
          className="flex items-center gap-3 py-2 px-1 rounded-lg hover:bg-accent/50 transition opacity-60 hover:opacity-100"
        >
          <div className="w-8 h-8 rounded-lg border border-dashed border-border flex items-center justify-center">
            <Plus size={14} className="text-muted-foreground" />
          </div>
          <span className="text-sm text-muted-foreground">Create new workspace</span>
        </Link>
      </div>
    </div>
  );
}