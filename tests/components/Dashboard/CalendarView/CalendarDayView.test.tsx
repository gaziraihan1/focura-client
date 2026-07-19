import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createWrapper } from '../../../utils/renderWithProviders'

vi.mock('@/hooks/useCalenderDayView', () => ({
  useCalendarDayView: () => ({
    dayTasks: [],
    categorizedTasks: { overdue: [], urgent: [], high: [], medium: [], low: [] },
    totalEstimatedHours: 0,
  }),
}))

vi.mock('@/components/Dashboard/CalendarView/CalendarDayView/DayViewHeader', () => ({
  DayViewHeader: () => <div data-testid="day-view-header">Day Header</div>,
}))

vi.mock('@/components/Dashboard/CalendarView/CalendarDayView/DayViewStats', () => ({
  DayViewStats: () => <div data-testid="day-view-stats">Day Stats</div>,
}))

vi.mock('@/components/Dashboard/CalendarView/CalendarDayView/TaskPrioritySection', () => ({
  TaskPrioritySection: ({ priority }: any) => <div data-testid={`priority-${priority}`}>{priority}</div>,
}))

vi.mock('@/components/Dashboard/CalendarView/CalendarDayView/DayViewEmptyState', () => ({
  DayViewEmptyState: () => <div data-testid="day-view-empty">No tasks</div>,
}))

vi.mock('@/components/Dashboard/CalendarView/CalendarDayView/DayViewLoadingState', () => ({
  DayViewLoadingState: () => <div data-testid="day-view-loading">Loading...</div>,
}))

import { CalendarDayView } from '@/components/Dashboard/CalendarView/CalendarDayView'

describe('CalendarDayView', () => {
  it('shows loading state', () => {
    render(
      <CalendarDayView
        currentDate={new Date()}
        tasks={[]}
        onTaskClick={vi.fn()}
        isLoading={true}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByTestId('day-view-loading')).toBeInTheDocument()
  })

  it('renders priority sections when not loading', () => {
    render(
      <CalendarDayView
        currentDate={new Date()}
        tasks={[]}
        onTaskClick={vi.fn()}
        isLoading={false}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByTestId('day-view-header')).toBeInTheDocument()
    expect(screen.getByTestId('day-view-stats')).toBeInTheDocument()
    expect(screen.getByTestId('priority-overdue')).toBeInTheDocument()
    expect(screen.getByTestId('priority-urgent')).toBeInTheDocument()
    expect(screen.getByTestId('priority-high')).toBeInTheDocument()
    expect(screen.getByTestId('priority-medium')).toBeInTheDocument()
    expect(screen.getByTestId('priority-low')).toBeInTheDocument()
  })

  it('shows empty state when no day tasks', () => {
    render(
      <CalendarDayView
        currentDate={new Date()}
        tasks={[]}
        onTaskClick={vi.fn()}
        isLoading={false}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByTestId('day-view-empty')).toBeInTheDocument()
  })
})
