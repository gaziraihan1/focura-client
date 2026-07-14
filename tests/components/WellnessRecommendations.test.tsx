import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WellnessRecommendations } from '@/components/Dashboard/WellnessRecommendations'

const mockDismiss = vi.fn()

vi.mock('@/hooks/useBurnoutTrends', () => ({
  useRecommendations: vi.fn(),
}))

import { useRecommendations } from '@/hooks/useBurnoutTrends'

describe('WellnessRecommendations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when loading', () => {
    vi.mocked(useRecommendations).mockReturnValue({
      data: [],
      loading: true,
      dismiss: mockDismiss,
    })

    const { container } = render(<WellnessRecommendations />)

    expect(container.innerHTML).toBe('')
  })

  it('renders nothing when no recommendations', () => {
    vi.mocked(useRecommendations).mockReturnValue({
      data: [],
      loading: false,
      dismiss: mockDismiss,
    })

    const { container } = render(<WellnessRecommendations />)

    expect(container.innerHTML).toBe('')
  })

  it('renders the heading when recommendations exist', () => {
    vi.mocked(useRecommendations).mockReturnValue({
      data: [
        { id: '1', type: 'BURNOUT_PREVENTION', message: 'Take a break' },
      ],
      loading: false,
      dismiss: mockDismiss,
    })

    render(<WellnessRecommendations />)

    expect(screen.getByText('Wellness Insights')).toBeInTheDocument()
  })

  it('renders recommendation messages', () => {
    vi.mocked(useRecommendations).mockReturnValue({
      data: [
        { id: '1', type: 'WORKLOAD_ALERT', message: 'High workload detected' },
        { id: '2', type: 'FOCUS_SUGGESTION', message: 'Try time-blocking' },
      ],
      loading: false,
      dismiss: mockDismiss,
    })

    render(<WellnessRecommendations />)

    expect(screen.getByText('High workload detected')).toBeInTheDocument()
    expect(screen.getByText('Try time-blocking')).toBeInTheDocument()
  })

  it('shows suggestion count', () => {
    vi.mocked(useRecommendations).mockReturnValue({
      data: [
        { id: '1', type: 'CAPACITY_TIP', message: 'Tip 1' },
        { id: '2', type: 'CAPACITY_TIP', message: 'Tip 2' },
      ],
      loading: false,
      dismiss: mockDismiss,
    })

    render(<WellnessRecommendations />)

    expect(screen.getByText('2 suggestions')).toBeInTheDocument()
  })

  it('shows singular "suggestion" for 1 item', () => {
    vi.mocked(useRecommendations).mockReturnValue({
      data: [
        { id: '1', type: 'CAPACITY_TIP', message: 'Tip 1' },
      ],
      loading: false,
      dismiss: mockDismiss,
    })

    render(<WellnessRecommendations />)

    expect(screen.getByText('1 suggestion')).toBeInTheDocument()
  })

  it('limits display to 4 recommendations', () => {
    vi.mocked(useRecommendations).mockReturnValue({
      data: Array.from({ length: 6 }, (_, i) => ({
        id: `${i}`,
        type: 'CAPACITY_TIP',
        message: `Recommendation ${i}`,
      })),
      loading: false,
      dismiss: mockDismiss,
    })

    render(<WellnessRecommendations />)

    expect(screen.getByText('Recommendation 0')).toBeInTheDocument()
    expect(screen.getByText('Recommendation 3')).toBeInTheDocument()
    expect(screen.queryByText('Recommendation 4')).not.toBeInTheDocument()
  })

  it('calls dismiss with correct id', async () => {
    const user = userEvent.setup()
    vi.mocked(useRecommendations).mockReturnValue({
      data: [
        { id: 'rec-1', type: 'BREAK_REMINDER', message: 'Take a break' },
      ],
      loading: false,
      dismiss: mockDismiss,
    })

    render(<WellnessRecommendations />)

    const dismissBtn = screen.getByRole('button', { name: /dismiss/i })
    await user.click(dismissBtn)

    expect(mockDismiss).toHaveBeenCalledWith('rec-1')
  })

  it('renders correct icon for each type', () => {
    vi.mocked(useRecommendations).mockReturnValue({
      data: [
        { id: '1', type: 'WORKLOAD_ALERT', message: 'Alert' },
        { id: '2', type: 'ENERGY_INSIGHT', message: 'Insight' },
      ],
      loading: false,
      dismiss: mockDismiss,
    })

    const { container } = render(<WellnessRecommendations />)

    // 1 heading icon + 2 recommendation icons = 3
    const iconContainers = container.querySelectorAll('.flex.h-8.w-8')
    expect(iconContainers.length).toBe(3)
  })
})
