import Link from "next/link";
import { Crown, FolderKanban, Users, Settings } from "lucide-react";
import { useWorkspacesPage } from "@/hooks/useWorkspacePage";
import { Workspace } from "@/hooks/useWorkspace";

interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const { getPlanBadge, navigateToSettings } = useWorkspacesPage();
  const badge = getPlanBadge(workspace.plan);

  const isOwner = workspace.members.some((m) => m.role === "OWNER");

  return (
    <Link href={`/dashboard/workspaces/${workspace.slug}`}>
      <div className="group p-6 rounded-xl bg-card border hover:shadow-xl hover:border-primary/50 transition cursor-pointer">
        <div className="flex justify-between mb-4">
          <div className="flex gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: workspace.color ?? "#667eea" }}
            >
              {workspace.logo ?? workspace.name[0].toUpperCase()}
            </div>

            <div>
              <h3 className="font-semibold group-hover:text-primary transition">
                {workspace.name}
              </h3>
              <p className="text-xs text-muted-foreground">/{workspace.slug}</p>
            </div>
          </div>

          {isOwner && (
            <div className="p-1.5 rounded-lg bg-yellow-500/10">
              <Crown size={14} className="text-yellow-500" />
            </div>
          )}
        </div>

        {workspace.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {workspace.description}
          </p>
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

        <div className="flex justify-between items-center pt-4 border-t">
          <span className={`px-2 py-1 text-xs rounded-full ${badge.color}`}>
            {badge.label}
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              navigateToSettings(workspace.slug);
            }}
            className="p-2 rounded-lg hover:bg-accent"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
