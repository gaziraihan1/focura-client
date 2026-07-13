import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCalendarDayView } from '@/hooks/useCalenderDayView'

const makeTask = (overrides: Record<string, any> = {}) => ({
  id: 'task-1',
  title: 'Test Task',
  description: '',
  status: 'TODO' as const,
  priority: 'MEDIUM' as const,
  startDate: null,
  dueDate: null,
  estimatedHours: 2,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  projectId: 'proj-1',
  workspaceId: 'ws-1',
  createdById: 'user-1',
  createdBy: { id: 'user-1', name: 'Alice' },
  assignees: [],
  labels: [],
  attachments: [],
  _count: { subtasks: 0, comments: 0, attachments: 0 },
  project: { id: 'proj-1', name: 'P', slug: 'p', workspace: { id: 'ws-1', name: 'W', slug: 'w' } },
  ...overrides,
})

describe('useCalendarDayView', () => {
  it('filters tasks for the current day by dueDate', () => {
    const today = new Date()
    const tasks = [
      makeTask({ id: 't1', dueDate: today.toISOString() }),
      makeTask({ id: 't2', dueDate: '2020-01-01T10:00:00.000Z' }),
    ]

    const { result } = renderHook(() => useCalendarDayView(today, tasks))
    expect(result.current.dayTasks).toHaveLength(1)
    expect(result.current.dayTasks[0].id).toBe('t1')
  })

  it('filters tasks by startDate when no dueDate', () => {
    const today = new Date()
    const tasks = [
      makeTask({ id: 't1', dueDate: null, startDate: today.toISOString() }),
      makeTask({ id: 't2', dueDate: null, startDate: '2020-01-01T10:00:00.000Z' }),
    ]

    const { result } = renderHook(() => useCalendarDayView(today, tasks))
    expect(result.current.dayTasks).toHaveLength(1)
    expect(result.current.dayTasks[0].id).toBe('t1')
  })

  it('excludes tasks with no date', () => {
    const today = new Date()
    const tasks = [
      makeTask({ id: 't1', dueDate: null, startDate: null }),
    ]

    const { result } = renderHook(() => useCalendarDayView(today, tasks))
    expect(result.current.dayTasks).toHaveLength(0)
  })

  it('calculates total estimated hours', () => {
    const today = new Date()
    const tasks = [
      makeTask({ id: 't1', estimatedHours: 2, dueDate: today.toISOString() }),
      makeTask({ id: 't2', estimatedHours: 3, dueDate: today.toISOString() }),
    ]

    const { result } = renderHook(() => useCalendarDayView(today, tasks))
    expect(result.current.totalEstimatedHours).toBe(5)
  })

  it('returns empty categorizedTasks when no tasks match', () => {
    const today = new Date()
    const tasks = [
      makeTask({ id: 't1', dueDate: '2020-01-01T10:00:00.000Z' }),
    ]

    const { result } = renderHook(() => useCalendarDayView(today, tasks))
    expect(result.current.categorizedTasks.urgent).toHaveLength(0)
    expect(result.current.categorizedTasks.high).toHaveLength(0)
    expect(result.current.categorizedTasks.medium).toHaveLength(0)
    expect(result.current.categorizedTasks.low).toHaveLength(0)
    expect(result.current.categorizedTasks.overdue).toHaveLength(0)
  })

  it('handles empty tasks', () => {
    const today = new Date()
    const { result } = renderHook(() => useCalendarDayView(today, []))

    expect(result.current.dayTasks).toHaveLength(0)
    expect(result.current.totalEstimatedHours).toBe(0)
  })

  it('returns categorizedTasks object with all required keys', () => {
    const today = new Date()
    const { result } = renderHook(() => useCalendarDayView(today, []))

    expect(result.current.categorizedTasks).toHaveProperty('urgent')
    expect(result.current.categorizedTasks).toHaveProperty('high')
    expect(result.current.categorizedTasks).toHaveProperty('medium')
    expect(result.current.categorizedTasks).toHaveProperty('low')
    expect(result.current.categorizedTasks).toHaveProperty('overdue')
  })
})
