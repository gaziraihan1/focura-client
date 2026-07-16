import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CalendarLegend } from '@/components/Dashboard/Calendar/CalendarLegend'

describe('CalendarLegend', () => {
  it('renders all legend items', () => {
    render(<CalendarLegend />)
    expect(screen.getByText('Normal')).toBeInTheDocument()
    expect(screen.getByText('Moderate')).toBeInTheDocument()
    expect(screen.getByText('High Load')).toBeInTheDocument()
    expect(screen.getByText('Overloaded')).toBeInTheDocument()
    expect(screen.getByText('Focus Day')).toBeInTheDocument()
    expect(screen.getByText('Milestone')).toBeInTheDocument()
  })

  it('renders 6 legend items', () => {
    render(<CalendarLegend />)
    const items = screen.getAllByText(/Normal|Moderate|High Load|Overloaded|Focus Day|Milestone/)
    expect(items).toHaveLength(6)
  })
})
