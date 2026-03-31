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

// ─── Query keys ───────────────────────────────────────────────────────────────

export const announcementKeys = {
  all:    (workspaceId: string) =>
            ['announcements', workspaceId] as const,
  list:   (workspaceId: string, filters: AnnouncementFilters) =>
            ['announcements', workspaceId, 'list', filters] as const,
  detail: (id: string) =>
            ['announcements', 'detail', id] as const,
};

// ─── Filters hook ─────────────────────────────────────────────────────────────

const DEFAULT_FILTERS: AnnouncementFilters = {
  visibility: 'ALL',
  page:       1,
  pageSize:   10,
};

export function useAnnouncementFilters() {
  const [filters, setFilters] = useState<AnnouncementFilters>(DEFAULT_FILTERS);

  const setVisibility = useCallback((visibility: AnnouncementVisibility | 'ALL') => {
    setFilters((prev) => ({ ...prev, visibility, page: 1 }));
  }, []);

  const setIsPinned = useCallback((isPinned?: boolean) => {
    setFilters((prev) => ({ ...prev, isPinned, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const activeFiltersCount = [
    filters.visibility !== 'ALL',
    filters.isPinned !== undefined,
  ].filter(Boolean).length;

  return {
    filters,
    setVisibility,
    setIsPinned,
    setPage,
    resetFilters,
    activeFiltersCount,
  };
}

// ─── Query hooks ──────────────────────────────────────────────────────────────

export function useAnnouncements(
  workspaceId: string,
  filters: AnnouncementFilters = {},
) {
  return useQuery({
    queryKey: announcementKeys.list(workspaceId, filters),
    enabled:  !!workspaceId,
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.visibility && filters.visibility !== 'ALL')
        params.append('visibility', filters.visibility);
      if (filters.isPinned !== undefined)
        params.append('isPinned', String(filters.isPinned));
      if (filters.page)     params.append('page',     String(filters.page));
      if (filters.pageSize) params.append('pageSize', String(filters.pageSize));

      // api.get returns res?.data which is the full backend body:
      // { success: true, data: Announcement[], pagination: {...} }
      const res = await api.get<never>(
        `/api/workspaces/${workspaceId}/announcements?${params.toString()}`,
      ) as unknown as { success: boolean; data: Announcement[]; pagination: AnnouncementPagination };

      return {
        data:       res?.data       ?? [],
        pagination: res?.pagination ?? {
          page: 1, pageSize: 10, totalCount: 0,
          totalPages: 0, hasNext: false, hasPrev: false,
        },
      } as AnnouncementsResponse;
    },
  });
}

export function useAnnouncement(id: string) {
  return useQuery({
    queryKey: announcementKeys.detail(id),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get<Announcement>(`/api/announcements/${id}`);
      return res?.data as Announcement;
    },
  });
}

// ─── Mutation hooks ───────────────────────────────────────────────────────────

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
    onSuccess: (newAnnouncement) => {
      qc.setQueriesData<AnnouncementsResponse>(
        { queryKey: ['announcements', workspaceId] },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data:       [newAnnouncement, ...old.data],
            pagination: {
              ...old.pagination,
              totalCount: old.pagination.totalCount + 1,
            },
          };
        },
      );
      qc.invalidateQueries({ queryKey: announcementKeys.all(workspaceId) });
    },
  });
}

export function useDeleteAnnouncement(workspaceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/announcements/${id}`);
      return res?.data;
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: announcementKeys.all(workspaceId) });
      const snapshots = qc.getQueriesData<AnnouncementsResponse>({
        queryKey: ['announcements', workspaceId],
      });
      qc.setQueriesData<AnnouncementsResponse>(
        { queryKey: ['announcements', workspaceId] },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((a) => a.id !== id),
            pagination: {
              ...old.pagination,
              totalCount: Math.max(0, old.pagination.totalCount - 1),
            },
          };
        },
      );
      return { snapshots };
    },
    onError: (_err, _id, context) => {
      context?.snapshots?.forEach(([key, value]) => {
        qc.setQueryData(key, value);
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: announcementKeys.all(workspaceId) });
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
      qc.setQueriesData<AnnouncementsResponse>(
        { queryKey: ['announcements', workspaceId] },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((a) =>
              a.id === updated.id ? { ...a, isPinned: updated.isPinned } : a,
            ),
          };
        },
      );
      qc.setQueryData(announcementKeys.detail(updated.id), updated);
    },
  });
}
