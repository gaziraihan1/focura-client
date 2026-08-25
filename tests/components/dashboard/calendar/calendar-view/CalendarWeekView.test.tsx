import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CalendarWeekView } from '@/components/dashboard/calendar/calendar-view/CalendarWeekView'

vi.mock('@/components/dashboard/calendar/calendar-view/CalendarDay', () => ({
  CalendarDay: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="calendar-day" />,
}))

describe('CalendarWeekView', () => {
  it('shows loading state', () => {
    render(
      <CalendarWeekView
        currentDate={new Date()}
        tasks={[]}
        onTaskClick={vi.fn()}
        isLoading={true}
      />
    )
    expect(screen.getByText('Loading week...')).toBeInTheDocument()
  })

  it('renders 7 day columns when not loading', () => {
    render(
      <CalendarWeekView
        currentDate={new Date()}
        tasks={[]}
        onTaskClick={vi.fn()}
        isLoading={false}
      />
    )
    const dayElements = document.querySelectorAll('[data-testid="calendar-day"]')
    expect(dayElements.length).toBe(7)
  })
})
