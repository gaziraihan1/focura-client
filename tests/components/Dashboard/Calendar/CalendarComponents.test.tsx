import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CalendarLegend } from '@/components/Dashboard/Calendar/CalendarLegend'
import { InsightCard } from '@/components/Dashboard/Calendar/InsightCard'
import { LoadingState } from '@/components/Dashboard/Calendar/LoadingStateCalendar'
import { CalendarInsightsBar } from '@/components/Dashboard/Calendar/CalendarInsightsBar'

import { Zap } from 'lucide-react'

describe('CalendarLegend', () => {
  it('renders legend items', () => {
    render(<CalendarLegend />)
    expect(screen.getByText('Normal')).toBeInTheDocument()
    expect(screen.getByText('Moderate')).toBeInTheDocument()
    expect(screen.getByText('High Load')).toBeInTheDocument()
    expect(screen.getByText('Overloaded')).toBeInTheDocument()
  })

  it('shows Focus Day and Milestone', () => {
    render(<CalendarLegend />)
    expect(screen.getByText('Focus Day')).toBeInTheDocument()
    expect(screen.getByText('Milestone')).toBeInTheDocument()
  })
})

describe('InsightCard', () => {
  it('renders label and value', () => {
    render(
      <InsightCard
        icon={Zap}
        iconColor="text-purple-500"
        iconBgColor="bg-purple-100"
        label="Peak Hours"
        value="2-4 PM"
      />
    )
    expect(screen.getByText('Peak Hours')).toBeInTheDocument()
    expect(screen.getByText('2-4 PM')).toBeInTheDocument()
  })

  it('renders with subtitle', () => {
    render(
      <InsightCard
        icon={Zap}
        iconColor="text-purple-500"
        iconBgColor="bg-purple-100"
        label="Peak Hours"
        value="2-4 PM"
        subtitle="Busiest time of day"
      />
    )
    expect(screen.getByText('Busiest time of day')).toBeInTheDocument()
  })
})

describe('LoadingState (Calendar)', () => {
  it('renders loading message', () => {
    render(<LoadingState />)
    expect(screen.getByText('Loading calendar...')).toBeInTheDocument()
  })

  it('renders spinner', () => {
    render(<LoadingState />)
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })
})

describe('CalendarInsightsBar', () => {
  it('renders without crashing', () => {
    render(<CalendarInsightsBar />)
    expect(document.body).toBeInTheDocument()
  })
})
