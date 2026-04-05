'use client';

import { useParams, useRouter }           from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Building2, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useAdminWorkspaceDetail, useRestoreWorkspace }     from '@/hooks/useAdmin';
import { Avatar }              from '@/components/Shared/Avatar';
import { StorageBar }          from '@/components/AdminDashboard/StorageBar';
import { DeleteWorkspaceModal } from '@/components/AdminDashboard/Workspace/DeleteWorkspaceModal';
import { cn }                  from '@/lib/utils';
import Link from 'next/link';

function StatPill({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card">
      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-foreground mt-0.5">{value}</p>
    </div>
  );
}

export default function AdminWorkspaceDetailPage() {
  const { slug }  = useParams();
  const { data: ws, isLoading } = useAdminWorkspaceDetail(slug as string);
  const { mutate: restore, isPending: restoring } = useRestoreWorkspace();


  const [ deleteModalOpen, setDeleteModalOpen ] = useState(false);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!ws) return <p className="text-muted-foreground text-sm">Workspace not found.</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href="/admin-dashboard/workspaces"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <Building2 className="w-5 h-5 text-primary" />
        <h1 className="text-xl font-bold text-foreground">{ws.name}</h1>
        <span className="text-xs text-muted-foreground">{ws.slug}</span>
        <span className="px-2 py-0.5 rounded-full bg-muted border border-border text-[10px] font-semibold uppercase">
          {ws.plan}
        </span>
<div className="ml-auto flex items-center gap-2">
  {ws.deletedAt ? (
    <div className="flex items-center gap-2">
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 font-semibold">
        SUSPENDED
      </span>
      <button
        onClick={() => restore(ws.slug)}
        disabled={restoring}
        className="text-[11px] px-2.5 py-1 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40"
      >
        {restoring ? 'Restoring…' : 'Restore'}
      </button>
    </div>
  ) : (
    <button
      onClick={() => setDeleteModalOpen(true)}
      className="text-[11px] px-2.5 py-1 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
    >
      Delete Workspace
    </button>
  )}
</div>

      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatPill label="Members"       value={`${ws._count.members} / ${ws.maxMembers === -1 ? '∞' : ws.maxMembers}`} />
        <StatPill label="Projects"      value={ws._count.projects} />
        <StatPill label="Tasks"         value={ws._count.tasks} />
        <StatPill label="Meetings"      value={ws._count.meetings} />
        <StatPill label="Announcements" value={ws._count.announcements} />
      </div>

      {/* Storage */}
      <div className="p-5 rounded-xl border border-border bg-card space-y-2">
        <p className="text-sm font-semibold text-foreground">Storage</p>
        <StorageBar usedMb={ws.usedStorageMb} maxMb={ws.maxStorageMb} />
        <p className="text-xs text-muted-foreground">
          Plan limit: {ws.maxStorageMb.toLocaleString()} MB
        </p>
      </div>

      {/* Owner */}
      <div className="p-5 rounded-xl border border-border bg-card flex items-center gap-4">
        <Avatar name={ws.owner.name} image={ws.owner.image} size="sm" />
        <div>
          <p className="text-sm font-semibold text-foreground">{ws.owner.name}</p>
          <p className="text-xs text-muted-foreground">{ws.owner.email}</p>
          <p className="text-[10px] text-muted-foreground">
            Owner · created {formatDistanceToNow(new Date(ws.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Subscription */}
      {ws.subscription && (
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Subscription</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <p className="text-muted-foreground">Plan</p>
              <p className="font-semibold text-foreground">{ws.subscription.plan.displayName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-semibold text-foreground">{ws.subscription.status}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Billing</p>
              <p className="font-semibold text-foreground">{ws.subscription.billingCycle}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Renews</p>
              <p className="font-semibold text-foreground">
                {format(new Date(ws.subscription.currentPeriodEnd), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          {/* Plan features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-2 border-t border-border/40">
            {[
              { label: 'Analytics',       val: ws.subscription.plan.analyticsAccess },
              { label: 'Priority Support', val: ws.subscription.plan.prioritySupport },
              { label: 'API Access',       val: ws.subscription.plan.apiAccess },
            ].map(({ label, val }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs">
                {val
                  ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  : <XCircle     className="w-3.5 h-3.5 text-muted-foreground" />}
                <span className={val ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
              </div>
            ))}
          </div>

          {/* Recent invoices */}
          {ws.subscription.invoices.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border/40">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Recent Invoices
              </p>
              {ws.subscription.invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {inv.periodStart ? format(new Date(inv.periodStart), 'MMM yyyy') : '—'}
                  </span>
                  <span className="font-medium text-foreground">
                    {(inv.amountPaid / 100).toLocaleString('en-US', { style: 'currency', currency: inv.currency.toUpperCase() })}
                  </span>
                  <span className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase',
                    inv.status === 'PAID'
                      ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'
                      : 'text-muted-foreground bg-muted border-border',
                  )}>
                    {inv.status}
                  </span>
                  {inv.invoicePdf && (
                    <Link
                      href={inv.invoicePdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      PDF
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">
              Members ({ws.members.length})
            </h2>
          </div>
          <div className="divide-y divide-border/50 max-h-80 overflow-y-auto">
            {ws.members.map((m) => (
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
              Projects ({ws.projects.length})
            </h2>
          </div>
          <div className="divide-y divide-border/50 max-h-80 overflow-y-auto">
            {ws.projects.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3 gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">by {p.createdBy.name}</p>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground shrink-0 tabular-nums">
                  <span>{p._count.tasks} tasks</span>
                  <span>{p._count.members} members</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted uppercase font-medium">
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <DeleteWorkspaceModal
      workspaceName={ws.name}
      workspaceSlug={ws.slug}
      isOpen={deleteModalOpen}
      onClose={() => setDeleteModalOpen(false)}
      onSuccess={() => router.push('/admin-dashboard/workspaces')}
      />
    </div>
  );
}