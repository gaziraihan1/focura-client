import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimeTrackingCard } from '@/components/Dashboard/TaskDetails/TimeTrackingCard'

vi.mock('lucide-react', () => ({
  Timer: (props: any) => <svg data-testid="timer-icon" {...props} />,
  Hourglass: (props: any) => <svg data-testid="hourglass-icon" {...props} />,
  TrendingUp: (props: any) => <svg data-testid="trending-icon" {...props} />,
  AlertCircle: (props: any) => <svg data-testid="alert-icon" {...props} />,
  Clock: (props: any) => <svg data-testid="clock-icon" {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

vi.mock('@/utils/task.utils', () => ({
  formatTimeDuration: (hours: number) => `${hours}h`,
  getTimeStatusColor: () => 'border-blue-500',
}))

describe('TimeTrackingCard', () => {
  it('renders time elapsed', () => {
    const timeTracking = {
      hoursSinceCreation: 24,
      hoursUntilDue: 48,
      isOverdue: false,
      isDueToday: false,
      timeProgress: null,
    }
    render(<TimeTrackingCard timeTracking={timeTracking} />)
    expect(screen.getByText('Time Elapsed')).toBeInTheDocument()
    expect(screen.getByText('24h')).toBeInTheDocument()
  })

  it('renders time remaining when due date exists', () => {
    const timeTracking = {
      hoursSinceCreation: 24,
      hoursUntilDue: 48,
      isOverdue: false,
      isDueToday: false,
      timeProgress: null,
    }
    render(<TimeTrackingCard timeTracking={timeTracking} />)
    expect(screen.getByText('Time Remaining')).toBeInTheDocument()
    expect(screen.getByText('48h')).toBeInTheDocument()
  })

  it('hides time remaining when hoursUntilDue is null', () => {
    const timeTracking = {
      hoursSinceCreation: 24,
      hoursUntilDue: null,
      isOverdue: false,
      isDueToday: false,
      timeProgress: null,
    }
    render(<TimeTrackingCard timeTracking={timeTracking} />)
    expect(screen.queryByText('Time Remaining')).not.toBeInTheDocument()
  })

  it('renders progress when estimatedHours and timeProgress are provided', () => {
    const timeTracking = {
      hoursSinceCreation: 4,
      hoursUntilDue: 4,
      isOverdue: false,
      isDueToday: false,
      timeProgress: 50,
    }
    render(<TimeTrackingCard timeTracking={timeTracking} estimatedHours={8} />)
    expect(screen.getByText('Progress')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('hides progress when no estimatedHours', () => {
    const timeTracking = {
      hoursSinceCreation: 4,
      hoursUntilDue: 4,
      isOverdue: false,
      isDueToday: false,
      timeProgress: 50,
    }
    render(<TimeTrackingCard timeTracking={timeTracking} />)
    expect(screen.queryByText('Progress')).not.toBeInTheDocument()
  })

  it('shows overdue badge when task is overdue', () => {
    const timeTracking = {
      hoursSinceCreation: 100,
      hoursUntilDue: -10,
      isOverdue: true,
      isDueToday: false,
      timeProgress: null,
    }
    render(<TimeTrackingCard timeTracking={timeTracking} />)
    expect(screen.getByText('Overdue')).toBeInTheDocument()
  })

  it('shows due today badge when task is due today', () => {
    const timeTracking = {
      hoursSinceCreation: 24,
      hoursUntilDue: 2,
      isOverdue: false,
      isDueToday: true,
      timeProgress: null,
    }
    render(<TimeTrackingCard timeTracking={timeTracking} />)
    expect(screen.getByText('Due Today')).toBeInTheDocument()
  })

  it('does not show due today when overdue', () => {
    const timeTracking = {
      hoursSinceCreation: 100,
      hoursUntilDue: -10,
      isOverdue: true,
      isDueToday: true,
      timeProgress: null,
    }
    render(<TimeTrackingCard timeTracking={timeTracking} />)
    expect(screen.queryByText('Due Today')).not.toBeInTheDocument()
    expect(screen.getByText('Overdue')).toBeInTheDocument()
  })

  it('renders progress bar with correct width', () => {
    const timeTracking = {
      hoursSinceCreation: 6,
      hoursUntilDue: 2,
      isOverdue: false,
      isDueToday: false,
      timeProgress: 75,
    }
    const { container } = render(
      <TimeTrackingCard timeTracking={timeTracking} estimatedHours={8} />
    )
    const progressBar = container.querySelector('[style*="width"]')
    expect(progressBar).toBeInTheDocument()
  })

  it('shows estimated hours text in progress section', () => {
    const timeTracking = {
      hoursSinceCreation: 4,
      hoursUntilDue: 4,
      isOverdue: false,
      isDueToday: false,
      timeProgress: 50,
    }
    render(<TimeTrackingCard timeTracking={timeTracking} estimatedHours={8} />)
    expect(screen.getByText(/4h \/ 8h estimated/)).toBeInTheDocument()
  })
})
