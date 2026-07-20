import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CalendarContent } from '@/components/Dashboard/CalendarView/CalendarContent'

vi.mock('@/components/Dashboard/CalendarView/CalendarGrid', () => ({
  CalendarGrid: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="calendar-grid" />,
}))

vi.mock('@/components/Dashboard/CalendarView/ResponsiveSidebar', () => ({
  ResponsiveSidebar: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="responsive-sidebar" />,
}))

describe('CalendarContent', () => {
  it('renders CalendarGrid and ResponsiveSidebar', () => {
    render(
      <CalendarContent
        currentDate={new Date()}
        view="month"
        tasks={[]}
        dateRange={{ start: new Date(), end: new Date() }}
        isLoading={false}
        onTaskClick={vi.fn()}
      />
    )
    expect(document.querySelector('[data-testid="calendar-grid"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="responsive-sidebar"]')).toBeInTheDocument()
  })
})
