// tests/hooks/useFeatures.test.tsx
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import {
  useIsFocuraAdmin,
  useFeatureRequests,
  useFeatureRequest,
  useCreateFeatureRequest,
  useUpdateFeatureStatus,
  useDeleteFeatureRequest,
  useCastVote,
  useFeatureFilters,
} from '@/hooks/useFeatures'

// ─── useIsFocuraAdmin ─────────────────────────────────────────────────────────

describe('useIsFocuraAdmin', () => {
  it('returns false for regular user', async () => {
    const { result } = renderHook(
      () => useIsFocuraAdmin(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe(false)
  })
})

// ─── useFeatureRequests ───────────────────────────────────────────────────────

describe('useFeatureRequests', () => {
  it('fetches feature requests with default filters', async () => {
    const { result } = renderHook(
      () => useFeatureRequests(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(2)
    expect(result.current.data?.data[0].title).toBe('Dark Mode')
    expect(result.current.data?.pagination.totalCount).toBe(2)
  })

  it('returns correct feature shape', async () => {
    const { result } = renderHook(
      () => useFeatureRequests(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const feature = result.current.data?.data[0]
    expect(feature).toHaveProperty('id')
    expect(feature).toHaveProperty('status')
    expect(feature).toHaveProperty('_count')
    expect(feature).toHaveProperty('userVote')
    expect(feature?.userVote).toBeNull()
  })

  it('returns feature with existing upvote', async () => {
    const { result } = renderHook(
      () => useFeatureRequests(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const voted = result.current.data?.data.find(f => f.id === 'feature-2')
    expect(voted?.userVote).toBe('UP')
    expect(voted?._count.upvotes).toBe(12)
  })

  it('fetches with status filter', async () => {
    const { result } = renderHook(
      () => useFeatureRequests({ status: 'PENDING', page: 1, pageSize: 20 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toBeDefined()
  })

  it('fetches with search filter', async () => {
    const { result } = renderHook(
      () => useFeatureRequests({ search: 'dark mode' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toBeDefined()
  })
})

// ─── useFeatureRequest ────────────────────────────────────────────────────────

describe('useFeatureRequest', () => {
  it('fetches a single feature request by id', async () => {
    const { result } = renderHook(
      () => useFeatureRequest('feature-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id).toBe('feature-1')
    expect(result.current.data?.title).toBe('Dark Mode')
    expect(result.current.data?.status).toBe('PENDING')
    expect(result.current.data?._count.upvotes).toBe(5)
  })

  it('is disabled when id is empty', () => {
    const { result } = renderHook(
      () => useFeatureRequest(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useCreateFeatureRequest ──────────────────────────────────────────────────

describe('useCreateFeatureRequest', () => {
  it('creates a feature request', async () => {
    const { result } = renderHook(
      () => useCreateFeatureRequest(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({
        title: 'New Feature',
        description: 'A great new feature idea',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.title).toBe('New Feature')
    expect(result.current.data?.id).toBe('feature-new')
    expect(result.current.data?.status).toBe('PENDING')
    expect(result.current.data?._count.upvotes).toBe(0)
  })
})

// ─── useUpdateFeatureStatus ───────────────────────────────────────────────────

describe('useUpdateFeatureStatus', () => {
  it('approves a feature request', async () => {
    const { result } = renderHook(
      () => useUpdateFeatureStatus(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({
        id: 'feature-1',
        status: 'APPROVED',
        adminNote: 'Great idea!',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.status).toBe('APPROVED')
    expect(result.current.data?.adminNote).toBe('Great idea!')
  })

  it('rejects a feature request', async () => {
    const { result } = renderHook(
      () => useUpdateFeatureStatus(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({
        id: 'feature-1',
        status: 'REJECTED',
        adminNote: 'Not aligned with roadmap',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.status).toBe('REJECTED')
  })
})

// ─── useDeleteFeatureRequest ──────────────────────────────────────────────────

describe('useDeleteFeatureRequest', () => {
  it('deletes a feature request', async () => {
    const { result } = renderHook(
      () => useDeleteFeatureRequest(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate('feature-1')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

// ─── useCastVote ──────────────────────────────────────────────────────────────

describe('useCastVote', () => {
  it('casts an upvote on a feature', async () => {
    const { result } = renderHook(
      () => useCastVote(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({ id: 'feature-1', type: 'UP' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.action).toBe('added')
    expect(result.current.data?.feature.userVote).toBe('UP')
    expect(result.current.data?.feature._count.upvotes).toBe(6)
  })

  it('casts a downvote on a feature', async () => {
    const { result } = renderHook(
      () => useCastVote(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({ id: 'feature-1', type: 'DOWN' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.feature.userVote).toBe('DOWN')
    expect(result.current.data?.feature._count.downvotes).toBe(2)
  })
})

// ─── useFeatureFilters ────────────────────────────────────────────────────────

describe('useFeatureFilters', () => {
  it('initializes with default filters', () => {
    const { result } = renderHook(
      () => useFeatureFilters(),
      { wrapper: createWrapper() }
    )

    expect(result.current.filters.status).toBe('ALL')
    expect(result.current.filters.page).toBe(1)
    expect(result.current.filters.pageSize).toBe(20)
  })

  it('updates status filter and resets page', () => {
    const { result } = renderHook(
      () => useFeatureFilters(),
      { wrapper: createWrapper() }
    )

    act(() => result.current.setStatus('APPROVED'))

    expect(result.current.filters.status).toBe('APPROVED')
    expect(result.current.filters.page).toBe(1)
  })

  it('updates search filter and resets page', () => {
    const { result } = renderHook(
      () => useFeatureFilters(),
      { wrapper: createWrapper() }
    )

    act(() => result.current.setPage(3))
    act(() => result.current.setSearch('dark mode'))

    expect(result.current.filters.search).toBe('dark mode')
    expect(result.current.filters.page).toBe(1) // reset on search
  })

  it('updates page', () => {
    const { result } = renderHook(
      () => useFeatureFilters(),
      { wrapper: createWrapper() }
    )

    act(() => result.current.setPage(5))

    expect(result.current.filters.page).toBe(5)
  })

  it('resets filters to defaults', () => {
    const { result } = renderHook(
      () => useFeatureFilters(),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.setStatus('COMPLETED')
      result.current.setPage(3)
    })
    act(() => result.current.reset())

    expect(result.current.filters.status).toBe('ALL')
    expect(result.current.filters.page).toBe(1)
    expect(result.current.filters.search).toBeUndefined()
  })
})