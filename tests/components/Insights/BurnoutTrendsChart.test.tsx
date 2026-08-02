import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BurnoutTrendsChart } from '@/components/Dashboard/Calendar/BurnoutTrendsChart'
import { createWrapper } from '../../utils/renderWithProviders'
import { useBurnoutTrends } from '@/hooks/useBurnoutTrends'

vi.mock('@/hooks/useBurnoutTrends')

const mockUseBurnoutTrends = vi.mocked(useBurnoutTrends)

const defaultData = [
  { weekStart: '2026-05-01', avgDailyLoad: 0.5, riskLevel: 'LOW', consecutiveHeavyDays: 0 },
  { weekStart: '2026-05-08', avgDailyLoad: 0.8, riskLevel: 'MODERATE', consecutiveHeavyDays: 2 },
  { weekStart: '2026-05-15', avgDailyLoad: 1.0, riskLevel: 'MODERATE', consecutiveHeavyDays: 1 },
]

const highRiskData = [
  { weekStart: '2026-05-01', avgDailyLoad: 0.5, riskLevel: 'LOW', consecutiveHeavyDays: 0 },
  { weekStart: '2026-05-08', avgDailyLoad: 0.8, riskLevel: 'MODERATE', consecutiveHeavyDays: 2 },
  { weekStart: '2026-05-15', avgDailyLoad: 1.2, riskLevel: 'HIGH', consecutiveHeavyDays: 3 },
]

describe('BurnoutTrendsChart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseBurnoutTrends.mockReturnValue({ data: defaultData, loading: false, error: null, refetch: vi.fn() } as any)
  })

  // ── Loading state ────────────────────────────────────────────────────────
  describe('loading state', () => {
    it('renders a loading placeholder instead of null', () => {
      mockUseBurnoutTrends.mockReturnValue({ data: [], loading: true, error: null, refetch: vi.fn() } as any)
      render(<BurnoutTrendsChart />, { wrapper: createWrapper() })
      // Should render loading skeleton with the title still visible
      expect(screen.getByText('Burnout Trends')).toBeInTheDocument()
    })
  })

  // ── Empty state ──────────────────────────────────────────────────────────
  describe('empty state', () => {
    it('renders an empty state message when no data', () => {
      mockUseBurnoutTrends.mockReturnValue({ data: [], loading: false, error: null, refetch: vi.fn() } as any)
      render(<BurnoutTrendsChart />, { wrapper: createWrapper() })
      expect(screen.getByText('Burnout Trends')).toBeInTheDocument()
      expect(screen.getByText(/Not enough data yet/i)).toBeInTheDocument()
    })
  })

  // ── Error state ──────────────────────────────────────────────────────────
  describe('error state', () => {
    it('renders error message with retry button', () => {
      mockUseBurnoutTrends.mockReturnValue({
        data: [],
        loading: false,
        error: 'Failed to load burnout trends',
        refetch: vi.fn(),
      } as any)
      render(<BurnoutTrendsChart />, { wrapper: createWrapper() })
      expect(screen.getByText('Burnout Trends')).toBeInTheDocument()
      expect(screen.getByText('Failed to load burnout trends')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })

    it('calls refetch when retry button is clicked', () => {
      const refetch = vi.fn()
      mockUseBurnoutTrends.mockReturnValue({
        data: [],
        loading: false,
        error: 'Something went wrong',
        refetch,
      } as any)
      render(<BurnoutTrendsChart />, { wrapper: createWrapper() })
      fireEvent.click(screen.getByRole('button', { name: /retry/i }))
      expect(refetch).toHaveBeenCalledTimes(1)
    })
  })

  // ── Data state ───────────────────────────────────────────────────────────
  describe('data state', () => {
    it('renders the button with latest risk level', () => {
      mockUseBurnoutTrends.mockReturnValue({ data: highRiskData, loading: false, error: null, refetch: vi.fn() } as any)
      render(<BurnoutTrendsChart />, { wrapper: createWrapper() })
      expect(screen.getByText('Burnout Trends')).toBeInTheDocument()
      const badges = screen.getAllByText('HIGH')
      expect(badges.length).toBeGreaterThanOrEqual(1)
    })

    it('renders week count', () => {
      render(<BurnoutTrendsChart />, { wrapper: createWrapper() })
      expect(screen.getByText('3 weeks of data')).toBeInTheDocument()
    })

    it('expands on click to show legend', () => {
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
})
