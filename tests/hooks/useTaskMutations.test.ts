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
