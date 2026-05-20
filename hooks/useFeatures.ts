'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type {
  FeatureRequest,
  FeaturesResponse,
  FeaturePagination,
  CreateFeatureRequestDto,
  UpdateFeatureStatusDto,
  FeatureFilters,
  FeatureStatus,
  VoteType,
} from '@/types/feature.types';


export const featureKeys = {
  all:    ['features'] as const,
  lists:  (filters: FeatureFilters) => ['features', 'list', filters] as const,
  detail: (id: string)              => ['features', 'detail', id]    as const,
  admin:  ['features', 'admin-me']  as const,
};


export function useIsFocuraAdmin() {
  return useQuery({
    queryKey:  featureKeys.admin,
    staleTime: Infinity,
    queryFn: async () => {
      const res = await api.get<{ isAdmin: boolean }>('/api/v1/features/admin/me');
      return (res as unknown as { isAdmin: boolean })?.isAdmin ?? false;
    },
  });
}

const DEFAULT_FILTERS: FeatureFilters = { status: 'ALL', page: 1, pageSize: 20 };

export function useFeatureFilters() {
  const [filters, setFilters] = useState<FeatureFilters>(DEFAULT_FILTERS);

  const setStatus = useCallback((status: FeatureStatus | 'ALL') => {
    setFilters((f) => ({ ...f, status, page: 1 }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilters((f) => ({ ...f, search: search || undefined, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((f) => ({ ...f, page }));
  }, []);

  const reset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return { filters, setStatus, setSearch, setPage, reset };
}


export function useFeatureRequests(filters: FeatureFilters = {}) {
  return useQuery({
    queryKey:        featureKeys.lists(filters),
    staleTime:       60 * 1000,
    placeholderData: (prev) => prev,
    queryFn: async () => {
      const p = new URLSearchParams();
      if (filters.status && filters.status !== 'ALL') p.append('status', filters.status);
      if (filters.search)   p.append('search',   filters.search);
      if (filters.page)     p.append('page',     String(filters.page));
      if (filters.pageSize) p.append('pageSize', String(filters.pageSize));

      const res = await api.get<never>(
        `/api/v1/features?${p.toString()}`,
      ) as unknown as { data: FeatureRequest[]; pagination: FeaturePagination };

      return {
        data:       res?.data       ?? [],
        pagination: res?.pagination ?? {
          page: 1, pageSize: 20, totalCount: 0,
          totalPages: 0, hasNext: false, hasPrev: false,
        },
      } as FeaturesResponse;
    },
  });
}

export function useFeatureRequest(id: string) {
  return useQuery({
    queryKey: featureKeys.detail(id),
    enabled:  !!id,
    queryFn: async () => {
      const res = await api.get<FeatureRequest>(`/api/v1/features/${id}`);
      return res?.data as FeatureRequest;
    },
  });
}


export function useCreateFeatureRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateFeatureRequestDto) => {
      const res = await api.post<FeatureRequest>('/api/v1/features', data);
      return res?.data as FeatureRequest;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: featureKeys.all });
    },
  });
}

export function useUpdateFeatureStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateFeatureStatusDto & { id: string }) => {
      const res = await api.patch<FeatureRequest>(`/api/v1/features/${id}/status`, data);
      return res?.data as FeatureRequest;
    },
    onSuccess: (updated) => {
      qc.setQueriesData<FeaturesResponse>(
        { queryKey: ['features', 'list'] },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((f) => f.id === updated.id ? { ...f, ...updated } : f),
          };
        },
      );
      qc.setQueryData(featureKeys.detail(updated.id), updated);
    },
  });
}

export function useDeleteFeatureRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/features/${id}`);
      return id;
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: featureKeys.all });
      const snapshots = qc.getQueriesData<FeaturesResponse>({ queryKey: ['features', 'list'] });
      qc.setQueriesData<FeaturesResponse>(
        { queryKey: ['features', 'list'] },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data:       old.data.filter((f) => f.id !== id),
            pagination: { ...old.pagination, totalCount: Math.max(0, old.pagination.totalCount - 1) },
          };
        },
      );
      return { snapshots };
    },
    onError: (_e, _id, ctx) => {
      ctx?.snapshots.forEach(([key, val]) => qc.setQueryData(key, val));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: featureKeys.all }),
  });
}

 export function useCastVote() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, type }: { id: string; type: VoteType }) => {
      const res = await api.post<{ action: string; feature: FeatureRequest }>(
        `/api/v1/features/${id}/vote`,
        { type },
      );
      return res as unknown as { action: string; feature: FeatureRequest };
    },

    onMutate: async ({ id, type }) => {
      await qc.cancelQueries({ queryKey: ['features'] });

      const snapshots = qc.getQueriesData<FeaturesResponse>({ queryKey: ['features', 'list'] });
      const detailSnapshot = qc.getQueryData<FeatureRequest>(featureKeys.detail(id));

      const updateFeature = (feature: FeatureRequest): FeatureRequest => {
        const prev = feature.userVote;

        if (prev === type) {
          return {
            ...feature,
            userVote: null,
            _count: {
              upvotes:   type === 'UP'   ? Math.max(0, feature._count.upvotes   - 1) : feature._count.upvotes,
              downvotes: type === 'DOWN' ? Math.max(0, feature._count.downvotes - 1) : feature._count.downvotes,
            },
          };
        }

        return {
          ...feature,
          userVote: type,
          _count: {
            upvotes:
              type === 'UP'
                ? feature._count.upvotes + 1
                : prev === 'UP'
                ? Math.max(0, feature._count.upvotes - 1)
                : feature._count.upvotes,
            downvotes:
              type === 'DOWN'
                ? feature._count.downvotes + 1
                : prev === 'DOWN'
                ? Math.max(0, feature._count.downvotes - 1)
                : feature._count.downvotes,
          },
        };
      };

      qc.setQueriesData<FeaturesResponse>(
        { queryKey: ['features', 'list'] },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((f) => f.id === id ? updateFeature(f) : f),
          };
        },
      );

      if (detailSnapshot) {
        qc.setQueryData(featureKeys.detail(id), updateFeature(detailSnapshot));
      }

      return { snapshots, detailSnapshot };
    },

    onError: (_err, { id }, ctx) => {
      ctx?.snapshots.forEach(([key, val]) => qc.setQueryData(key, val));
      if (ctx?.detailSnapshot) {
        qc.setQueryData(featureKeys.detail(id), ctx.detailSnapshot);
      }
    },

    onSuccess: ({ feature }, { id }) => {
      qc.setQueriesData<FeaturesResponse>(
        { queryKey: ['features', 'list'] },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((f) => f.id === id ? { ...f, ...feature } : f),
          };
        },
      );
      qc.setQueryData(featureKeys.detail(id), feature);
    },
  });
}