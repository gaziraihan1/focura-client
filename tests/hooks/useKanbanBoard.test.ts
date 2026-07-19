import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useKanbanBoard, COLUMNS } from '@/hooks/useKanbanBoard'
import { useKanbanInsightFooter } from '@/hooks/useKanbanInsightFooter'

const makeTask = (overrides: Record<string, any> = {}) => ({
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
  createdBy: { id: 'user-1', name: 'Alice' },
  assignees: [],
  labels: [],
  attachments: [],
  _count: { subtasks: 0, comments: 0, attachments: 0 },
  project: { id: 'proj-1', name: 'P', slug: 'p', workspace: { id: 'ws-1', name: 'W', slug: 'w' } },
  ...overrides,
})

describe('useKanbanBoard', () => {
  it('groups tasks by column status', () => {
    const tasks = [
      makeTask({ id: 't1', status: 'TODO' }),
      makeTask({ id: 't2', status: 'IN_PROGRESS' }),
      makeTask({ id: 't3', status: 'COMPLETED' }),
    ]

    const { result } = renderHook(() =>
      useKanbanBoard({ tasks, sort: 'recent', focusMode: false })
    )

    expect(result.current.sortedTasksByColumn.get('backlog')).toHaveLength(1)
    expect(result.current.sortedTasksByColumn.get('in-progress')).toHaveLength(1)
    expect(result.current.sortedTasksByColumn.get('done')).toHaveLength(1)
    expect(result.current.sortedTasksByColumn.get('review')).toHaveLength(0)
  })

  it('sorts by priority', () => {
    const tasks = [
      makeTask({ id: 't1', priority: 'LOW', status: 'TODO' }),
      makeTask({ id: 't2', priority: 'URGENT', status: 'TODO' }),
      makeTask({ id: 't3', priority: 'HIGH', status: 'TODO' }),
    ]

    const { result } = renderHook(() =>
      useKanbanBoard({ tasks, sort: 'priority', focusMode: false })
    )

    const backlogTasks = result.current.sortedTasksByColumn.get('backlog')!
    expect(backlogTasks[0].priority).toBe('URGENT')
    expect(backlogTasks[1].priority).toBe('HIGH')
    expect(backlogTasks[2].priority).toBe('LOW')
  })

  it('sorts by comments count', () => {
    const tasks = [
      makeTask({ id: 't1', _count: { subtasks: 0, comments: 2, attachments: 0 }, status: 'TODO' }),
      makeTask({ id: 't2', _count: { subtasks: 0, comments: 5, attachments: 0 }, status: 'TODO' }),
      makeTask({ id: 't3', _count: { subtasks: 0, comments: 1, attachments: 0 }, status: 'TODO' }),
    ]

    const { result } = renderHook(() =>
      useKanbanBoard({ tasks, sort: 'comments', focusMode: false })
    )

    const backlogTasks = result.current.sortedTasksByColumn.get('backlog')!
    expect(backlogTasks[0]._count.comments).toBe(5)
    expect(backlogTasks[1]._count.comments).toBe(2)
  })

  it('calculates column stats', () => {
    const tasks = [
      makeTask({ id: 't1', status: 'TODO' }),
      makeTask({ id: 't2', status: 'TODO' }),
    ]

    const { result } = renderHook(() =>
      useKanbanBoard({ tasks, sort: 'recent', focusMode: false })
    )

    const backlogStats = result.current.columnStats.get('backlog')!
    expect(backlogStats.count).toBe(2)
    expect(backlogStats.avgDays).toBeGreaterThanOrEqual(0)
  })

  it('filters columns in focus mode', () => {
    const tasks = [makeTask({ status: 'TODO' })]

    const { result } = renderHook(() =>
      useKanbanBoard({ tasks, sort: 'recent', focusMode: true })
    )

    const columnIds = result.current.visibleColumns.map((c) => c.id)
    expect(columnIds).not.toContain('backlog')
    expect(columnIds).not.toContain('done')
    expect(columnIds).toContain('in-progress')
  })

  it('shows all columns when not in focus mode', () => {
    const { result } = renderHook(() =>
      useKanbanBoard({ tasks: [], sort: 'recent', focusMode: false })
    )

    expect(result.current.visibleColumns).toHaveLength(COLUMNS.length)
  })

  it('has correct column config', () => {
    expect(COLUMNS).toHaveLength(5)
    expect(COLUMNS[0].id).toBe('backlog')
    expect(COLUMNS[4].id).toBe('done')
  })
})

describe('useKanbanInsightFooter', () => {
  it('calculates completed this week', () => {
    const recentDate = new Date()
    recentDate.setHours(recentDate.getHours() - 2)

    const tasks = [
      makeTask({ id: 't1', status: 'COMPLETED', updatedAt: recentDate.toISOString() }),
      makeTask({ id: 't2', status: 'TODO' }),
    ]

    const { result } = renderHook(() =>
      useKanbanInsightFooter({ tasks })
    )

    expect(result.current.insights.completedThisWeek).toBeGreaterThanOrEqual(1)
  })

  it('counts blocked tasks', () => {
    const tasks = [
      makeTask({ id: 't1', status: 'BLOCKED' }),
      makeTask({ id: 't2', status: 'BLOCKED' }),
      makeTask({ id: 't3', status: 'TODO' }),
    ]

    const { result } = renderHook(() =>
      useKanbanInsightFooter({ tasks })
    )

    expect(result.current.insights.totalBlocked).toBe(2)
  })

  it('counts in-progress tasks', () => {
    const tasks = [
      makeTask({ id: 't1', status: 'IN_PROGRESS' }),
      makeTask({ id: 't2', status: 'IN_PROGRESS' }),
    ]

    const { result } = renderHook(() =>
      useKanbanInsightFooter({ tasks })
    )

    expect(result.current.insights.totalInProgress).toBe(2)
  })

  it('returns avg cycle time', () => {
    const { result } = renderHook(() =>
      useKanbanInsightFooter({ tasks: [] })
    )

    expect(result.current.insights.avgCycleTime).toBe(4.2)
  })

  it('handles empty tasks', () => {
    const { result } = renderHook(() =>
      useKanbanInsightFooter({ tasks: [] })
    )

    expect(result.current.insights.completedThisWeek).toBe(0)
    expect(result.current.insights.totalBlocked).toBe(0)
    expect(result.current.insights.oldestTaskTitle).toBe('N/A')
  })

  it('finds bottleneck column', () => {
    const oldDate = new Date()
    oldDate.setDate(oldDate.getDate() - 10)

    const tasks = Array.from({ length: 5 }, (_, i) =>
      makeTask({ id: `t${i}`, status: 'IN_PROGRESS', updatedAt: oldDate.toISOString() })
    )

    const { result } = renderHook(() =>
      useKanbanInsightFooter({ tasks })
    )

    expect(result.current.insights.bottleneckColumn).toBe('IN_PROGRESS')
  })
})
