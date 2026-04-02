'use client';

import { Activity }            from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAdminActivity, useAdminPagination } from '@/hooks/useAdmin';
import { Avatar }              from '@/components/Shared/Avatar';
import { Pagination }          from '@/components/Shared/Pagination';
import { cn }                  from '@/lib/utils';
import Link from 'next/link';

const ACTION_COLORS: Record<string, string> = {
  CREATED: 'text-emerald-600 bg-emerald-500/10',
  UPDATED: 'text-primary bg-primary/10',
  DELETED: 'text-destructive bg-destructive/10',
  COMPLETED: 'text-violet-600 bg-violet-500/10',
};

export default function AdminActivityPage() {
  const { page, setPage } = useAdminPagination();
  const { data, isLoading } = useAdminActivity({ page, pageSize: 30 });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5">
        <Activity className="w-5 h-5 text-primary" />
        <h1 className="text-xl font-bold text-foreground">Activity Feed</h1>
        {data?.pagination.totalCount !== undefined && (
          <span className="text-sm text-muted-foreground">({data.pagination.totalCount})</span>
        )}
      </div>

      <div className="space-y-2">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
            ))
          : data?.data.map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors"
              >
                <Avatar name={a.user.name} image={a.user.image} size="sm" />
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-foreground">{a.user.name}</span>
                    <span className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase',
                      ACTION_COLORS[a.action] ?? 'text-muted-foreground bg-muted',
                    )}>
                      {a.action}
                    </span>
                    <span className="text-xs text-muted-foreground">{a.entityType}</span>
                    {a.workspace && (
                      <span className="text-[10px] text-muted-foreground">
                        <Link
                          href={`/admin/workspaces/${a.workspace.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {a.workspace.name}
                        </Link>
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{a.user.email}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                </span>
              </div>
            ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={data?.pagination.totalPages ?? 1}
        onPageChange={setPage}
        itemsPerPage={30}
        totalItems={data?.pagination.totalCount}
      />
    </div>
  );
}