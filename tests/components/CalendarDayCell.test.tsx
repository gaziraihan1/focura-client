import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CalendarDayCell } from '@/components/Dashboard/Calendar/CalendarDayCell'

vi.mock('@/utils/calendar.utils', () => ({
  getWorkloadBarColor: vi.fn(() => 'bg-green-500'),
}))

vi.mock('lucide-react', () => ({
  Zap: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="zap-icon" {...props} />,
  Circle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="circle-icon" {...props} />,
  Target: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="target-icon" {...props} />,
  CheckCircle2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="check-icon" {...props} />,
}))

const defaultProps = {
  date: new Date(2026, 6, 15),
  aggregate: undefined,
  goals: [],
  isToday: false,
  isCurrentMonth: true,
  workloadColor: 'bg-background',
  onClick: vi.fn(),
}

describe('CalendarDayCell', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the day number', () => {
    render(<CalendarDayCell {...defaultProps} />)
    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    render(<CalendarDayCell {...defaultProps} />)
    fireEvent.click(screen.getByText('15'))
    expect(defaultProps.onClick).toHaveBeenCalled()
  })

  it('applies ring style when isToday', () => {
    const { container } = render(<CalendarDayCell {...defaultProps} isToday={true} />)
    const cell = container.firstChild as HTMLElement
    expect(cell.className).toContain('ring-2')
  })

  it('applies opacity when not current month', () => {
    const { container } = render(<CalendarDayCell {...defaultProps} isCurrentMonth={false} />)
    const cell = container.firstChild as HTMLElement
    expect(cell.className).toContain('opacity-40')
  })

  it('renders task count when aggregate has tasks', () => {
    render(
      <CalendarDayCell
        {...defaultProps}
        aggregate={{
          totalTasks: 5,
          criticalTasks: 2,
          milestoneCount: 1,
          plannedHours: 8,
          actualHours: 4,
          focusMinutes: 120,
          workloadScore: 0.7,
          overCapacity: false,
          isReviewDay: false,
          hasPrimaryFocus: true,
          dueTasks: 1,
        }}
      />
    )
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders focus icon when hasPrimaryFocus', () => {
    render(
      <CalendarDayCell
        {...defaultProps}
        aggregate={{
          totalTasks: 1,
          criticalTasks: 0,
          milestoneCount: 0,
          plannedHours: 4,
          actualHours: 0,
          focusMinutes: 60,
          workloadScore: 0.3,
          overCapacity: false,
          isReviewDay: false,
          hasPrimaryFocus: true,
          dueTasks: 0,
        }}
      />
    )
    expect(screen.getByTestId('zap-icon')).toBeInTheDocument()
  })

  it('renders goals', () => {
    render(
      <CalendarDayCell
        {...defaultProps}
        goals={[{ id: 'g1', title: 'Ship feature', completed: false, type: 'milestone' }]}
      />
    )
    expect(screen.getByText('Ship feature')).toBeInTheDocument()
  })

  it('renders completed goal with check icon', () => {
    render(
      <CalendarDayCell
        {...defaultProps}
        goals={[{ id: 'g1', title: 'Done task', completed: true, type: 'task' }]}
      />
    )
    expect(screen.getByTestId('check-icon')).toBeInTheDocument()
  })

  it('renders "+N more" for multiple goals', () => {
    render(
      <CalendarDayCell
        {...defaultProps}
        goals={[
          { id: 'g1', title: 'Goal 1', completed: false, type: 'task' },
          { id: 'g2', title: 'Goal 2', completed: false, type: 'task' },
          { id: 'g3', title: 'Goal 3', completed: false, type: 'task' },
        ]}
      />
    )
    expect(screen.getByText('+2 more')).toBeInTheDocument()
  })

  it('renders Review label when isReviewDay', () => {
    render(
      <CalendarDayCell
        {...defaultProps}
        aggregate={{
          totalTasks: 1,
          criticalTasks: 0,
          milestoneCount: 0,
          plannedHours: 4,
          actualHours: 0,
          focusMinutes: 0,
          workloadScore: 0.3,
          overCapacity: false,
          isReviewDay: true,
          hasPrimaryFocus: false,
          dueTasks: 0,
        }}
      />
    )
    expect(screen.getByText('Review')).toBeInTheDocument()
  })
})
