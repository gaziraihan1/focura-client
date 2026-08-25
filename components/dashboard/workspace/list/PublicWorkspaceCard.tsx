import Link from "next/link";
import { FolderKanban, Users, ArrowRight, Globe } from "lucide-react";
import { Workspace } from "@/hooks/useWorkspace";

interface PublicWorkspaceCardProps {
  workspace: Workspace;
}

const PLAN_STYLES: Record<string, string> = {
  FREE: "bg-gray-500/10 text-gray-500",
  PRO: "bg-blue-500/10 text-blue-500",
  BUSINESS: "bg-purple-500/10 text-purple-500",
  ENTERPRISE: "bg-orange-500/10 text-orange-500",
};

export function PublicWorkspaceCard({ workspace }: PublicWorkspaceCardProps) {
  const badge =
    PLAN_STYLES[workspace.plan] ?? "bg-gray-500/10 text-gray-500";

  return (
    <Link
      href={`/dashboard/workspaces/${workspace.slug}`}
      className="group block h-full"
    >
      <div className="h-full p-6 rounded-xl bg-card border hover:shadow-xl hover:border-primary/50 transition cursor-pointer flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-3 min-w-0">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold shrink-0"
              style={{ backgroundColor: workspace.color ?? "#667eea" }}
            >
              {workspace.logo ?? workspace.name[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold group-hover:text-primary transition truncate">
                {workspace.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                /{workspace.slug}
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground shrink-0 mt-0.5">
            <Globe size={12} />
            Public
          </span>
        </div>

        {workspace.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {workspace.description}
          </p>
        )}

        {!workspace.description && (
          <div className="flex-1" />
        )}

        <div className="flex gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <FolderKanban size={14} />
            {workspace._count.projects} projects
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} />
            {workspace._count.members} members
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className={`px-2 py-1 text-xs rounded-full ${badge}`}>
            {workspace.plan}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition">
            View workspace
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
