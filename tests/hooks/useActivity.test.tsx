// tests/hooks/useActivity.test.tsx
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import {
  useActivities,
  useWorkspaceActivities,
  useTaskActivities,
  useActivityStats,
  useDeleteActivity,
  useClearActivities,
  useInfiniteActivities,
} from '@/hooks/useActivity'

const WS_ID = 'ws-1'
const TASK_ID = 'task-1'

// ─── useActivities ────────────────────────────────────────────────────────────

describe('useActivities', () => {
  it('fetches activities with no filters', async () => {
    const { result } = renderHook(
      () => useActivities(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
    expect(result.current.data?.[0].id).toBe('activity-1')
    expect(result.current.data?.[0].action).toBe('CREATED')
  })

  it('fetches activities with workspaceId filter', async () => {
    const { result } = renderHook(
      () => useActivities({ workspaceId: WS_ID }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
  })

  it('fetches activities with action filter', async () => {
    const { result } = renderHook(
      () => useActivities({ action: 'STATUS_CHANGED' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
  })

  it('fetches activities with entityType filter', async () => {
    const { result } = renderHook(
      () => useActivities({ entityType: 'TASK' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
  })

  it('fetches activities with limit and offset', async () => {
    const { result } = renderHook(
      () => useActivities({ limit: 10, offset: 0 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
  })

  it('returns correct activity shape', async () => {
    const { result } = renderHook(
      () => useActivities(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const activity = result.current.data?.[0]
    expect(activity).toHaveProperty('id')
    expect(activity).toHaveProperty('action')
    expect(activity).toHaveProperty('entityType')
    expect(activity).toHaveProperty('user')
    expect(activity).toHaveProperty('workspace')
    expect(activity?.user.email).toBe('test@focura.com')
  })
})

// ─── useWorkspaceActivities ───────────────────────────────────────────────────

describe('useWorkspaceActivities', () => {
  it('fetches activities for a workspace', async () => {
    const { result } = renderHook(
      () => useWorkspaceActivities(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
    expect(result.current.data?.[1].action).toBe('STATUS_CHANGED')
  })

  it('fetches workspace activities with filters', async () => {
    const { result } = renderHook(
      () => useWorkspaceActivities(WS_ID, { limit: 5, entityType: 'TASK' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
  })

  it('is disabled when workspaceId is empty', () => {
    const { result } = renderHook(
      () => useWorkspaceActivities(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useTaskActivities ────────────────────────────────────────────────────────

describe('useTaskActivities', () => {
  it('fetches activities for a task', async () => {
    const { result } = renderHook(
      () => useTaskActivities(TASK_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
    expect(result.current.data?.[0].taskId).toBe(TASK_ID)
  })

  it('fetches task activities with limit', async () => {
    const { result } = renderHook(
      () => useTaskActivities(TASK_ID, { limit: 5 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
  })

  it('is disabled when taskId is empty', () => {
    const { result } = renderHook(
      () => useTaskActivities(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useActivityStats ─────────────────────────────────────────────────────────

describe('useActivityStats', () => {
  it('fetches activity stats without workspaceId', async () => {
    const { result } = renderHook(
      () => useActivityStats(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.total).toBe(42)
    expect(result.current.data?.today).toBe(8)
    expect(result.current.data?.byAction.CREATED).toBe(10)
  })

  it('fetches activity stats with workspaceId', async () => {
    const { result } = renderHook(
      () => useActivityStats(WS_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.total).toBeDefined()
    expect(result.current.data?.byAction).toBeDefined()
  })
})

// ─── useInfiniteActivities ────────────────────────────────────────────────────

describe('useInfiniteActivities', () => {
  it('fetches first page of activities', async () => {
    const { result } = renderHook(
      () => useInfiniteActivities({ workspaceId: WS_ID, limit: 10 }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.pages).toHaveLength(1)
  })

  it('starts with page param 0', async () => {
    const { result } = renderHook(
      () => useInfiniteActivities(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.pageParams[0]).toBe(0)
  })
})

// ─── useDeleteActivity ────────────────────────────────────────────────────────

describe('useDeleteActivity', () => {
  it('deletes an activity', async () => {
    const { result } = renderHook(
      () => useDeleteActivity(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate('activity-1')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

// ─── useClearActivities ───────────────────────────────────────────────────────

describe('useClearActivities', () => {
  it('clears all activities', async () => {
    const { result } = renderHook(
      () => useClearActivities(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
  result.current.mutate(undefined)
})

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('clears activities for a specific workspace', async () => {
    const { result } = renderHook(
      () => useClearActivities(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({ workspaceId: WS_ID })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('clears activities before a specific date', async () => {
    const { result } = renderHook(
      () => useClearActivities(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({ before: '2024-06-01T00:00:00.000Z' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})