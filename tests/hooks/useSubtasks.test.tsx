// tests/hooks/useSubtasks.test.tsx
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import {
  useSubtasks,
  useSubtaskStats,
  useCreateSubtask,
  useUpdateSubtask,
  useUpdateSubtaskStatus,
  useDeleteSubtask,
} from '@/hooks/useSubtasks'
import { mockSubtask } from '../mock/handlers/subtask.handlers'

const PARENT_ID = 'task-1'
const SUBTASK_ID = 'subtask-1'

// ─── useSubtasks ──────────────────────────────────────────────────────────────

describe('useSubtasks', () => {
  it('fetches subtasks for a parent task', async () => {
    const { result } = renderHook(
      () => useSubtasks(PARENT_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].id).toBe(SUBTASK_ID)
    expect(result.current.data?.[0].title).toBe('Test Subtask')
    expect(result.current.data?.[0].status).toBe('TODO')
    expect(result.current.data?.[0].parentId).toBe(PARENT_ID)
  })

  it('returns empty array for task with no subtasks', async () => {
    const { result } = renderHook(
      () => useSubtasks('empty-task'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([])
  })

  it('is disabled when parentTaskId is empty', () => {
    const { result } = renderHook(
      () => useSubtasks(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useSubtaskStats ──────────────────────────────────────────────────────────

describe('useSubtaskStats', () => {
  it('fetches subtask stats for a parent task', async () => {
    const { result } = renderHook(
      () => useSubtaskStats(PARENT_ID),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.total).toBe(3)
    expect(result.current.data?.completed).toBe(1)
    expect(result.current.data?.inProgress).toBe(1)
    expect(result.current.data?.todo).toBe(1)
    expect(result.current.data?.completionRate).toBe(33)
  })

  it('is disabled when parentTaskId is empty', () => {
    const { result } = renderHook(
      () => useSubtaskStats(''),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

// ─── useCreateSubtask ─────────────────────────────────────────────────────────

describe('useCreateSubtask', () => {
  it('creates a subtask', async () => {
    const { result } = renderHook(
      () => useCreateSubtask(PARENT_ID),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({
        title: 'New Subtask',
        status: 'TODO',
        priority: 'HIGH',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.title).toBe('New Subtask')
    expect(result.current.data?.id).toBe('subtask-new')
    expect(result.current.data?.parentId).toBe(PARENT_ID)
  })

  it('creates a subtask with assignees', async () => {
    const { result } = renderHook(
      () => useCreateSubtask(PARENT_ID),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({
        title: 'Assigned Subtask',
        assigneeIds: ['user-2'],
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.title).toBe('Assigned Subtask')
  })
})

// ─── useUpdateSubtask ─────────────────────────────────────────────────────────

describe('useUpdateSubtask', () => {
  it('updates a subtask title and priority', async () => {
    const { result } = renderHook(
      () => useUpdateSubtask(PARENT_ID),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({
        subtaskId: SUBTASK_ID,
        data: { title: 'Updated Subtask', priority: 'URGENT' },
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.title).toBe('Updated Subtask')
    expect(result.current.data?.priority).toBe('URGENT')
  })

  it('updates subtask due date', async () => {
    const { result } = renderHook(
      () => useUpdateSubtask(PARENT_ID),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({
        subtaskId: SUBTASK_ID,
        data: { dueDate: '2024-12-31T00:00:00.000Z' },
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.dueDate).toBe('2024-12-31T00:00:00.000Z')
  })
})

// ─── useUpdateSubtaskStatus ───────────────────────────────────────────────────

describe('useUpdateSubtaskStatus', () => {
  it('updates subtask status optimistically', async () => {
    const wrapper = createWrapper({
      defaultSubtasks: { parentId: PARENT_ID, subtasks: [mockSubtask] },
    })

    const { result } = renderHook(
      () => useUpdateSubtaskStatus(PARENT_ID),
      { wrapper }
    )

    await act(async () => {
      result.current.mutate({ subtaskId: SUBTASK_ID, status: 'IN_PROGRESS' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.status).toBe('IN_PROGRESS')
  })

  it('updates status to COMPLETED', async () => {
    const { result } = renderHook(
      () => useUpdateSubtaskStatus(PARENT_ID),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate({ subtaskId: SUBTASK_ID, status: 'COMPLETED' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.status).toBe('COMPLETED')
  })
})

// ─── useDeleteSubtask ─────────────────────────────────────────────────────────

describe('useDeleteSubtask', () => {
  it('deletes a subtask optimistically', async () => {
    const wrapper = createWrapper({
      defaultSubtasks: { parentId: PARENT_ID, subtasks: [mockSubtask] },
    })

    const { result } = renderHook(
      () => useDeleteSubtask(PARENT_ID),
      { wrapper }
    )

    await act(async () => {
      result.current.mutate(SUBTASK_ID)
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('deletes a subtask without pre-seeded cache', async () => {
    const { result } = renderHook(
      () => useDeleteSubtask(PARENT_ID),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      result.current.mutate(SUBTASK_ID)
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})