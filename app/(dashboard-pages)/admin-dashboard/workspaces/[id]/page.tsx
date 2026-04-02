'use client';

import { useParams }            from 'next/navigation';
import { Building2, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow }  from 'date-fns';
import { useAdminWorkspaceDetail } from '@/hooks/useAdmin';
import { Avatar }               from '@/components/Shared/Avatar';
import Link from 'next/link';

export default function AdminWorkspaceDetailPage() {
  const { id } = useParams();
  const { data: workspace, isLoading } = useAdminWorkspaceDetail(id as string);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!workspace) return <p className="text-muted-foreground">Workspace not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/workspaces"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <Building2 className="w-5 h-5 text-primary" />
        <h1 className="text-xl font-bold text-foreground">{workspace.name}</h1>
        <span className="px-2 py-0.5 rounded-full bg-muted border border-border text-[10px] font-semibold uppercase">
          {workspace.plan}
        </span>
      </div>

      {/* Owner + meta */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Members',  value: workspace._count.members },
          { label: 'Projects', value: workspace._count.projects },
          { label: 'Created',  value: formatDistanceToNow(new Date(workspace.createdAt), { addSuffix: true }) },
        ].map(({ label, value }) => (
          <div key={label} className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-bold text-foreground mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">
              Members ({workspace.members.length})
            </h2>
          </div>
          <div className="divide-y divide-border/50 max-h-96 overflow-y-auto">
            {workspace.members.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-5 py-3">
                <Avatar name={m.user.name} image={m.user.image} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{m.user.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{m.user.email}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border font-medium uppercase shrink-0">
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">
              Projects ({workspace.projects.length})
            </h2>
          </div>
          <div className="divide-y divide-border/50 max-h-96 overflow-y-auto">
            {workspace.projects.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3 gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.status}</p>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground shrink-0">
                  <span>{p._count.tasks} tasks</span>
                  <span>{p._count.members} members</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}