import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CalendarSidebar } from '@/components/Dashboard/CalendarView/CalendarSidebar'

vi.mock('@/components/Dashboard/CalendarView/StatCard', () => ({
  __esModule: true,
  default: ({ label, value }: Record<string, unknown>) => (
    <div data-testid="stat-card">{label}: {value}</div>
  ),
}))

vi.mock('@/components/Dashboard/CalendarView/TaskSection', () => ({
  __esModule: true,
  default: ({ title, count }: Record<string, unknown>) => (
    <div data-testid="task-section">{title} ({count})</div>
  ),
}))

const makeTask = (overrides: Record<string, unknown> = {}) => ({
  id: 'task-1',
  title: 'Test Task',
  priority: 'MEDIUM',
  status: 'IN_PROGRESS',
  dueDate: '2025-07-20T00:00:00.000Z',
  startDate: null,
  estimatedHours: 2,
  assignees: [] as any[],
  project: undefined as any,
  ...overrides,
})

describe('CalendarSidebar', () => {
  it('renders Time Overview heading', () => {
    render(
      <CalendarSidebar
        currentDate={new Date(2025, 6, 15)}
        tasks={[]}
        onTaskClick={vi.fn()}
      />
    )
    expect(screen.getByText('Time Overview')).toBeInTheDocument()
  })

  it('shows empty state when no tasks', () => {
    render(
      <CalendarSidebar
        currentDate={new Date(2025, 6, 15)}
        tasks={[]}
        onTaskClick={vi.fn()}
      />
    )
    expect(screen.getByText('No time-bound tasks scheduled')).toBeInTheDocument()
  })

  it('shows personal and assigned task counts', () => {
    const tasks = [
      makeTask({ id: '1', assignees: [] }),
      makeTask({ id: '2', assignees: [{ id: 'u1' }] }),
    ]
    render(
      <CalendarSidebar
        currentDate={new Date(2025, 6, 15)}
        tasks={tasks}
        onTaskClick={vi.fn()}
      />
    )
    const statCards = document.querySelectorAll('[data-testid="stat-card"]')
    expect(statCards.length).toBe(2)
  })

  it('shows conflict warning for 4+ tasks on same day', () => {
    const tasks = Array.from({ length: 5 }, (_, i) =>
      makeTask({ id: `t-${i}`, dueDate: '2025-07-20T00:00:00.000Z' })
    )
    render(
      <CalendarSidebar
        currentDate={new Date(2025, 6, 15)}
        tasks={tasks}
        onTaskClick={vi.fn()}
      />
    )
    expect(screen.getByText(/Time Conflicts Detected/)).toBeInTheDocument()
  })
})
