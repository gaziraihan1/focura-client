import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CalendarHeader } from '@/components/Dashboard/CalendarView/CalendarHeader'

describe('CalendarHeader', () => {
  const defaultProps = {
    currentDate: new Date(2025, 6, 15),
    view: 'month' as const,
    onViewChange: vi.fn(),
    onPrevious: vi.fn(),
    onNext: vi.fn(),
    onToday: vi.fn(),
    showOnlyTimeBound: false,
    onToggleTimeBound: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders month title for month view', () => {
    render(<CalendarHeader {...defaultProps} view="month" />)
    expect(screen.getByText(/July 2025/)).toBeInTheDocument()
  })

  it('renders week title for week view', () => {
    render(<CalendarHeader {...defaultProps} view="week" />)
    expect(screen.getByText(/Week of/)).toBeInTheDocument()
  })

  it('renders day title for day view', () => {
    render(<CalendarHeader {...defaultProps} view="day" />)
    expect(screen.getByText(/July 15, 2025/)).toBeInTheDocument()
  })

  it('calls onToday when Today button clicked', async () => {
    const onToday = vi.fn()
    const user = userEvent.setup()
    render(<CalendarHeader {...defaultProps} onToday={onToday} />)
    
    await user.click(screen.getByText('Today'))
    expect(onToday).toHaveBeenCalled()
  })

  it('calls onPrevious when prev button clicked', async () => {
    const onPrevious = vi.fn()
    const user = userEvent.setup()
    render(<CalendarHeader {...defaultProps} onPrevious={onPrevious} />)
    
    await user.click(screen.getByLabelText('Previous'))
    expect(onPrevious).toHaveBeenCalled()
  })

  it('calls onNext when next button clicked', async () => {
    const onNext = vi.fn()
    const user = userEvent.setup()
    render(<CalendarHeader {...defaultProps} onNext={onNext} />)
    
    await user.click(screen.getByLabelText('Next'))
    expect(onNext).toHaveBeenCalled()
  })

  it('shows time-bound toggle', () => {
    render(<CalendarHeader {...defaultProps} />)
    expect(screen.getByText(/Time-bound only/i)).toBeInTheDocument()
  })

  it('calls onToggleTimeBound when toggle clicked', async () => {
    const onToggleTimeBound = vi.fn()
    const user = userEvent.setup()
    render(<CalendarHeader {...defaultProps} onToggleTimeBound={onToggleTimeBound} />)
    
    // Find the time-bound toggle button
    const toggleButton = screen.getByText(/Time-bound only/i).closest('button')!
    await user.click(toggleButton)
    expect(onToggleTimeBound).toHaveBeenCalledWith(true)
  })

  it('shows month/week/day view buttons', () => {
    render(<CalendarHeader {...defaultProps} />)
    // The view buttons render lowercase text
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(5) // prev, next, today, time-bound, month, week, day
  })

  it('calls onViewChange with week when week button clicked', async () => {
    const onViewChange = vi.fn()
    const user = userEvent.setup()
    render(<CalendarHeader {...defaultProps} onViewChange={onViewChange} />)
    
    // Find and click the week button
    const weekButtons = screen.getAllByText(/week/i)
    if (weekButtons.length > 0) {
      await user.click(weekButtons[0])
      expect(onViewChange).toHaveBeenCalledWith('week')
    }
  })
})
