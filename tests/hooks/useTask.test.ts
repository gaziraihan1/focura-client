// tests/hooks/useTask.test.tsx
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import {
  useTasks,
  useTask,
  useTaskStats,
  usePersonalQuota,
  useWorkspaceQuota,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useUpdateTaskStatus,
  useTaskComments,
  useAddComment,
  useTaskAttachments,
} from '@/hooks/useTask'
import { mockTask } from '../mock/handlers/task.handlers'

// ─── useTasks ─────────────────────────────────────────────────────────────────

describe('useTasks', () => {
  it('returns paginated task list', async () => {
  const { result } = renderHook(
    () => useTasks(undefined, 1, 10),   // explicit defaults to match seeded key
    { wrapper: createWrapper({ defaultTasks: [mockTask] }) }
  )

  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  expect(result.current.data?.data).toHaveLength(1)
  expect(result.current.data?.data[0].title).toBe('Test Task')
  expect(result.current.data?.pagination.totalCount).toBe(1)
})

  it('returns correct pagination shape', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const pagination = result.current.data?.pagination
    expect(pagination).toHaveProperty('page')
    expect(pagination).toHaveProperty('hasNext')
    expect(pagination).toHaveProperty('hasPrev')
    expect(pagination?.hasNext).toBe(false)
  })

  
  it('passes filters as query params', async () => {
    const { result } = renderHook(
      () => useTasks({ status: 'TODO', priority: 'HIGH' }, 1, 10),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toBeDefined()
  })
})

// ─── useTask ──────────────────────────────────────────────────────────────────

describe('useTask', () => {
  it('fetches single task by id', async () => {
    const { result } = renderHook(() => useTask('task-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id).toBe('task-1')
    expect(result.current.data?.title).toBe('Test Task')
    expect(result.current.data?.status).toBe('TODO')
  })

  it('is disabled when taskId is empty', () => {
    const { result } = renderHook(() => useTask(''), { wrapper: createWrapper() })

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useTaskStats ─────────────────────────────────────────────────────────────

describe('useTaskStats', () => {
  it('fetches task stats', async () => {
    const { result } = renderHook(() => useTaskStats('ws-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.totalTasks).toBe(5)
    expect(result.current.data?.overdue).toBe(1)
    expect(result.current.data?.byStatus.TODO).toBe(3)
  })

  it('fetches stats without workspaceId', async () => {
    const { result } = renderHook(() => useTaskStats(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
  })
})

// ─── usePersonalQuota ─────────────────────────────────────────────────────────

describe('usePersonalQuota', () => {
  it('fetches personal quota info', async () => {
    const { result } = renderHook(() => usePersonalQuota(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.plan).toBe('FREE')
    expect(result.current.data?.dailyLimit).toBe(10)
    expect(result.current.data?.remaining).toBe(7)
  })
})

// ─── useWorkspaceQuota ────────────────────────────────────────────────────────

describe('useWorkspaceQuota', () => {
  it('fetches workspace quota info', async () => {
    const { result } = renderHook(() => useWorkspaceQuota('ws-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.plan).toBe('FREE')
    expect(result.current.data?.workspaceRemaining).toBe(45)
    expect(result.current.data?.isUnlimited).toBe(false)
  })

  it('is disabled when workspaceId is undefined', () => {
    const { result } = renderHook(() => useWorkspaceQuota(undefined), { wrapper: createWrapper() })

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useCreateTask ────────────────────────────────────────────────────────────

describe('useCreateTask', () => {
  it('creates a task and invalidates lists', async () => {
    const { result } = renderHook(() => useCreateTask(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.mutateAsync({
        title: 'New Task',
        status: 'TODO',
        priority: 'MEDIUM',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.title).toBe('New Task')
  })
})

// ─── useUpdateTask ────────────────────────────────────────────────────────────

describe('useUpdateTask', () => {
  it('updates a task', async () => {
    const { result } = renderHook(() => useUpdateTask(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.mutateAsync({
        id: 'task-1',
        data: { title: 'Updated Title' },
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.title).toBe('Updated Title')
  })
})

// ─── useDeleteTask ────────────────────────────────────────────────────────────

describe('useDeleteTask', () => {
  it('deletes a task', async () => {
    const { result } = renderHook(() => useDeleteTask(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.mutateAsync('task-1')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

// ─── useUpdateTaskStatus ──────────────────────────────────────────────────────

describe('useUpdateTaskStatus', () => {
  it('updates task status optimistically', async () => {
    const wrapper = createWrapper({
      defaultTask: mockTask,
    })

    const { result } = renderHook(() => useUpdateTaskStatus(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ id: 'task-1', status: 'IN_PROGRESS' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.status).toBe('IN_PROGRESS')
  })
})

// ─── useTaskComments ──────────────────────────────────────────────────────────

describe('useTaskComments', () => {
  it('fetches comments for a task', async () => {
    const { result } = renderHook(() => useTaskComments('task-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([])
  })

  it('is disabled when taskId is empty', () => {
    const { result } = renderHook(() => useTaskComments(''), { wrapper: createWrapper() })

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useAddComment ────────────────────────────────────────────────────────────

describe('useAddComment', () => {
  it('adds a comment to a task', async () => {
    const { result } = renderHook(() => useAddComment(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.mutateAsync({ taskId: 'task-1', content: 'Great work!' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.content).toBe('Great work!')
  })
})

// ─── useTaskAttachments ───────────────────────────────────────────────────────

describe('useTaskAttachments', () => {
  it('fetches attachments for a task', async () => {
    const { result } = renderHook(() => useTaskAttachments('task-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([])
  })

  it('is disabled when taskId is empty', () => {
    const { result } = renderHook(() => useTaskAttachments(''), { wrapper: createWrapper() })

    expect(result.current.fetchStatus).toBe('idle')
  })
})