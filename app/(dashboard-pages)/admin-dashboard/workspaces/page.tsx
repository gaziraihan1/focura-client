'use client';

import { Building2 }           from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAdminWorkspaces, useAdminPagination } from '@/hooks/useAdmin';
import { AdminTable }          from '@/components/AdminDashboard/AdminTable';
import { AdminPageHeader }     from '@/components/AdminDashboard/AdminPageHeader';
import { StorageBar }          from '@/components/AdminDashboard/StorageBar';
import { Pagination }          from '@/components/Shared/Pagination';
import { Avatar }              from '@/components/Shared/Avatar';
import { cn }                  from '@/lib/utils';
import type { AdminWorkspace } from '@/types/admin.types';
import Link from 'next/link';

const PLAN_COLORS: Record<string, string> = {
  FREE:       'text-muted-foreground bg-muted border-border',
  PRO:        'text-primary bg-primary/10 border-primary/20',
  BUSINESS:   'text-violet-600 bg-violet-500/10 border-violet-500/20',
  ENTERPRISE: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
};

const SUB_STATUS_COLORS: Record<string, string> = {
  ACTIVE:   'text-emerald-600',
  PAST_DUE: 'text-destructive',
  CANCELED: 'text-muted-foreground',
  TRIALING: 'text-primary',
};

export default function AdminWorkspacesPage() {
  const { page, setPage, search, handleSearch, pageSize } = useAdminPagination();
  const { data, isLoading } = useAdminWorkspaces({ page, search, pageSize });

  const columns = [
    {
      key: 'workspace',
      header: 'Workspace',
      render: (w: AdminWorkspace) => (
        <div>
          <Link
            href={`/admin-dashboard/workspaces/${w.slug}`}
            className="text-xs font-semibold text-foreground hover:text-primary transition-colors"
          >
            {w.name}
          </Link>
          <p className="text-[10px] text-muted-foreground">{w.slug}</p>
        </div>
      ),
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (w: AdminWorkspace) => (
        <div className="flex items-center gap-2">
          <Avatar name={w.owner.name} image={w.owner.image} size="sm" />
          <div>
            <p className="text-xs text-foreground">{w.owner.name}</p>
            <p className="text-[10px] text-muted-foreground">{w.owner.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'plan',
      header: 'Plan',
      render: (w: AdminWorkspace) => (
        <div className="space-y-1">
          <span className={cn(
            'text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase',
            PLAN_COLORS[w.plan] ?? PLAN_COLORS['FREE'],
          )}>
            {w.plan}
          </span>
          {w.subscription && (
            <p className={cn('text-[10px]', SUB_STATUS_COLORS[w.subscription.status] ?? 'text-muted-foreground')}>
              {w.subscription.status}
              {w.subscription.cancelAtPeriodEnd && ' · cancels'}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'members',
      header: 'Members',
      render: (w: AdminWorkspace) => (
        <div>
          <p className="text-xs tabular-nums text-foreground">
            {w._count.members} / {w.maxMembers === -1 ? '∞' : w.maxMembers}
          </p>
        </div>
      ),
    },
    {
      key: 'storage',
      header: 'Storage',
      render: (w: AdminWorkspace) => (
        <div className="w-32">
          <StorageBar usedMb={w.usedStorageMb} maxMb={w.maxStorageMb} />
        </div>
      ),
    },
    {
      key: 'stats',
      header: 'Projects / Tasks',
      render: (w: AdminWorkspace) => (
        <p className="text-xs text-muted-foreground tabular-nums">
          {w._count.projects} / {w._count.tasks}
        </p>
      ),
    },
    {
      key: 'created',
      header: 'Created',
      render: (w: AdminWorkspace) => (
        <p className="text-[11px] text-muted-foreground whitespace-nowrap">
          {formatDistanceToNow(new Date(w.createdAt), { addSuffix: true })}
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={<Building2 className="w-5 h-5 text-primary" />}
        title="Workspaces"
        count={data?.pagination.totalCount}
        search={search}
        onSearch={handleSearch}
        placeholder="Search name, slug, owner…"
      />

      <AdminTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
      />

      <Pagination
        currentPage={page}
        totalPages={data?.pagination.totalPages ?? 1}
        onPageChange={setPage}
        itemsPerPage={pageSize}
        totalItems={data?.pagination.totalCount}
      />
    </div>
  );
}