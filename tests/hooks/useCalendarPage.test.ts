import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import type { Workspace } from '@/hooks/useWorkspace'
import type { Task } from '@/hooks/useTask'

const defaultWorkspace: Workspace = {
  id: 'ws-1', name: 'Test Workspace', slug: 'test-ws', plan: 'FREE',
  ownerId: 'user-1', isPublic: false, allowInvites: true, maxMembers: 5, maxStorage: 1000,
  createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z',
  owner: { id: 'user-1', name: 'Test User', email: 'test@focura.com' },
  members: [],
  _count: { projects: 2, members: 1 },
}

import { useCalendarPage, useMainCalendarPage } from '@/hooks/useCalendarPage'

describe('useCalendarPage', () => {
  it('returns calendar state with default month view', async () => {
    const { result } = renderHook(
      () => useCalendarPage(),
      { wrapper: createWrapper({ defaultWorkspace }) }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.view).toBe('month')
    expect(result.current.showOnlyTimeBound).toBe(true)
    expect(result.current.filteredTasks).toBeDefined()
    expect(result.current.dateRange).toBeDefined()
    expect(result.current.dateRange.start).toBeDefined()
    expect(result.current.dateRange.end).toBeDefined()
  })

  it('navigates to next and previous month', async () => {
    const { result } = renderHook(
      () => useCalendarPage(),
      { wrapper: createWrapper({ defaultWorkspace }) }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const initialDate = result.current.currentDate

    act(() => result.current.handleNext())
    expect(result.current.currentDate.getMonth()).toBe(
      (initialDate.getMonth() + 1) % 12
    )

    act(() => result.current.handlePrevious())
    expect(result.current.currentDate.getMonth()).toBe(initialDate.getMonth())
  })

  it('goes to today', async () => {
    const { result } = renderHook(
      () => useCalendarPage(),
      { wrapper: createWrapper({ defaultWorkspace }) }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => result.current.handlePrevious())

    act(() => result.current.handleToday())

    const today = new Date()
    expect(result.current.currentDate.getMonth()).toBe(today.getMonth())
    expect(result.current.currentDate.getDate()).toBe(today.getDate())
  })

  it('toggles view mode', async () => {
    const { result } = renderHook(
      () => useCalendarPage(),
      { wrapper: createWrapper({ defaultWorkspace }) }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => result.current.setView('week'))
    expect(result.current.view).toBe('week')

    act(() => result.current.setView('day'))
    expect(result.current.view).toBe('day')
  })

  it('filters time-bound tasks', async () => {
    const { result } = renderHook(
      () => useCalendarPage(),
      { wrapper: createWrapper({ defaultWorkspace }) }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.showOnlyTimeBound).toBe(true)

    act(() => result.current.setShowOnlyTimeBound(false))
    expect(result.current.showOnlyTimeBound).toBe(false)
  })

  it('handles task selection modal', async () => {
    const { result } = renderHook(
      () => useCalendarPage(),
      { wrapper: createWrapper({ defaultWorkspace }) }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const mockTask = { id: 'task-1' } as Task
    act(() => result.current.handleTaskClick(mockTask))
    expect(result.current.selectedTask?.id).toBe('task-1')

    act(() => result.current.handleCloseTaskModal())
    expect(result.current.selectedTask).toBeNull()
  })
})

describe('useMainCalendarPage', () => {
  it('returns calendar with month grid and loaded data', async () => {
    const { result } = renderHook(
      () => useMainCalendarPage(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.calendarDays).toBeDefined()
    expect(result.current.calendarDays.length).toBeGreaterThanOrEqual(28)
    expect(result.current.monthStart).toBeDefined()
    expect(result.current.monthEnd).toBeDefined()
    expect(result.current.currentDate).toBeDefined()
  })

  it('provides aggregate and goals lookup by date', async () => {
    const { result } = renderHook(
      () => useMainCalendarPage(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    const someDay = new Date(result.current.monthStart)
    someDay.setDate(1)
    const agg = result.current.getAggregateForDate(someDay)
    const goals = result.current.getGoalsForDate(someDay)
    const events = result.current.getEventsForDate(someDay)

    expect(result.current.aggregates).toBeDefined()
    expect(result.current.goals).toBeDefined()
    expect(result.current.systemEvents).toBeDefined()
  })

  it('navigates months', async () => {
    const { result } = renderHook(
      () => useMainCalendarPage(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    const initialMonth = result.current.monthStart.getMonth()

    act(() => result.current.goToNextMonth())
    expect(result.current.monthStart.getMonth()).toBe((initialMonth + 1) % 12)

    act(() => result.current.goToPreviousMonth())
    expect(result.current.monthStart.getMonth()).toBe(initialMonth)
  })

  it('goes to today', async () => {
    const { result } = renderHook(
      () => useMainCalendarPage(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => result.current.goToNextMonth())
    act(() => result.current.goToToday())

    const today = new Date()
    expect(result.current.currentDate.getMonth()).toBe(today.getMonth())
  })

  it('checks isToday and isCurrentMonth', async () => {
    const { result } = renderHook(
      () => useMainCalendarPage(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    const today = new Date()
    expect(result.current.isToday(today)).toBe(true)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    expect(result.current.isToday(yesterday)).toBe(false)

    expect(result.current.isCurrentMonth(today)).toBe(true)
  })

  it('sets selected workspace and date', async () => {
    const { result } = renderHook(
      () => useMainCalendarPage(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => result.current.setSelectedWorkspace('ws-1'))
    expect(result.current.selectedWorkspace).toBe('ws-1')

    const date = new Date()
    act(() => result.current.setSelectedDate(date))
    expect(result.current.selectedDate?.toDateString()).toBe(date.toDateString())
  })
})
