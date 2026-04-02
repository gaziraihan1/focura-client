'use client';

import { useState }            from 'react';
import { Users, Search }       from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAdminUsers, useAdminPagination } from '@/hooks/useAdmin';
import { Avatar }              from '@/components/Shared/Avatar';
import { Pagination }          from '@/components/Shared/Pagination';

export default function AdminUsersPage() {
  const { page, setPage, search, handleSearch } = useAdminPagination();
  const [input, setInput] = useState('');
  const { data, isLoading } = useAdminUsers({ page, search, pageSize: 20 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Users className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Users</h1>
          {data?.pagination.totalCount !== undefined && (
            <span className="text-sm text-muted-foreground">({data.pagination.totalCount})</span>
          )}
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value); handleSearch(e.target.value); }}
            placeholder="Search name or email…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-border bg-card focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['User', 'Role', 'Owns', 'Member of', 'Joined'].map((h) => (
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
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 rounded bg-muted animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : data?.data.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={u.name} image={u.image} size="sm" />
                        <div>
                          <p className="text-xs font-medium text-foreground">{u.name}</p>
                          <p className="text-[10px] text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border font-medium uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">
                      {u._count.workspaces} workspace{u._count.workspaces !== 1 ? 's' : ''}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">
                      {u._count.workspaceMember} workspace{u._count.workspaceMember !== 1 ? 's' : ''}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-muted-foreground">
                      {formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}
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