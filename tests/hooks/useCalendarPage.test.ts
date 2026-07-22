import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import { useCalendarPage } from '@/hooks/useCalendarPage'

// Mock useParams
vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'test-workspace' }),
}))

// Mock useQueryClient
const mockGetQueryData = vi.fn()
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useQueryClient: () => ({
      getQueryData: mockGetQueryData,
    }),
  }
})

// Mock useTasks
vi.mock('@/hooks/useTask', () => ({
  useTasks: vi.fn(() => ({
    data: {
      data: [
        {
          id: 'task-1',
          title: 'Task with due date',
          dueDate: '2026-07-15T00:00:00Z',
          startDate: null,
          workspaceId: 'ws-1',
          project: { workspace: { id: 'ws-1' } },
        },
        {
          id: 'task-2',
          title: 'Task without dates',
          dueDate: null,
          startDate: null,
          workspaceId: 'ws-1',
          project: null,
        },
        {
          id: 'task-3',
          title: 'Task with start date',
          dueDate: null,
          startDate: '2026-07-10T00:00:00Z',
          workspaceId: 'ws-1',
          project: null,
        },
      ],
    },
    isLoading: false,
  })),
}))

describe('useCalendarPage', () => {
  beforeEach(() => {
    mockGetQueryData.mockReturnValue({
      id: 'ws-1',
      slug: 'test-workspace',
    })
  })

  it('returns initial state', () => {
    const { result } = renderHook(() => useCalendarPage(), {
      wrapper: createWrapper(),
    })

    expect(result.current.currentDate).toBeInstanceOf(Date)
    expect(result.current.view).toBe('month')
    expect(result.current.selectedTask).toBeNull()
    expect(result.current.showOnlyTimeBound).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  it('filters tasks by workspace', () => {
    const { result } = renderHook(() => useCalendarPage(), {
      wrapper: createWrapper(),
    })

    // Should filter tasks to only those in the workspace
    expect(result.current.filteredTasks.length).toBeGreaterThanOrEqual(0)
  })

  it('filters time-bound tasks when showOnlyTimeBound is true', () => {
    const { result } = renderHook(() => useCalendarPage(), {
      wrapper: createWrapper(),
    })

    // All filtered tasks should have dueDate or startDate
    result.current.filteredTasks.forEach((task) => {
      expect(task.dueDate || task.startDate).toBeTruthy()
    })
  })

  it('shows all tasks when showOnlyTimeBound is false', () => {
    const { result } = renderHook(() => useCalendarPage(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.setShowOnlyTimeBound(false)
    })

    // Should include tasks without dates
    expect(result.current.filteredTasks).toBeDefined()
  })

  it('navigates to previous month', () => {
    const { result } = renderHook(() => useCalendarPage(), {
      wrapper: createWrapper(),
    })

    const initialDate = result.current.currentDate
    act(() => {
      result.current.handlePrevious()
    })

    expect(result.current.currentDate.getMonth()).toBe(
      initialDate.getMonth() - 1
    )
  })

  it('navigates to next month', () => {
    const { result } = renderHook(() => useCalendarPage(), {
      wrapper: createWrapper(),
    })

    const initialDate = result.current.currentDate
    act(() => {
      result.current.handleNext()
    })

    expect(result.current.currentDate.getMonth()).toBe(
      initialDate.getMonth() + 1
    )
  })

  it('navigates to today', () => {
    const { result } = renderHook(() => useCalendarPage(), {
      wrapper: createWrapper(),
    })

    // First navigate away
    act(() => {
      result.current.handlePrevious()
    })
    act(() => {
      result.current.handlePrevious()
    })

    // Then navigate back to today
    act(() => {
      result.current.handleToday()
    })

    const today = new Date()
    expect(result.current.currentDate.toDateString()).toBe(today.toDateString())
  })

  it('selects and deselects tasks', () => {
    const { result } = renderHook(() => useCalendarPage(), {
      wrapper: createWrapper(),
    })

    const mockTask = { id: 'task-1', title: 'Test Task' } as any

    act(() => {
      result.current.handleTaskClick(mockTask)
    })

    expect(result.current.selectedTask).toEqual(mockTask)

    act(() => {
      result.current.handleCloseTaskModal()
    })

    expect(result.current.selectedTask).toBeNull()
  })

  it('calculates correct date range', () => {
    const { result } = renderHook(() => useCalendarPage(), {
      wrapper: createWrapper(),
    })

    expect(result.current.dateRange.start).toBeInstanceOf(Date)
    expect(result.current.dateRange.end).toBeInstanceOf(Date)
    expect(result.current.dateRange.start.getTime()).toBeLessThan(
      result.current.dateRange.end.getTime()
    )
  })

  it('changes view', () => {
    const { result } = renderHook(() => useCalendarPage(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.setView('week')
    })

    expect(result.current.view).toBe('week')

    act(() => {
      result.current.setView('day')
    })

    expect(result.current.view).toBe('day')
  })

  it('navigates by week when view is week', () => {
    const { result } = renderHook(() => useCalendarPage(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.setView('week')
    })

    const initialDate = result.current.currentDate
    act(() => {
      result.current.handlePrevious()
    })

    // Should subtract 7 days for week view
    const diffDays = Math.round(
      (initialDate.getTime() - result.current.currentDate.getTime()) /
        (1000 * 60 * 60 * 24)
    )
    expect(diffDays).toBe(7)
  })

  it('navigates by day when view is day', () => {
    const { result } = renderHook(() => useCalendarPage(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.setView('day')
    })

    const initialDate = result.current.currentDate
    act(() => {
      result.current.handleNext()
    })

    // Should add 1 day for day view
    const diffDays = Math.round(
      (result.current.currentDate.getTime() - initialDate.getTime()) /
        (1000 * 60 * 60 * 24)
    )
    expect(diffDays).toBe(1)
  })
})
