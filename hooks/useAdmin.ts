"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type {
  AdminStats,
  AdminWorkspace,
  AdminWorkspaceDetail,
  AdminUser,
  AdminUserDetail,
  AdminProject,
  AdminBilling,
  AdminActivity,
  AdminPaginatedResponse,
} from "@/types/admin.types";

export const adminKeys = {
  stats: ["admin", "stats"] as const,
  workspaces: (p: object) => ["admin", "workspaces", p] as const,
  workspaceDetail: (slug: string) => ["admin", "workspace", slug] as const,
  users: (p: object) => ["admin", "users", p] as const,
  userDetail: (id: string) => ["admin", "user", id] as const,
  projects: (p: object) => ["admin", "projects", p] as const,
  billing: (p: object) => ["admin", "billing", p] as const,
  activity: (p: object) => ["admin", "activity", p] as const,
};

function buildParams(p: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams();
  Object.entries(p).forEach(([k, v]) => {
    if (v !== undefined && v !== "") params.append(k, String(v));
  });
  return params.toString();
}

async function get<T>(url: string): Promise<T> {
  return api.get<never>(url) as unknown as T;
}

// ─── Pagination state ─────────────────────────────────────────────────────────

export function useAdminPagination(defaultPageSize = 20) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const handleSearch = useCallback((v: string) => {
    setSearch(v);
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setPage(1);
    setSearch("");
  }, []);

  return {
    page,
    setPage,
    search,
    handleSearch,
    pageSize: defaultPageSize,
    reset,
  };
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats,
    staleTime: 60 * 1000,
    queryFn: async () => {
      const res = await get<{ data: AdminStats }>("/api/admin/stats");
      return res.data;
    },
  });
}

export function useAdminWorkspaces(params: {
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: adminKeys.workspaces(params),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
    queryFn: async () =>
      get<AdminPaginatedResponse<AdminWorkspace>>(
        `/api/admin/workspaces?${buildParams(params)}`,
      ),
  });
}

export function useAdminWorkspaceDetail(slug: string) {
  return useQuery({
    queryKey: adminKeys.workspaceDetail(slug),
    enabled: !!slug,
    staleTime: 30 * 1000,
    queryFn: async () => {
      const res = await get<{ data: AdminWorkspaceDetail }>(
        `/api/admin/workspaces/${slug}`,
      );
      return res.data;
    },
  });
}

export function useAdminUsers(params: {
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: adminKeys.users(params),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
    queryFn: async () =>
      get<AdminPaginatedResponse<AdminUser>>(
        `/api/admin/users?${buildParams(params)}`,
      ),
  });
}

export function useAdminUserDetail(id: string) {
  return useQuery({
    queryKey: adminKeys.userDetail(id),
    enabled: !!id,
    staleTime: 30 * 1000,
    queryFn: async () => {
      const res = await get<{ data: AdminUserDetail }>(
        `/api/admin/users/${id}`,
      );
      return res.data;
    },
  });
}

export function useAdminProjects(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  workspaceId?: string;
}) {
  return useQuery({
    queryKey: adminKeys.projects(params),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
    queryFn: async () =>
      get<AdminPaginatedResponse<AdminProject>>(
        `/api/admin/projects?${buildParams(params)}`,
      ),
  });
}

export function useAdminBilling(params: {
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: adminKeys.billing(params),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
    queryFn: async () =>
      get<AdminPaginatedResponse<AdminBilling>>(
        `/api/admin/billing?${buildParams(params)}`,
      ),
  });
}

export function useAdminActivity(params: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: adminKeys.activity(params),
    staleTime: 15 * 1000,
    placeholderData: (prev) => prev,
    queryFn: async () =>
      get<AdminPaginatedResponse<AdminActivity>>(
        `/api/admin/activity?${buildParams(params)}`,
      ),
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useBanUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const res = await api.patch(`/api/admin/users/${id}/ban`, { reason });
      return res as unknown as { success: boolean; message: string };
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      qc.invalidateQueries({ queryKey: ['admin', 'user', id] });
    },
  });
}

export function useUnbanUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/api/admin/users/${id}/unban`, {});
      return res as unknown as { success: boolean; message: string };
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      qc.invalidateQueries({ queryKey: ['admin', 'user', id] });
    },
  });
}

export function useDeleteWorkspace() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      slug, reason, hardDelete,
    }: { slug: string; reason?: string; hardDelete: boolean }) => {
      const res = await api.post(
        `/api/admin/workspaces/${slug}/delete`,
        { reason, hardDelete },
      );
      return res as unknown as { success: boolean; message: string };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'workspaces'] });
    },
  });
}

export function useRestoreWorkspace() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (slug: string) => {
      const res = await api.patch(`/api/admin/workspaces/${slug}/restore`, {});
      return res as unknown as { success: boolean; message: string };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'workspaces'] });
    },
  });
}