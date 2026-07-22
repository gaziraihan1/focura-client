import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CalendarGrid } from '@/components/Dashboard/Calendar/CalendarGrid'

vi.mock('@/utils/calendar.utils', () => ({
  getWorkloadColor: vi.fn(() => 'bg-background'),
}))

const defaultDays = [
  new Date(2026, 6, 1),
  new Date(2026, 6, 2),
  new Date(2026, 6, 3),
]

const defaultProps = {
  calendarDays: defaultDays,
  getAggregateForDate: vi.fn(() => undefined),
  getGoalsForDate: vi.fn(() => []),
  isToday: vi.fn(() => false),
  isCurrentMonth: vi.fn(() => true),
  onDateClick: vi.fn(),
}

describe('CalendarGrid', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders day headers', () => {
    render(<CalendarGrid {...defaultProps} />)
    expect(screen.getByText('Sun')).toBeInTheDocument()
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Tue')).toBeInTheDocument()
    expect(screen.getByText('Wed')).toBeInTheDocument()
    expect(screen.getByText('Thu')).toBeInTheDocument()
    expect(screen.getByText('Fri')).toBeInTheDocument()
    expect(screen.getByText('Sat')).toBeInTheDocument()
  })

  it('renders day cells', () => {
    render(<CalendarGrid {...defaultProps} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('calls onDateClick when day cell is clicked', () => {
    render(<CalendarGrid {...defaultProps} />)
    fireEvent.click(screen.getByText('1'))
    expect(defaultProps.onDateClick).toHaveBeenCalledWith(defaultDays[0])
  })

  it('renders with empty days array', () => {
    render(<CalendarGrid {...defaultProps} calendarDays={[]} />)
    const dayHeaders = screen.getAllByText(/Sun|Mon|Tue|Wed|Thu|Fri|Sat/)
    expect(dayHeaders.length).toBe(7)
  })
})
