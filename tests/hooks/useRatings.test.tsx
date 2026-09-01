import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { createWrapper } from '../utils/renderWithProviders';
import {
  useRatings,
  useMyRating,
  useCreateRating,
  useUpdateRating,
  useDeleteRating,
} from '@/hooks/useRatings';
import {
  mockRatingsResponse,
  mockRating,
} from '../mock/handlers/rating.handlers';

// ─── useRatings ──────────────────────────────────────────────────────────────

describe('useRatings', () => {
  it('fetches ratings with default pagination', async () => {
    const { result } = renderHook(
      () => useRatings(),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.ratings).toHaveLength(2);
    expect(result.current.data?.stats.averageStars).toBe(4.5);
    expect(result.current.data?.stats.totalRatings).toBe(2);
  });

  it('returns correct rating shape', async () => {
    const { result } = renderHook(
      () => useRatings(),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const rating = result.current.data?.ratings[0];
    expect(rating).toHaveProperty('id');
    expect(rating).toHaveProperty('stars');
    expect(rating).toHaveProperty('user');
    expect(rating?.user).toHaveProperty('name');
  });

  it('returns correct pagination', async () => {
    const { result } = renderHook(
      () => useRatings(),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pagination.totalCount).toBe(2);
    expect(result.current.data?.pagination.hasNext).toBe(false);
    expect(result.current.data?.pagination.hasPrev).toBe(false);
  });

  it('returns correct stats distribution', async () => {
    const { result } = renderHook(
      () => useRatings(),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const dist = result.current.data?.stats.distribution;
    expect(dist?.[5]).toBe(1);
    expect(dist?.[4]).toBe(1);
    expect(dist?.[3]).toBe(0);
  });
});

// ─── useMyRating ─────────────────────────────────────────────────────────────

describe('useMyRating', () => {
  it('fetches the current user rating', async () => {
    const { result } = renderHook(
      () => useMyRating(),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe('rating-1');
    expect(result.current.data?.stars).toBe(5);
  });
});

// ─── useCreateRating ─────────────────────────────────────────────────────────

describe('useCreateRating', () => {
  it('creates a new rating', async () => {
    const { result } = renderHook(
      () => useCreateRating(),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      result.current.mutate({
        stars: 4,
        comment: 'Nice tool!',
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.stars).toBe(4);
    expect(result.current.data?.comment).toBe('Nice tool!');
  });
});

// ─── useUpdateRating ─────────────────────────────────────────────────────────

describe('useUpdateRating', () => {
  it('updates an existing rating', async () => {
    const { result } = renderHook(
      () => useUpdateRating(),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      result.current.mutate({
        id: 'rating-1',
        stars: 3,
        comment: 'Updated comment',
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.stars).toBe(3);
    expect(result.current.data?.edited).toBe(true);
  });
});

// ─── useDeleteRating ─────────────────────────────────────────────────────────

describe('useDeleteRating', () => {
  it('deletes a rating', async () => {
    const { result } = renderHook(
      () => useDeleteRating(),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      result.current.mutate('rating-1');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe('rating-1');
  });
});
