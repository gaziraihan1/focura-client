import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CalendarInsightsBar } from '@/components/Dashboard/Calendar/CalendarInsightsBar'

vi.mock('@/utils/calendar.utils', () => ({
  getBurnoutColor: vi.fn(() => 'text-green-600'),
}))

vi.mock('lucide-react', () => ({
  TrendingUp: (props: any) => <svg data-testid="trending-icon" {...props} />,
  Flame: (props: any) => <svg data-testid="flame-icon" {...props} />,
  Zap: (props: any) => <svg data-testid="zap-icon" {...props} />,
  BarChart3: (props: any) => <svg data-testid="chart-icon" {...props} />,
  AlertTriangle: (props: any) => <svg data-testid="alert-icon" {...props} />,
}))

const mockInsights = {
  commitmentGap: -2,
  totalPlannedHours: 40,
  totalCapacityHours: 42,
  burnoutRisk: 'LOW' as const,
  overloadedDays: 0,
  focusDays: 3,
  timeAllocation: { deepWork: 30 },
}

describe('CalendarInsightsBar', () => {
  it('returns null when insights is null', () => {
    const { container } = render(<CalendarInsightsBar insights={null} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders insight cards', () => {
    render(<CalendarInsightsBar insights={mockInsights} />)
    expect(screen.getByText('Commitment Gap')).toBeInTheDocument()
    expect(screen.getByText('Burnout Risk')).toBeInTheDocument()
    expect(screen.getByText('Focus Days')).toBeInTheDocument()
    expect(screen.getByText('Deep Work')).toBeInTheDocument()
  })

  it('renders commitment gap value', () => {
    render(<CalendarInsightsBar insights={mockInsights} />)
    expect(screen.getByText('-2.0h')).toBeInTheDocument()
  })

  it('renders burnout risk value', () => {
    render(<CalendarInsightsBar insights={mockInsights} />)
    expect(screen.getByText('low')).toBeInTheDocument()
  })

  it('renders focus days count', () => {
    render(<CalendarInsightsBar insights={mockInsights} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows deep work percentage when timeAllocation exists', () => {
    render(<CalendarInsightsBar insights={mockInsights} />)
    expect(screen.getByText('30%')).toBeInTheDocument()
  })

  it('shows "Not Available" when no timeAllocation', () => {
    const insightsWithoutTime = { ...mockInsights, timeAllocation: undefined }
    render(<CalendarInsightsBar insights={insightsWithoutTime} />)
    expect(screen.getByText('Not Available')).toBeInTheDocument()
  })

  it('shows overcommitted alert when commitmentGap > 10', () => {
    const overcommitted = { ...mockInsights, commitmentGap: 15 }
    render(<CalendarInsightsBar insights={overcommitted} />)
    expect(screen.getByText(/Overcommitted by 15 hours/)).toBeInTheDocument()
  })

  it('shows burnout alert when risk is HIGH', () => {
    const highRisk = { ...mockInsights, burnoutRisk: 'HIGH' as const }
    render(<CalendarInsightsBar insights={highRisk} />)
    expect(screen.getByText(/High burnout risk/)).toBeInTheDocument()
  })

  it('shows critical burnout alert', () => {
    const criticalRisk = { ...mockInsights, burnoutRisk: 'CRITICAL' as const }
    render(<CalendarInsightsBar insights={criticalRisk} />)
    expect(screen.getByText(/Critical burnout risk/)).toBeInTheDocument()
  })

  it('shows no focus days alert', () => {
    const noFocus = { ...mockInsights, focusDays: 0 }
    render(<CalendarInsightsBar insights={noFocus} />)
    expect(screen.getByText(/No focus days scheduled/)).toBeInTheDocument()
  })

  it('does not show alerts when everything is fine', () => {
    render(<CalendarInsightsBar insights={mockInsights} />)
    expect(screen.queryByTestId('alert-icon')).not.toBeInTheDocument()
  })
})
