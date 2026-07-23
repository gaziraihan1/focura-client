import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CalendarHeader } from '@/components/Dashboard/Calendar/CalendarHeader'

const defaultProps = {
  currentDate: new Date(2026, 6, 1),
  view: 'month' as const,
  onPrevious: vi.fn(),
  onNext: vi.fn(),
  onToday: vi.fn(),
  onViewChange: vi.fn(),
}

describe('CalendarHeader', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the title', () => {
    render(<CalendarHeader {...defaultProps} />)
    expect(screen.getByText('Time Intelligence')).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    render(<CalendarHeader {...defaultProps} />)
    expect(screen.getByText(/Strategic overview/)).toBeInTheDocument()
  })

  it('renders current month and year', () => {
    render(<CalendarHeader {...defaultProps} />)
    expect(screen.getByText('July 2026')).toBeInTheDocument()
  })

  it('renders Today button', () => {
    render(<CalendarHeader {...defaultProps} />)
    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  it('calls onToday when Today is clicked', () => {
    render(<CalendarHeader {...defaultProps} />)
    fireEvent.click(screen.getByText('Today'))
    expect(defaultProps.onToday).toHaveBeenCalled()
  })

  it('calls onPreviousMonth when left arrow is clicked', () => {
    render(<CalendarHeader {...defaultProps} />)
    fireEvent.click(screen.getByLabelText('Previous period'))
    expect(defaultProps.onPrevious).toHaveBeenCalled()
  })

  it('calls onNextMonth when right arrow is clicked', () => {
    render(<CalendarHeader {...defaultProps} />)
    fireEvent.click(screen.getByLabelText('Next period'))
    expect(defaultProps.onNext).toHaveBeenCalled()
  })

  it('renders different month correctly', () => {
    render(<CalendarHeader {...defaultProps} currentDate={new Date(2026, 0, 15)} />)
    expect(screen.getByText('January 2026')).toBeInTheDocument()
  })
})
