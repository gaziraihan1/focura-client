import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createWrapper } from '../../utils/renderWithProviders'

const mockDismiss = vi.fn()
const mockUseRecommendations = vi.fn()

vi.mock('@/hooks/useBurnoutTrends', () => ({
  useRecommendations: () => mockUseRecommendations(),
}))

import { WellnessRecommendations } from '@/components/Dashboard/WellnessRecommendations'

describe('WellnessRecommendations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when loading', () => {
    mockUseRecommendations.mockReturnValue({ data: [], loading: true, dismiss: mockDismiss })
    const { container } = render(<WellnessRecommendations />, { wrapper: createWrapper() })
    expect(container.innerHTML).toBe('')
  })

  it('returns null when no recommendations', () => {
    mockUseRecommendations.mockReturnValue({ data: [], loading: false, dismiss: mockDismiss })
    const { container } = render(<WellnessRecommendations />, { wrapper: createWrapper() })
    expect(container.innerHTML).toBe('')
  })

  it('shows recommendations', () => {
    mockUseRecommendations.mockReturnValue({
      data: [
        { id: '1', type: 'WORKLOAD_ALERT', message: 'You have too many tasks' },
        { id: '2', type: 'BREAK_REMINDER', message: 'Take a break' },
      ],
      loading: false,
      dismiss: mockDismiss,
    })
    render(<WellnessRecommendations />, { wrapper: createWrapper() })
    expect(screen.getByText('Wellness Insights')).toBeInTheDocument()
    expect(screen.getByText('You have too many tasks')).toBeInTheDocument()
    expect(screen.getByText('Take a break')).toBeInTheDocument()
  })

  it('shows suggestion count', () => {
    mockUseRecommendations.mockReturnValue({
      data: [
        { id: '1', type: 'WORKLOAD_ALERT', message: 'Alert 1' },
        { id: '2', type: 'BREAK_REMINDER', message: 'Alert 2' },
      ],
      loading: false,
      dismiss: mockDismiss,
    })
    render(<WellnessRecommendations />, { wrapper: createWrapper() })
    expect(screen.getByText('2 suggestions')).toBeInTheDocument()
  })

  it('shows singular suggestion', () => {
    mockUseRecommendations.mockReturnValue({
      data: [{ id: '1', type: 'WORKLOAD_ALERT', message: 'Alert' }],
      loading: false,
      dismiss: mockDismiss,
    })
    render(<WellnessRecommendations />, { wrapper: createWrapper() })
    expect(screen.getByText('1 suggestion')).toBeInTheDocument()
  })

  it('dismiss button calls dismiss', async () => {
    mockUseRecommendations.mockReturnValue({
      data: [{ id: 'r1', type: 'WORKLOAD_ALERT', message: 'Alert' }],
      loading: false,
      dismiss: mockDismiss,
    })
    const user = userEvent.setup()
    render(<WellnessRecommendations />, { wrapper: createWrapper() })
    
    await user.click(screen.getByLabelText('Dismiss'))
    expect(mockDismiss).toHaveBeenCalledWith('r1')
  })
})
