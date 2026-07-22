import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaskTimeDetails } from '@/components/Dashboard/CalendarView/TaskModal/TaskTimeDetails'

vi.mock('lucide-react', () => ({
  Clock: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
}))

describe('TaskTimeDetails', () => {
  it('renders time details header', () => {
    render(
      <TaskTimeDetails
        startDate="2026-07-01T00:00:00Z"
        dueDate="2026-07-15T00:00:00Z"
        estimatedHours={8}
        createdAt="2026-06-28T00:00:00Z"
        isOverdue={false}
      />
    )
    expect(screen.getByText('Time Details')).toBeInTheDocument()
  })

  it('renders start date', () => {
    render(
      <TaskTimeDetails
        startDate="2026-07-01T00:00:00Z"
        dueDate={null}
        estimatedHours={null}
        createdAt="2026-06-28T00:00:00Z"
        isOverdue={false}
      />
    )
    expect(screen.getByText('Start Date:')).toBeInTheDocument()
    expect(screen.getByText('Jul 1, 2026')).toBeInTheDocument()
  })

  it('renders due date', () => {
    render(
      <TaskTimeDetails
        startDate={null}
        dueDate="2026-07-15T00:00:00Z"
        estimatedHours={null}
        createdAt="2026-06-28T00:00:00Z"
        isOverdue={false}
      />
    )
    expect(screen.getByText('Due Date:')).toBeInTheDocument()
    expect(screen.getByText('Jul 15, 2026')).toBeInTheDocument()
  })

  it('renders estimated hours', () => {
    render(
      <TaskTimeDetails
        startDate={null}
        dueDate={null}
        estimatedHours={8}
        createdAt="2026-06-28T00:00:00Z"
        isOverdue={false}
      />
    )
    expect(screen.getByText('Estimated Time:')).toBeInTheDocument()
    expect(screen.getByText('8h')).toBeInTheDocument()
  })

  it('always renders created date', () => {
    render(
      <TaskTimeDetails
        startDate={null}
        dueDate={null}
        estimatedHours={null}
        createdAt="2026-06-28T00:00:00Z"
        isOverdue={false}
      />
    )
    expect(screen.getByText('Created:')).toBeInTheDocument()
    expect(screen.getByText('Jun 28, 2026')).toBeInTheDocument()
  })

  it('applies destructive color to overdue due date', () => {
    render(
      <TaskTimeDetails
        startDate={null}
        dueDate="2026-07-15T00:00:00Z"
        estimatedHours={null}
        createdAt="2026-06-28T00:00:00Z"
        isOverdue={true}
      />
    )
    const dueDateEl = screen.getByText('Jul 15, 2026')
    expect(dueDateEl).toHaveClass('text-destructive')
  })
})
