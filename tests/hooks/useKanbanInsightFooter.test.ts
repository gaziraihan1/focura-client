import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useKanbanInsightFooter } from '@/hooks/useKanbanInsightFooter'
import type { Task } from '@/hooks/useTask'

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Test Task',
    description: null,
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: null,
    startDate: undefined,
    estimatedHours: undefined,
    createdBy: { id: 'user-1', name: 'Test User' },
    assignees: [],
    project: {
      id: 'project-1', slug: 'test-project', name: 'Test Project',
      color: '#000', workspace: { id: 'ws-1', name: 'Test Workspace' },
    },
    _count: { comments: 0, subtasks: 0, files: 0 },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-06-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('useKanbanInsightFooter', () => {
  it('computes insights for a mixed set of tasks', () => {
    const tasks = [
      makeTask({ id: 't1', status: 'COMPLETED', updatedAt: new Date().toISOString() }),
      makeTask({ id: 't2', status: 'IN_PROGRESS', updatedAt: '2024-01-01T00:00:00.000Z' }),
      makeTask({ id: 't3', status: 'IN_PROGRESS', updatedAt: '2024-06-10T00:00:00.000Z' }),
      makeTask({ id: 't4', status: 'BLOCKED', updatedAt: '2024-05-01T00:00:00.000Z' }),
      makeTask({ id: 't5', status: 'IN_REVIEW', updatedAt: '2024-06-15T00:00:00.000Z' }),
    ]

    const { result } = renderHook(() => useKanbanInsightFooter({ tasks }))

    expect(result.current.insights.totalBlocked).toBe(1)
    expect(result.current.insights.totalInProgress).toBe(2)
    expect(result.current.insights.avgCycleTime).toBe(4.2)
    expect(result.current.insights.completedThisWeek).toBe(1)
  })

  it('handles empty tasks array', () => {
    const { result } = renderHook(() => useKanbanInsightFooter({ tasks: [] }))

    expect(result.current.insights.totalBlocked).toBe(0)
    expect(result.current.insights.totalInProgress).toBe(0)
    expect(result.current.insights.completedThisWeek).toBe(0)
    expect(result.current.insights.oldestTaskTitle).toBe('N/A')
    expect(result.current.insights.oldestTaskAge).toBe(0)
  })

  it('identifies bottleneck column', () => {
    const tasks = [
      makeTask({ id: 't1', status: 'BLOCKED', updatedAt: '2024-01-01T00:00:00.000Z' }),
      makeTask({ id: 't2', status: 'TODO', updatedAt: '2024-01-15T00:00:00.000Z' }),
      makeTask({ id: 't3', status: 'TODO', updatedAt: '2024-02-01T00:00:00.000Z' }),
    ]

    const { result } = renderHook(() => useKanbanInsightFooter({ tasks }))

    expect(result.current.insights.bottleneckColumn).toBe('TODO')
    expect(result.current.insights.oldestTaskTitle).toBe('Test Task')
  })

  it('handles only completed tasks', () => {
    const tasks = [
      makeTask({ id: 't1', status: 'COMPLETED', updatedAt: new Date().toISOString() }),
      makeTask({ id: 't2', status: 'COMPLETED', updatedAt: new Date().toISOString() }),
    ]

    const { result } = renderHook(() => useKanbanInsightFooter({ tasks }))

    expect(result.current.insights.totalBlocked).toBe(0)
    expect(result.current.insights.totalInProgress).toBe(0)
    expect(result.current.insights.completedThisWeek).toBe(2)
    expect(result.current.insights.oldestTaskTitle).toBe('N/A')
    expect(result.current.insights.bottleneckColumn).toBe('None')
  })
})
