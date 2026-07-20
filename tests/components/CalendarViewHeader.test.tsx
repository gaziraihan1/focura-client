import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CalendarHeader } from '@/components/Dashboard/CalendarView/CalendarHeader'

vi.mock('lucide-react', () => ({
  ChevronLeft: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="chevron-left" {...props} />,
  ChevronRight: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="chevron-right" {...props} />,
  Calendar: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  Clock: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
}))

const defaultProps = {
  currentDate: new Date(2026, 6, 15),
  view: 'month' as const,
  onViewChange: vi.fn(),
  onPrevious: vi.fn(),
  onNext: vi.fn(),
  onToday: vi.fn(),
  showOnlyTimeBound: false,
  onToggleTimeBound: vi.fn(),
}

describe('CalendarView CalendarHeader', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders Today button', () => {
    render(<CalendarHeader {...defaultProps} />)
    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  it('renders month view with date', () => {
    render(<CalendarHeader {...defaultProps} />)
    expect(screen.getByText('July 2026')).toBeInTheDocument()
  })

  it('renders week view', () => {
    render(<CalendarHeader {...defaultProps} view="week" />)
    expect(screen.getByText(/Week of/)).toBeInTheDocument()
  })

  it('renders day view', () => {
    render(<CalendarHeader {...defaultProps} view="day" />)
    expect(screen.getByText('July 15, 2026')).toBeInTheDocument()
  })

  it('renders view mode buttons', () => {
    render(<CalendarHeader {...defaultProps} />)
    expect(screen.getByText('month')).toBeInTheDocument()
    expect(screen.getByText('week')).toBeInTheDocument()
    expect(screen.getByText('day')).toBeInTheDocument()
  })

  it('calls onToday when Today is clicked', () => {
    render(<CalendarHeader {...defaultProps} />)
    fireEvent.click(screen.getByText('Today'))
    expect(defaultProps.onToday).toHaveBeenCalled()
  })

  it('calls onPrevious when left arrow is clicked', () => {
    render(<CalendarHeader {...defaultProps} />)
    fireEvent.click(screen.getByLabelText('Previous'))
    expect(defaultProps.onPrevious).toHaveBeenCalled()
  })

  it('calls onNext when right arrow is clicked', () => {
    render(<CalendarHeader {...defaultProps} />)
    fireEvent.click(screen.getByLabelText('Next'))
    expect(defaultProps.onNext).toHaveBeenCalled()
  })

  it('calls onViewChange when view button is clicked', () => {
    render(<CalendarHeader {...defaultProps} />)
    fireEvent.click(screen.getByText('week'))
    expect(defaultProps.onViewChange).toHaveBeenCalledWith('week')
  })

  it('calls onToggleTimeBound when time-bound button is clicked', () => {
    render(<CalendarHeader {...defaultProps} />)
    fireEvent.click(screen.getByText('Time-bound only'))
    expect(defaultProps.onToggleTimeBound).toHaveBeenCalledWith(true)
  })
})
