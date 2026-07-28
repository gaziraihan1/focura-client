import Link from 'next/link';
import type { Workspace } from '@/hooks/useWorkspace';
import { Plus, ArrowRight, Users, FolderOpen } from 'lucide-react';

const ROLE_STYLES: Record<string, string> = {
  OWNER: 'bg-green-500/10 text-green-700 dark:text-green-400',
  MEMBER: 'bg-muted text-muted-foreground',
};

interface WorkspaceListProps {
  workspaces: Workspace[];
}

export function WorkspaceList({ workspaces }: WorkspaceListProps) {
  return (
    <div className="bg-card border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FolderOpen className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">Your workspaces</h2>
        </div>
        <Link
          href="/dashboard/workspaces"
          className="text-xs text-muted-foreground hover:text-foreground transition"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-1">
        {workspaces.slice(0, 4).map((ws) => (
          <Link
            key={ws.id}
            href={`/dashboard/workspaces/${ws.slug}`}
            className="group flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-semibold shrink-0 shadow-sm"
              style={{ backgroundColor: ws.color || '#667eea' }}
            >
              {ws.logo || ws.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate group-hover:text-primary transition">
                  {ws.name}
                </p>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
                    ws.ownerId === ws.owner.id ? ROLE_STYLES.OWNER : ROLE_STYLES.MEMBER
                  }`}
                >
                  {ws.ownerId === ws.owner.id ? 'Owner' : 'Member'}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <FolderOpen className="w-3 h-3" />
                  {ws._count.projects}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  {ws._count.members}
                </span>
              </div>
            </div>
            <ArrowRight
              size={14}
              className="text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition"
            />
          </Link>
        ))}

        <Link
          href="/dashboard/workspaces/new-workspace"
          className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border hover:border-primary/30 hover:bg-accent/30 transition opacity-70 hover:opacity-100"
        >
          <div className="w-10 h-10 rounded-xl border border-dashed border-border flex items-center justify-center">
            <Plus size={16} className="text-muted-foreground" />
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Create new workspace</span>
            <p className="text-xs text-muted-foreground/70">Start fresh with a new team hub</p>
          </div>
        </Link>
      </div>
    </div>
  );
}