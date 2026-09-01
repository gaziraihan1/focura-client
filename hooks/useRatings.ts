'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type {
  Rating,
  RatingsResponse,
  RatingPagination,
  RatingStats,
  CreateRatingDto,
  UpdateRatingDto,
} from '@/types/rating.types';

export const ratingKeys = {
  all: ['ratings'] as const,
  list: (page: number, pageSize: number) => ['ratings', 'list', page, pageSize] as const,
  mine: ['ratings', 'mine'] as const,
  detail: (id: string) => ['ratings', 'detail', id] as const,
};

/**
 * Fetch all ratings with pagination and stats. Public — no auth needed.
 */
export function useRatings(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ratingKeys.list(page, pageSize),
    staleTime: 60 * 1000,
    queryFn: async () => {
      const res = await api.get<never>(
        `/api/v1/ratings?page=${page}&pageSize=${pageSize}`,
      ) as unknown as {
        data: Rating[];
        pagination: RatingPagination;
        stats: RatingStats;
      };
      return {
        ratings: res.data ?? [],
        pagination: res.pagination,
        stats: res.stats,
      } as RatingsResponse;
    },
  });
}

/**
 * Fetch the current user's own rating. Requires auth.
 */
export function useMyRating() {
  return useQuery({
    queryKey: ratingKeys.mine,
    staleTime: 60 * 1000,
    retry: false,
    queryFn: async () => {
      const res = await api.get<Rating>('/api/v1/ratings/mine', {
        showErrorToast: false,
      });
      return (res as unknown as { data: Rating | null })?.data ?? null;
    },
  });
}

/**
 * Create a new rating. Requires auth.
 */
export function useCreateRating() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateRatingDto) => {
      const res = await api.post<Rating>('/api/v1/ratings', data);
      return (res as unknown as { data: Rating }).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ratingKeys.all });
    },
  });
}

/**
 * Update own rating. Requires auth.
 */
export function useUpdateRating() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateRatingDto & { id: string }) => {
      const res = await api.put<Rating>(`/api/v1/ratings/${id}`, data);
      return (res as unknown as { data: Rating }).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ratingKeys.all });
    },
  });
}

/**
 * Delete own rating. Requires auth.
 */
export function useDeleteRating() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/ratings/${id}`);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ratingKeys.all });
    },
  });
}
