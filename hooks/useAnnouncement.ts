'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type {
  Announcement,
  AnnouncementsResponse,
  CreateAnnouncementDto,
  AnnouncementFilters,
  AnnouncementVisibility,
  AnnouncementPagination,
} from '@/types/announcement.types';


export const announcementKeys = {
  all:         (workspaceId: string) =>
                 ['announcements', workspaceId] as const,
  list:        (workspaceId: string, filters: AnnouncementFilters) =>
                 ['announcements', workspaceId, 'list', filters] as const,
  projectAll:  (workspaceId: string, projectId: string) =>
                 ['announcements', workspaceId, 'project', projectId] as const,
  projectList: (workspaceId: string, projectId: string, filters: AnnouncementFilters) =>
                 ['announcements', workspaceId, 'project', projectId, 'list', filters] as const,
  detail:      (id: string) =>
                 ['announcements', 'detail', id] as const,
};


const EMPTY_PAGINATION: AnnouncementPagination = {
  page: 1, pageSize: 10, totalCount: 0,
  totalPages: 0, hasNext: false, hasPrev: false,
};


const DEFAULT_FILTERS: AnnouncementFilters = {
  visibility: 'ALL',
  page:       1,
  pageSize:   10,
};

export function useAnnouncementFilters() {
  const [filters, setFilters] = useState<AnnouncementFilters>(DEFAULT_FILTERS);

  const setVisibility = useCallback((visibility: AnnouncementVisibility | 'ALL') => {
    setFilters((f) => ({ ...f, visibility, page: 1 }));
  }, []);

  const setIsPinned = useCallback((isPinned?: boolean) => {
    setFilters((f) => ({ ...f, isPinned, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((f) => ({ ...f, page }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const activeFiltersCount = [
    filters.visibility !== 'ALL',
    filters.isPinned !== undefined,
  ].filter(Boolean).length;

  return { filters, setVisibility, setIsPinned, setPage, resetFilters, activeFiltersCount };
}


function buildParams(filters: AnnouncementFilters): string {
  const p = new URLSearchParams();
  if (filters.visibility && filters.visibility !== 'ALL')
    p.append('visibility', filters.visibility);
  if (filters.isPinned !== undefined)
    p.append('isPinned', String(filters.isPinned));
  if (filters.page)     p.append('page',     String(filters.page));
  if (filters.pageSize) p.append('pageSize', String(filters.pageSize));
  return p.toString();
}

async function fetchAnnouncements(url: string): Promise<AnnouncementsResponse> {
  const res = await api.get<never>(url) as unknown as {
    success: boolean;
    data: Announcement[];
    pagination: AnnouncementPagination;
  };
  return {
    data:       res?.data       ?? [],
    pagination: res?.pagination ?? EMPTY_PAGINATION,
  };
}


export function useAnnouncements(
  workspaceId: string,
  filters: AnnouncementFilters = {},
) {
  return useQuery({
    queryKey:        announcementKeys.list(workspaceId, filters),
    enabled:         !!workspaceId,
    staleTime:       2 * 60 * 1000,
    placeholderData: (prev) => prev,
    queryFn: () =>
      fetchAnnouncements(
        `/api/workspaces/${workspaceId}/announcements?${buildParams(filters)}`,
      ),
  });
}


export function useProjectAnnouncements(
  workspaceId: string,
  projectId:   string,
  filters:     AnnouncementFilters = {},
) {
  return useQuery({
    queryKey:        announcementKeys.projectList(workspaceId, projectId, filters),
    enabled:         !!workspaceId && !!projectId,
    staleTime:       2 * 60 * 1000,
    placeholderData: (prev) => prev,
    queryFn: () =>
      fetchAnnouncements(
        `/api/workspaces/${workspaceId}/projects/${projectId}/announcements?${buildParams(filters)}`,
      ),
  });
}


export function useAnnouncement(id: string) {
  return useQuery({
    queryKey:  announcementKeys.detail(id),
    enabled:   !!id,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get<Announcement>(`/api/announcements/${id}`);
      return res?.data as Announcement;
    },
  });
}


export function useCreateAnnouncement(workspaceId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAnnouncementDto) => {
      const res = await api.post<Announcement>(
        `/api/workspaces/${workspaceId}/announcements`,
        data,
      );
      return res?.data as Announcement;
    },
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: announcementKeys.all(workspaceId) });

      // Also invalidate project list if scoped
      if (created.projectId) {
        qc.invalidateQueries({
          queryKey: announcementKeys.projectAll(workspaceId, created.projectId),
        });
      }
    },
  });
}

export function useTogglePinAnnouncement(workspaceId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch<Announcement>(`/api/announcements/${id}/pin`, {});
      return res?.data as Announcement;
    },
    onSuccess: (updated) => {
      // Re-sort each cached list so pinned items float to top —
      // matches the backend orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }]
      const syncAndSort = (old?: AnnouncementsResponse) => {
        if (!old) return old;
        const data = old.data
          .map((a) => (a.id === updated.id ? { ...a, isPinned: updated.isPinned } : a))
          .sort((a, b) => {
            if (a.isPinned === b.isPinned) return 0;
            return a.isPinned ? -1 : 1;
          });
        return { ...old, data };
      };

      qc.setQueriesData<AnnouncementsResponse>(
        { queryKey: ['announcements', workspaceId, 'list'] },
        syncAndSort,
      );
      qc.setQueriesData<AnnouncementsResponse>(
        { queryKey: ['announcements', workspaceId, 'project'] },
        syncAndSort,
      );

      qc.setQueryData(announcementKeys.detail(updated.id), updated);

      // Refetch to get server-authoritative sort across all pages
      qc.invalidateQueries({ queryKey: announcementKeys.all(workspaceId) });
    },
  });
}


export function useDeleteAnnouncement(workspaceId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/announcements/${id}`);
      return id;
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: announcementKeys.all(workspaceId) });

      const snapshots = qc.getQueriesData<AnnouncementsResponse>({
        queryKey: ['announcements', workspaceId],
      });

      const removeFromList = (old?: AnnouncementsResponse) => {
        if (!old) return old;
        return {
          ...old,
          data:       old.data.filter((a) => a.id !== id),
          pagination: {
            ...old.pagination,
            totalCount: Math.max(0, old.pagination.totalCount - 1),
          },
        };
      };

      qc.setQueriesData<AnnouncementsResponse>(
        { queryKey: ['announcements', workspaceId, 'list'] },
        removeFromList,
      );

      qc.setQueriesData<AnnouncementsResponse>(
        { queryKey: ['announcements', workspaceId, 'project'] },
        removeFromList,
      );

      return { snapshots };
    },
    onError: (_err, _id, ctx) => {
      ctx?.snapshots.forEach(([key, value]) => qc.setQueryData(key, value));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: announcementKeys.all(workspaceId) });
    },
  });
}


