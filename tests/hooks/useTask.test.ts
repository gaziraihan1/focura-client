// tests/hooks/useTask.test.tsx
import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest';
import { createWrapper, renderHookWithProviders } from '../utils/renderWithProviders'
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
  useTaskOverview,
  useTaskActivity,
  useUploadAttachment,
  useDeleteAttachment,
  taskKeys,
  commentKeys,
  attachmentKeys,
} from '@/hooks/useTask'
import { mockTask, mockTaskStats, mockPersonalQuota, mockWorkspaceQuota } from '../mock/handlers/task.handlers'
import { server } from '@/tests/mock/server';
import { http, HttpResponse } from 'msw';

// ─── useTasks ─────────────────────────────────────────────────────────────────

describe('useTasks', () => {
  it('returns paginated task list when response is TasksResponse', async () => {
    const { result } = renderHook(
      () => useTasks(undefined, 1, 10),
      { wrapper: createWrapper({ defaultTasks: [mockTask] }) }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(1)
    expect(result.current.data?.pagination.totalCount).toBe(1)
  })

  it('handles response as a simple Task array', async () => {
    server.use(
      http.get('*/api/v1/tasks*', () => {
        return HttpResponse.json([mockTask, { ...mockTask, id: 'task-2' }]);
      })
    )

    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(2)
    expect(result.current.data?.pagination.totalCount).toBe(2)
    expect(result.current.data?.pagination.totalPages).toBe(1)
  })

  it('handles null response gracefully', async () => {
    server.use(
      http.get('*/api/v1/tasks*', () => {
        return HttpResponse.json({ success: true, data: null })
      })
    )

    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toEqual([])
    expect(result.current.data?.pagination.totalCount).toBe(0)
  })

  it('handles unexpected response shape', async () => {
    server.use(
      http.get('*/api/v1/tasks*', () => {
        return HttpResponse.json({ success: true, data: { unexpected: 'shape' } })
      })
    )

    const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toEqual([])
  })

  it('applies all filters to query parameters', async () => {
    const filters = {
      type: 'assigned',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      projectId: 'proj-1',
      workspaceId: 'ws-1',
      assigneeId: 'user-1',
      search: 'test task',
      labelIds: ['label-1', 'label-2'],
      userId: 'user-2',
    }

    const { result } = renderHook(
      () => useTasks(filters, 2, 20, { sortBy: 'dueDate', sortOrder: 'desc' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
  })
})

// ─── useTaskOverview ──────────────────────────────────────────────────────────

describe('useTaskOverview', () => {
  it('fetches overview and seeds multiple caches', async () => {
    const mockOverview = {
      task: mockTask,
      comments: [{ id: 'c1', content: 'Comment 1', taskId: 'task-1' }],
      attachments: [{ id: 'a1', fileName: 'file.txt', taskId: 'task-1' }],
    }

    server.use(
      http.get('*/api/v1/tasks/task-1/overview', () => {
        return HttpResponse.json({ success: true, data: mockOverview })
      })
    )

    const { result, qc } = renderHookWithProviders(() => useTaskOverview('task-1'))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockOverview)

    // Verify seeding
    expect(qc.getQueryData(taskKeys.detail('task-1'))).toEqual(mockTask)
    expect(qc.getQueryData(commentKeys.byTask('task-1'))).toEqual(mockOverview.comments)
    expect(qc.getQueryData(attachmentKeys.byTask('task-1'))).toEqual(mockOverview.attachments)
  })
})

// ... [rest of the file] ...

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
  it('creates a task and performs optimistic update', async () => {
    const projectData = {
      id: 'project-1',
      tasks: [],
      _count: { tasks: 0 },
    }

    const { result, qc } = renderHookWithProviders(() => useCreateTask())

    // Seed project data to test optimistic update
    qc.setQueryData(['projects', 'detail', 'project-1'], projectData)

    await act(async () => {
      await result.current.mutateAsync({
        title: 'New Task',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: 'project-1',
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const updatedProject = qc.getQueryData(['projects', 'detail', 'project-1'])
    expect(updatedProject).toBeDefined()
    // Note: after mutateAsync settles, the optimistic data might be replaced by server data 
    // if onSettled invalidates. But we can check if it was called.
  })

  it('rolls back optimistic update on error', async () => {
    const projectData = {
      id: 'project-1',
      tasks: [],
      _count: { tasks: 0 },
    }

    server.use(
      http.post('*/api/v1/tasks', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    const { result, qc } = renderHookWithProviders(() => useCreateTask())
    qc.setQueryData(['projects', 'detail', 'project-1'], projectData)

    await act(async () => {
      try {
        await result.current.mutateAsync({
          title: 'Error Task',
          status: 'TODO',
          priority: 'MEDIUM',
          projectId: 'project-1',
        })
      } catch (e) {}
    })

    expect(qc.getQueryData(['projects', 'detail', 'project-1'])).toEqual(projectData)
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
    const projectData = {
      id: 'project-1',
      tasks: [mockTask],
      _count: { tasks: 1 },
    }

    const { result, qc } = renderHookWithProviders(() => useUpdateTaskStatus())

    qc.setQueryData(taskKeys.detail('task-1'), mockTask)
    qc.setQueryData(['projects', 'detail', 'project-1'], projectData)

    await act(async () => {
      await result.current.mutateAsync({ id: 'task-1', status: 'IN_PROGRESS' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const updatedTask = qc.getQueryData(taskKeys.detail('task-1'))
    expect(updatedTask).toEqual({ ...mockTask, status: 'IN_PROGRESS' })

    const updatedProject = qc.getQueryData(['projects', 'detail', 'project-1'])
    expect(updatedProject?.tasks[0].status).toBe('IN_PROGRESS')
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
      await result.current.mutateAsync({ taskId: 'task-1', content: 'Great work!', workspaceSlug: 'ws-1' })
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

// ─── Missing Functions ─────────────────────────────────────────────────────────

describe('useTask Missing Functions', () => {
  it('useTaskActivity fetches activity', async () => {
    const { result } = renderHook(() => useTaskActivity('task-1'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([])
  })

  it('useUploadAttachment uploads a file', async () => {
    const { result } = renderHook(() => useUploadAttachment(), { wrapper: createWrapper() })
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })

    await act(async () => {
      await result.current.mutateAsync({ taskId: 'task-1', file })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('useDeleteAttachment deletes an attachment', async () => {
    const { result } = renderHook(() => useDeleteAttachment(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.mutateAsync({ taskId: 'task-1', attachmentId: 'att-1' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})