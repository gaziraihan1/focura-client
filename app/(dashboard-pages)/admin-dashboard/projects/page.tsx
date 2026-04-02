'use client';

import { useState }            from 'react';
import { FolderOpen, Search }  from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAdminProjects, useAdminPagination } from '@/hooks/useAdmin';
import { Pagination }          from '@/components/Shared/Pagination';
import { cn }                  from '@/lib/utils';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:    'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
  PLANNING:  'text-primary bg-primary/10 border-primary/20',
  ON_HOLD:   'text-amber-600 bg-amber-500/10 border-amber-500/20',
  COMPLETED: 'text-violet-600 bg-violet-500/10 border-violet-500/20',
  ARCHIVED:  'text-muted-foreground bg-muted border-border',
};

export default function AdminProjectsPage() {
  const { page, setPage, search, handleSearch } = useAdminPagination();
  const [input, setInput] = useState('');
  const { data, isLoading } = useAdminProjects({ page, search, pageSize: 20 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <FolderOpen className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Projects</h1>
          {data?.pagination.totalCount !== undefined && (
            <span className="text-sm text-muted-foreground">({data.pagination.totalCount})</span>
          )}
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value); handleSearch(e.target.value); }}
            placeholder="Search project name…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-border bg-card focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Project', 'Workspace', 'Created by', 'Status', 'Tasks', 'Members', 'Created'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 rounded bg-muted animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : data?.data.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-foreground">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/workspaces/${p.workspace.id}`}
                        className="text-xs text-foreground hover:text-primary transition-colors"
                      >
                        {p.workspace.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-muted-foreground">{p.createdBy.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase',
                        STATUS_COLORS[p.status] ?? STATUS_COLORS['ARCHIVED'],
                      )}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">{p._count.tasks}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">{p._count.members}</td>
                    <td className="px-4 py-3 text-[11px] text-muted-foreground">
                      {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}
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