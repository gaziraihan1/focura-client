import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DayViewHeader } from '@/components/Dashboard/CalendarView/CalendarDayView/DayViewHeader'

describe('DayViewHeader', () => {
  it('renders day name', () => {
    render(<DayViewHeader currentDate={new Date(2026, 6, 15)} />)
    expect(screen.getByText('Wednesday')).toBeInTheDocument()
  })

  it('renders formatted date', () => {
    render(<DayViewHeader currentDate={new Date(2026, 6, 15)} />)
    expect(screen.getByText('July 15, 2026')).toBeInTheDocument()
  })

  it('shows Today badge when date is today', () => {
    render(<DayViewHeader currentDate={new Date()} />)
    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  it('does not show Today badge when date is not today', () => {
    render(<DayViewHeader currentDate={new Date(2026, 0, 1)} />)
    expect(screen.queryByText('Today')).not.toBeInTheDocument()
  })
})
