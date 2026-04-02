'use client';

import { useState, useCallback } from 'react';
import { useQuery }              from '@tanstack/react-query';
import { api }                   from '@/lib/axios';
import type {
  AdminStats,
  AdminWorkspace,
  AdminWorkspaceDetail,
  AdminUser,
  AdminProject,
  AdminActivity,
  AdminPaginatedResponse,
} from '@/types/admin.types';

// ─── Query keys ───────────────────────────────────────────────────────────────

export const adminKeys = {
  all:             ['admin']                              as const,
  stats:           ['admin', 'stats']                    as const,
  workspaces:      (p: object) => ['admin', 'workspaces', p]       as const,
  workspaceDetail: (id: string) => ['admin', 'workspaces', id]     as const,
  users:           (p: object) => ['admin', 'users', p]            as const,
  projects:        (p: object) => ['admin', 'projects', p]         as const,
  activity:        (p: object) => ['admin', 'activity', p]         as const,
};

// ─── Shared param builder ─────────────────────────────────────────────────────

function buildParams(p: {
  page?: number; pageSize?: number; search?: string; workspaceId?: string;
}): string {
  const params = new URLSearchParams();
  if (p.page)        params.append('page',        String(p.page));
  if (p.pageSize)    params.append('pageSize',    String(p.pageSize));
  if (p.search)      params.append('search',      p.search);
  if (p.workspaceId) params.append('workspaceId', p.workspaceId);
  return params.toString();
}

async function fetchAdmin<T>(url: string): Promise<T> {
  const res = await api.get<never>(url) as unknown as T;
  return res;
}

// ─── Pagination state helper ──────────────────────────────────────────────────

export function useAdminPagination(defaultPageSize = 20) {
  const [page,     setPage]     = useState(1);
  const [search,   setSearch]   = useState('');
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const handleSearch = useCallback((v: string) => {
    setSearch(v);
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setPage(1);
    setSearch('');
  }, []);

  return { page, setPage, search, handleSearch, pageSize, setPageSize, reset };
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats,
    staleTime: 60 * 1000,
    queryFn: async () => {
      const res = await fetchAdmin<{ data: AdminStats }>('/api/admin/stats');
      return res.data;
    },
  });
}

// ─── Workspaces ───────────────────────────────────────────────────────────────

export function useAdminWorkspaces(params: {
  page?: number; pageSize?: number; search?: string;
}) {
  return useQuery({
    queryKey:        adminKeys.workspaces(params),
    staleTime:       30 * 1000,
    placeholderData: (prev) => prev,
    queryFn: async () => {
      const res = await fetchAdmin<AdminPaginatedResponse<AdminWorkspace>>(
        `/api/admin/workspaces?${buildParams(params)}`,
      );
      return res;
    },
  });
}

export function useAdminWorkspaceDetail(id: string) {
  return useQuery({
    queryKey: adminKeys.workspaceDetail(id),
    enabled:  !!id,
    staleTime: 30 * 1000,
    queryFn: async () => {
      const res = await fetchAdmin<{ data: AdminWorkspaceDetail }>(
        `/api/admin/workspaces/${id}`,
      );
      return res.data;
    },
  });
}

// ─── Users ────────────────────────────────────────────────────────────────────

export function useAdminUsers(params: {
  page?: number; pageSize?: number; search?: string;
}) {
  return useQuery({
    queryKey:        adminKeys.users(params),
    staleTime:       30 * 1000,
    placeholderData: (prev) => prev,
    queryFn: async () => {
      const res = await fetchAdmin<AdminPaginatedResponse<AdminUser>>(
        `/api/admin/users?${buildParams(params)}`,
      );
      return res;
    },
  });
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export function useAdminProjects(params: {
  page?: number; pageSize?: number; search?: string; workspaceId?: string;
}) {
  return useQuery({
    queryKey:        adminKeys.projects(params),
    staleTime:       30 * 1000,
    placeholderData: (prev) => prev,
    queryFn: async () => {
      const res = await fetchAdmin<AdminPaginatedResponse<AdminProject>>(
        `/api/admin/projects?${buildParams(params)}`,
      );
      return res;
    },
  });
}

// ─── Activity ─────────────────────────────────────────────────────────────────

export function useAdminActivity(params: {
  page?: number; pageSize?: number;
}) {
  return useQuery({
    queryKey:        adminKeys.activity(params),
    staleTime:       15 * 1000,
    placeholderData: (prev) => prev,
    queryFn: async () => {
      const res = await fetchAdmin<AdminPaginatedResponse<AdminActivity>>(
        `/api/admin/activity?${buildParams(params)}`,
      );
      return res;
    },
  });
}