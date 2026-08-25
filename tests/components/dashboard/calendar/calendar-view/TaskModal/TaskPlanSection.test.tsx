import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TaskPlanSection } from '@/components/dashboard/calendar/calendar-view/TaskModal/TaskPlanSection'

describe('TaskPlanSection', () => {
  it('renders nothing when no plan data', () => {
    const { container } = render(<TaskPlanSection />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders milestone with title, status and progress', () => {
    render(
      <TaskPlanSection
        milestone={{ id: 'm1', title: 'Q3 Launch', status: 'IN_PROGRESS', progress: 60 }}
      />
    )
    expect(screen.getByText('Q3 Launch')).toBeInTheDocument()
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveStyle({ width: '60%' })
  })

  it('renders sprint name', () => {
    render(<TaskPlanSection sprint={{ id: 's1', name: 'Sprint 12' }} />)
    expect(screen.getByText('Sprint 12')).toBeInTheDocument()
  })

  it('renders recurrence pattern and interval', () => {
    render(
      <TaskPlanSection
        recurrence={{ id: 'r1', pattern: 'WEEKLY', interval: 1, endsAt: null, days: null }}
      />
    )
    expect(screen.getByText(/Repeats weekly every 1 period/)).toBeInTheDocument()
  })

  it('renders recurrence end date when provided', () => {
    render(
      <TaskPlanSection
        recurrence={{ id: 'r1', pattern: 'DAILY', interval: 2, endsAt: '2025-12-31', days: null }}
      />
    )
    expect(screen.getByText(/until/)).toBeInTheDocument()
  })

  it('shows header when milestone present', () => {
    render(<TaskPlanSection milestone={{ id: 'm1', title: 'Goal', status: null, progress: null }} />)
    expect(screen.getByText('Plan')).toBeInTheDocument()
  })
})
