'use client';

import { useState }             from 'react';
import { Building2, Search }    from 'lucide-react';
import { formatDistanceToNow }  from 'date-fns';
import { useAdminWorkspaces, useAdminPagination } from '@/hooks/useAdmin';
import { Pagination }           from '@/components/Shared/Pagination';
import Link from 'next/link';

export default function AdminWorkspacesPage() {
  const { page, setPage, search, handleSearch } = useAdminPagination();
  const [input, setInput] = useState('');

  const { data, isLoading } = useAdminWorkspaces({ page, search, pageSize: 20 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Building2 className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Workspaces</h1>
          {data?.pagination.totalCount !== undefined && (
            <span className="text-sm text-muted-foreground">({data.pagination.totalCount})</span>
          )}
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value); handleSearch(e.target.value); }}
            placeholder="Search name, slug, owner…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-border bg-card focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Workspace', 'Owner', 'Plan', 'Members', 'Projects', 'Tasks', 'Created'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 rounded bg-muted animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : data?.data.map((w) => (
                  <tr key={w.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin-dashboard/workspaces/${w.id}`}
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {w.name}
                      </Link>
                      <p className="text-[10px] text-muted-foreground">{w.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-foreground">{w.owner.name}</p>
                      <p className="text-[10px] text-muted-foreground">{w.owner.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-muted border border-border text-[10px] font-semibold uppercase">
                        {w.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">{w._count.members}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">{w._count.projects}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">{w._count.tasks}</td>
                    <td className="px-4 py-3 text-[11px] text-muted-foreground">
                      {formatDistanceToNow(new Date(w.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={data?.pagination.totalPages ?? 1}
        onPageChange={setPage}
        itemsPerPage={20}
        totalItems={data?.pagination.totalCount}
      />
    </div>
  );
}