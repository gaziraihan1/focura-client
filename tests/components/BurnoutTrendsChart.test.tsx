import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BurnoutTrendsChart } from '@/components/Dashboard/Calendar/BurnoutTrendsChart'
import { createWrapper } from '../utils/renderWithProviders'
import { useBurnoutTrends } from '@/hooks/useBurnoutTrends'

vi.mock('@/hooks/useBurnoutTrends')

const mockUseBurnoutTrends = vi.mocked(useBurnoutTrends)

const defaultData = [
  { weekStart: '2026-05-01', avgDailyLoad: 0.5, riskLevel: 'LOW', consecutiveHeavyDays: 0 },
  { weekStart: '2026-05-08', avgDailyLoad: 0.8, riskLevel: 'MODERATE', consecutiveHeavyDays: 2 },
  { weekStart: '2026-05-15', avgDailyLoad: 1.2, riskLevel: 'HIGH', consecutiveHeavyDays: 3 },
]

describe('BurnoutTrendsChart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseBurnoutTrends.mockReturnValue({ data: defaultData, loading: false } as any)
  })

  it('returns null when loading', () => {
    mockUseBurnoutTrends.mockReturnValue({ data: [], loading: true } as any)
    const { container } = render(<BurnoutTrendsChart />, { wrapper: createWrapper() })
    expect(container.innerHTML).toBe('')
  })

  it('returns null when no data', () => {
    mockUseBurnoutTrends.mockReturnValue({ data: [], loading: false } as any)
    const { container } = render(<BurnoutTrendsChart />, { wrapper: createWrapper() })
    expect(container.innerHTML).toBe('')
  })

  it('renders the button with latest risk level', () => {
    render(<BurnoutTrendsChart />, { wrapper: createWrapper() })
    expect(screen.getByText('Burnout Trends')).toBeInTheDocument()
    expect(screen.getByText('HIGH')).toBeInTheDocument()
  })

  it('renders week count', () => {
    render(<BurnoutTrendsChart />, { wrapper: createWrapper() })
    expect(screen.getByText('3 weeks of data')).toBeInTheDocument()
  })

  it('expands on click', () => {
    render(<BurnoutTrendsChart />, { wrapper: createWrapper() })
    fireEvent.click(screen.getByText('Burnout Trends'))
    expect(screen.getByText('Low')).toBeInTheDocument()
    expect(screen.getByText('Moderate')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Critical')).toBeInTheDocument()
  })

  it('collapses on second click', () => {
    render(<BurnoutTrendsChart />, { wrapper: createWrapper() })
    fireEvent.click(screen.getByText('Burnout Trends'))
    expect(screen.getByText('Low')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Burnout Trends'))
    expect(screen.queryByText('Low')).not.toBeInTheDocument()
  })
})
