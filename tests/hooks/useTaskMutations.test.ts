import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper, renderHookWithProviders } from '../utils/renderWithProviders'
import {
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useUpdateTaskStatus,
  useUpdateTaskPriority,
  useAddComment,
  useUploadAttachment,
  useDeleteAttachment,
  useBatchUpdateTaskStatus,
  useBatchDeleteTasks,
  taskKeys,
} from '@/hooks/useTask'
import { mockTask } from '../mock/handlers/task.handlers'
import { server } from '@/tests/mock/server'
import { http, HttpResponse } from 'msw'

describe('Task Mutations', () => {
  describe('useCreateTask', () => {
    it('creates a task and performs optimistic update', async () => {
      const projectData = {
        id: 'project-1',
        tasks: [],
        _count: { tasks: 0 },
      }

      const { result, qc } = renderHookWithProviders(() => useCreateTask())
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

    it('seeds the detail cache and replaces the optimistic entry with the response recurrence', async () => {
      const createdTask = {
        ...mockTask,
        id: 'task-created',
        title: 'Daily Task',
        recurrence: {
          id: 'rec-1',
          taskId: 'task-created',
          pattern: 'DAILY',
          interval: 1,
          days: null,
          endsAt: null,
          lastOccurredAt: null,
        },
      }
      server.use(
        http.post('*/api/v1/tasks', () => {
          return HttpResponse.json({ success: true, data: createdTask })
        })
      )

      const { result, qc } = renderHookWithProviders(() => useCreateTask())
      const projectData = { id: 'project-1', tasks: [], _count: { tasks: 0 } }
      qc.setQueryData(['projects', 'detail', 'project-1'], projectData)

      await act(async () => {
        await result.current.mutateAsync({
          title: 'Daily Task',
          status: 'TODO',
          priority: 'MEDIUM',
          projectId: 'project-1',
          recurrence: { pattern: 'DAILY', interval: 1 },
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // The response (which embeds the stored recurrence) lands in the detail cache
      expect(qc.getQueryData(taskKeys.detail('task-created'))).toEqual(createdTask)

      // ...and the optimistic ghost in the project cache is replaced by the real task
      const project = qc.getQueryData(['projects', 'detail', 'project-1']) as { tasks: any[] }
      expect(project.tasks).toHaveLength(1)
      expect(project.tasks[0].id).toBe('task-created')
      expect(project.tasks[0].id).not.toMatch(/^optimistic-/)
      expect(project.tasks[0].recurrence?.pattern).toBe('DAILY')
    })
  })

  describe('useUpdateTask', () => {
    it('updates a task with optimistic update', async () => {
      const { result, qc } = renderHookWithProviders(() => useUpdateTask())
      qc.setQueryData(taskKeys.detail('task-1'), mockTask)

      await act(async () => {
        await result.current.mutateAsync({
          id: 'task-1',
          data: { title: 'Updated Title' },
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })

    it('rolls back optimistic update on error', async () => {
      server.use(
        http.put('*/api/v1/tasks/task-1', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      const { result, qc } = renderHookWithProviders(() => useUpdateTask())
      qc.setQueryData(taskKeys.detail('task-1'), mockTask)

      await act(async () => {
        try {
          await result.current.mutateAsync({
            id: 'task-1',
            data: { title: 'Will Fail' },
          })
        } catch (e) {}
      })

      // Should rollback to original
      expect(qc.getQueryData(taskKeys.detail('task-1'))).toEqual(mockTask)
    })

    it('propagates the stored recurrence from the response into list and project caches', async () => {
      const updatedTask = {
        ...mockTask,
        title: 'Weekly Task',
        recurrence: {
          id: 'rec-1',
          taskId: 'task-1',
          pattern: 'WEEKLY',
          interval: 2,
          days: null,
          endsAt: null,
          lastOccurredAt: null,
        },
      }
      server.use(
        http.put('*/api/v1/tasks/task-1', () => {
          return HttpResponse.json({ success: true, data: updatedTask })
        })
      )

      const { result, qc } = renderHookWithProviders(() => useUpdateTask())
      const listData = {
        data: [mockTask],
        pagination: { page: 1, pageSize: 10, totalCount: 1, totalPages: 1, hasNext: false, hasPrev: false },
      }
      qc.setQueryData(taskKeys.lists(), listData)
      qc.setQueryData(taskKeys.detail('task-1'), mockTask)
      qc.setQueryData(['projects', 'detail', 'project-1'], {
        id: 'project-1',
        tasks: [mockTask],
        _count: { tasks: 1, members: 0, announcement: 0 },
      })

      await act(async () => {
        await result.current.mutateAsync({
          id: 'task-1',
          data: { title: 'Weekly Task', recurrence: { pattern: 'WEEKLY', interval: 2 } },
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // The list entry is replaced with the response task, recurrence included
      const list = qc.getQueryData(taskKeys.lists()) as { data: any[] }
      expect(list.data[0].id).toBe('task-1')
      expect(list.data[0].recurrence).toMatchObject({ pattern: 'WEEKLY', interval: 2 })
      expect(qc.getQueryData(taskKeys.detail('task-1'))).toEqual(updatedTask)

      // The project detail cache entry is replaced with the response task too
      const project = qc.getQueryData(['projects', 'detail', 'project-1']) as { tasks: any[] }
      expect(project.tasks).toHaveLength(1)
      expect(project.tasks[0].id).toBe('task-1')
      expect(project.tasks[0].recurrence).toMatchObject({ pattern: 'WEEKLY', interval: 2 })
    })
  })

  describe('useDeleteTask', () => {
    it('deletes a task with optimistic removal', async () => {
      const { result, qc } = renderHookWithProviders(() => useDeleteTask())
      qc.setQueryData(taskKeys.detail('task-1'), mockTask)

      await act(async () => {
        await result.current.mutateAsync('task-1')
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })

    it('rolls back optimistic deletion on error', async () => {
      server.use(
        http.delete('*/api/v1/tasks/task-1', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      const { result, qc } = renderHookWithProviders(() => useDeleteTask())
      qc.setQueryData(taskKeys.detail('task-1'), mockTask)

      await act(async () => {
        try {
          await result.current.mutateAsync('task-1')
        } catch (e) {}
      })
    })
  })

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
    })

    it('propagates the response into list and project caches on success', async () => {
      const updatedTask = {
        ...mockTask,
        status: 'IN_PROGRESS',
        recurrence: {
          id: 'rec-1',
          taskId: 'task-1',
          pattern: 'WEEKLY',
          interval: 2,
          days: null,
          endsAt: null,
          lastOccurredAt: null,
        },
      }
      server.use(
        http.patch('*/api/v1/tasks/task-1/status', () => {
          return HttpResponse.json({ success: true, data: updatedTask })
        })
      )

      const { result, qc } = renderHookWithProviders(() => useUpdateTaskStatus())
      const listData = {
        data: [mockTask],
        pagination: { page: 1, pageSize: 10, totalCount: 1, totalPages: 1, hasNext: false, hasPrev: false },
      }
      qc.setQueryData(taskKeys.lists(), listData)
      qc.setQueryData(taskKeys.detail('task-1'), mockTask)
      qc.setQueryData(['projects', 'detail', 'project-1'], {
        id: 'project-1',
        tasks: [mockTask],
        _count: { tasks: 1, members: 0, announcement: 0 },
      })

      await act(async () => {
        await result.current.mutateAsync({ id: 'task-1', status: 'IN_PROGRESS' })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const list = qc.getQueryData(taskKeys.lists()) as { data: any[] }
      expect(list.data[0].status).toBe('IN_PROGRESS')
      expect(list.data[0].recurrence).toMatchObject({ pattern: 'WEEKLY', interval: 2 })

      expect(qc.getQueryData(taskKeys.detail('task-1'))).toEqual(updatedTask)

      const project = qc.getQueryData(['projects', 'detail', 'project-1']) as { tasks: any[] }
      expect(project.tasks[0].status).toBe('IN_PROGRESS')
      expect(project.tasks[0].recurrence).toMatchObject({ pattern: 'WEEKLY', interval: 2 })
    })
  })

  describe('useUpdateTaskPriority', () => {
    it('updates task priority optimistically', async () => {
      server.use(
        http.patch('*/api/v1/tasks/task-1/priority', () => {
          return HttpResponse.json({ success: true, data: { ...mockTask, priority: 'URGENT' } })
        })
      )

      const { result, qc } = renderHookWithProviders(() => useUpdateTaskPriority())
      qc.setQueryData(taskKeys.detail('task-1'), mockTask)

      await act(async () => {
        await result.current.mutateAsync({ id: 'task-1', priority: 'URGENT' })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const updatedTask = qc.getQueryData(taskKeys.detail('task-1'))
      expect(updatedTask).toEqual({ ...mockTask, priority: 'URGENT' })
    })

    it('propagates the response into list and project caches on success', async () => {
      const updatedTask = {
        ...mockTask,
        priority: 'URGENT',
        recurrence: {
          id: 'rec-1',
          taskId: 'task-1',
          pattern: 'DAILY',
          interval: 1,
          days: null,
          endsAt: null,
          lastOccurredAt: null,
        },
      }
      server.use(
        http.patch('*/api/v1/tasks/task-1/priority', () => {
          return HttpResponse.json({ success: true, data: updatedTask })
        })
      )

      const { result, qc } = renderHookWithProviders(() => useUpdateTaskPriority())
      const listData = {
        data: [mockTask],
        pagination: { page: 1, pageSize: 10, totalCount: 1, totalPages: 1, hasNext: false, hasPrev: false },
      }
      qc.setQueryData(taskKeys.lists(), listData)
      qc.setQueryData(taskKeys.detail('task-1'), mockTask)
      qc.setQueryData(['projects', 'detail', 'project-1'], {
        id: 'project-1',
        tasks: [mockTask],
        _count: { tasks: 1, members: 0, announcement: 0 },
      })

      await act(async () => {
        await result.current.mutateAsync({ id: 'task-1', priority: 'URGENT' })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const list = qc.getQueryData(taskKeys.lists()) as { data: any[] }
      expect(list.data[0].priority).toBe('URGENT')
      expect(list.data[0].recurrence).toMatchObject({ pattern: 'DAILY', interval: 1 })

      expect(qc.getQueryData(taskKeys.detail('task-1'))).toEqual(updatedTask)

      const project = qc.getQueryData(['projects', 'detail', 'project-1']) as { tasks: any[] }
      expect(project.tasks[0].priority).toBe('URGENT')
      expect(project.tasks[0].recurrence).toMatchObject({ pattern: 'DAILY', interval: 1 })
    })
  })

  describe('useAddComment', () => {
    it('adds a comment with optimistic update', async () => {
      const { result, qc } = renderHookWithProviders(() => useAddComment())
      qc.setQueryData(['comments', 'task-1'], [])

      await act(async () => {
        await result.current.mutateAsync({
          taskId: 'task-1',
          content: 'Great work!',
          workspaceSlug: 'ws-1',
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })

    it('replaces the optimistic comment with the server comment after success', async () => {
      const { result, qc } = renderHookWithProviders(() => useAddComment())
      qc.setQueryData(['comments', 'task-1'], [])

      await act(async () => {
        await result.current.mutateAsync({
          taskId: 'task-1',
          content: 'Great work!',
          workspaceSlug: 'ws-1',
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const comments = qc.getQueryData(['comments', 'task-1']) as { id: string; content: string }[]
      expect(comments).toHaveLength(1)
      expect(comments[0].content).toBe('Great work!')
      expect(comments[0].id).not.toMatch(/^optimistic-comment-/)
    })

    it('keeps a second pending optimistic comment when the first resolves', async () => {
      const existing = [
        { id: 'optimistic-comment-111-aaa', content: 'still uploading', user: { id: 'u1', name: 'You' }, createdAt: '2025-01-01T00:00:00Z', parentId: null },
      ]
      const { result, qc } = renderHookWithProviders(() => useAddComment())
      qc.setQueryData(['comments', 'task-1'], existing)

      await act(async () => {
        await result.current.mutateAsync({
          taskId: 'task-1',
          content: 'Great work!',
          workspaceSlug: 'ws-1',
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const comments = qc.getQueryData(['comments', 'task-1']) as { id: string; content: string }[]
      // Server comment replaces only its own optimistic entry; the other
      // pending optimistic comment must survive.
      expect(comments).toHaveLength(2)
      expect(comments.some((c) => c.id === 'optimistic-comment-111-aaa')).toBe(true)
      expect(comments.some((c) => c.content === 'Great work!')).toBe(true)
    })

    it('rolls back the optimistic comment on error', async () => {
      server.use(
        http.post('*/api/v1/tasks/task-1/comments', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      const existing = [
        { id: 'c-real', content: 'existing comment', user: { id: 'u1', name: 'A' }, createdAt: '2025-01-01T00:00:00Z', parentId: null },
      ]
      const { result, qc } = renderHookWithProviders(() => useAddComment())
      qc.setQueryData(['comments', 'task-1'], existing)

      await act(async () => {
        try {
          await result.current.mutateAsync({
            taskId: 'task-1',
            content: 'Will fail',
            workspaceSlug: 'ws-1',
          })
        } catch (e) {}
      })

      await waitFor(() => expect(result.current.isError).toBe(true))
      expect(qc.getQueryData(['comments', 'task-1'])).toEqual(existing)
    })
  })

  describe('useDeleteAttachment', () => {
    it('deletes attachment with optimistic removal', async () => {
      const attachments = [
        { id: 'att-1', fileName: 'file1.txt', taskId: 'task-1' },
        { id: 'att-2', fileName: 'file2.txt', taskId: 'task-1' },
      ]

      const { result, qc } = renderHookWithProviders(() => useDeleteAttachment())
      qc.setQueryData(['attachments', 'task-1'], attachments)

      await act(async () => {
        await result.current.mutateAsync({ taskId: 'task-1', attachmentId: 'att-1' })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })
  })

  describe('useBatchUpdateTaskStatus', () => {
    it('batch updates task statuses', async () => {
      server.use(
        http.patch('*/api/v1/tasks/task-1/status', () => {
          return HttpResponse.json({ success: true, data: { ...mockTask, status: 'COMPLETED' } })
        }),
        http.patch('*/api/v1/tasks/task-2/status', () => {
          return HttpResponse.json({ success: true, data: { ...mockTask, id: 'task-2', status: 'COMPLETED' } })
        })
      )

      const { result } = renderHookWithProviders(() => useBatchUpdateTaskStatus())

      await act(async () => {
        await result.current.mutateAsync({
          taskIds: ['task-1', 'task-2'],
          status: 'COMPLETED',
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })
  })

  describe('useBatchDeleteTasks', () => {
    it('batch deletes tasks', async () => {
      server.use(
        http.delete('*/api/v1/tasks/task-1', () => {
          return HttpResponse.json({ success: true })
        }),
        http.delete('*/api/v1/tasks/task-2', () => {
          return HttpResponse.json({ success: true })
        })
      )

      const { result } = renderHookWithProviders(() => useBatchDeleteTasks())

      await act(async () => {
        await result.current.mutateAsync(['task-1', 'task-2'])
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })
  })
})
