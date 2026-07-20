import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react'
import { useKanbanCard } from '@/hooks/useKanbanCard'

const makeTask = (overrides: Record<string, unknown> = {}) => ({
  id: 'task-1',
  title: 'Test Task',
  description: '',
  status: 'TODO' as const,
  priority: 'MEDIUM' as const,
  startDate: null,
  dueDate: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  projectId: 'proj-1',
  workspaceId: 'ws-1',
  createdById: 'user-1',
  createdBy: { id: 'user-1', name: 'Alice', email: 'a@test.com', image: null },
  assignees: [],
  labels: [],
  attachments: [],
  _count: { subtasks: 0, comments: 0, attachments: 0 },
  project: { id: 'proj-1', name: 'Project', slug: 'proj', workspace: { id: 'ws-1', name: 'Ws', slug: 'ws' } },
  ...overrides,
})

describe('useKanbanCard', () => {
  describe('daysStale', () => {
    it('calculates days since last update', () => {
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
      const task = makeTask({ updatedAt: threeDaysAgo.toISOString() })

      const { result } = renderHook(() => useKanbanCard({ task, isBlocked: false }))

      expect(result.current.daysStale).toBe(3)
    })

    it('returns 0 for recently updated task', () => {
      const task = makeTask({ updatedAt: new Date().toISOString() })

      const { result } = renderHook(() => useKanbanCard({ task, isBlocked: false }))

      expect(result.current.daysStale).toBe(0)
    })
  })

  describe('agingStatus', () => {
    it('returns normal for 0-2 days', () => {
      const task = makeTask({ updatedAt: new Date().toISOString() })

      const { result } = renderHook(() => useKanbanCard({ task, isBlocked: false }))

      expect(result.current.agingStatus).toBe('normal')
    })

    it('returns warning for 3-5 days', () => {
      const fiveDaysAgo = new Date()
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 4)
      const task = makeTask({ updatedAt: fiveDaysAgo.toISOString() })

      const { result } = renderHook(() => useKanbanCard({ task, isBlocked: false }))

      expect(result.current.agingStatus).toBe('warning')
    })

    it('returns critical for >5 days', () => {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const task = makeTask({ updatedAt: sevenDaysAgo.toISOString() })

      const { result } = renderHook(() => useKanbanCard({ task, isBlocked: false }))

      expect(result.current.agingStatus).toBe('critical')
    })
  })

  describe('isOverdue', () => {
    it('returns true when due date is past and not completed', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const task = makeTask({ dueDate: yesterday.toISOString(), status: 'TODO' })

      const { result } = renderHook(() => useKanbanCard({ task, isBlocked: false }))

      expect(result.current.isOverdue).toBe(true)
    })

    it('returns false when due date is past but completed', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const task = makeTask({ dueDate: yesterday.toISOString(), status: 'COMPLETED' })

      const { result } = renderHook(() => useKanbanCard({ task, isBlocked: false }))

      expect(result.current.isOverdue).toBe(false)
    })

    it('returns falsy when no due date', () => {
      const task = makeTask({ dueDate: null })

      const { result } = renderHook(() => useKanbanCard({ task, isBlocked: false }))

      expect(result.current.isOverdue).toBeFalsy()
    })

    it('returns false when due date is in the future', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const task = makeTask({ dueDate: tomorrow.toISOString() })

      const { result } = renderHook(() => useKanbanCard({ task, isBlocked: false }))

      expect(result.current.isOverdue).toBe(false)
    })
  })

  describe('subtaskProgress', () => {
    it('returns 0 when no subtasks', () => {
      const task = makeTask({ _count: { subtasks: 0, comments: 0, attachments: 0 } })

      const { result } = renderHook(() => useKanbanCard({ task, isBlocked: false }))

      expect(result.current.subtaskProgress).toBe(0)
    })

    it('calculates progress based on subtask count', () => {
      const task = makeTask({ _count: { subtasks: 10, comments: 0, attachments: 0 } })

      const { result } = renderHook(() => useKanbanCard({ task, isBlocked: false }))

      expect(result.current.subtaskProgress).toBe(7) // 10 * 0.7
    })
  })

  describe('getPriorityColor', () => {
    it('returns red for URGENT', () => {
      const task = makeTask({ priority: 'URGENT' })

      const { result } = renderHook(() => useKanbanCard({ task, isBlocked: false }))

      expect(result.current.getPriorityColor()).toContain('red')
    })

    it('returns orange for HIGH', () => {
      const task = makeTask({ priority: 'HIGH' })

      const { result } = renderHook(() => useKanbanCard({ task, isBlocked: false }))

      expect(result.current.getPriorityColor()).toContain('orange')
    })

    it('returns blue for MEDIUM', () => {
      const task = makeTask({ priority: 'MEDIUM' })

      const { result } = renderHook(() => useKanbanCard({ task, isBlocked: false }))

      expect(result.current.getPriorityColor()).toContain('blue')
    })

    it('returns gray for LOW', () => {
      const task = makeTask({ priority: 'LOW' })

      const { result } = renderHook(() => useKanbanCard({ task, isBlocked: false }))

      expect(result.current.getPriorityColor()).toContain('gray')
    })
  })

  describe('getAgingBorder', () => {
    it('returns destructive ring for critical', () => {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const task = makeTask({ updatedAt: sevenDaysAgo.toISOString() })

      const { result } = renderHook(() => useKanbanCard({ task, isBlocked: false }))

      expect(result.current.getAgingBorder()).toContain('ring-destructive')
    })

    it('returns amber ring for warning', () => {
      const fourDaysAgo = new Date()
      fourDaysAgo.setDate(fourDaysAgo.getDate() - 4)
      const task = makeTask({ updatedAt: fourDaysAgo.toISOString() })

      const { result } = renderHook(() => useKanbanCard({ task, isBlocked: false }))

      expect(result.current.getAgingBorder()).toContain('ring-amber')
    })

    it('returns empty for normal', () => {
      const task = makeTask({ updatedAt: new Date().toISOString() })

      const { result } = renderHook(() => useKanbanCard({ task, isBlocked: false }))

      expect(result.current.getAgingBorder()).toBe('')
    })
  })
})
