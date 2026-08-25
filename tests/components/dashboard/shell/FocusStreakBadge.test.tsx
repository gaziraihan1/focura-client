import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FocusStreakBadge } from '@/components/dashboard/shell/FocusStreakBadge'
import { useFocusSessionStats } from '@/hooks/useFocusSession'

vi.mock('@/hooks/useFocusSession', () => ({
  useFocusSessionStats: vi.fn(),
}))

const mockUseFocusSessionStats = vi.mocked(useFocusSessionStats)

describe('FocusStreakBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a loading placeholder while fetching stats', () => {
    mockUseFocusSessionStats.mockReturnValue({ isLoading: true, data: undefined } as any)
    render(<FocusStreakBadge />)
    expect(document.querySelector('.animate-spin')).not.toBeNull()
  })

  it('shows nothing when stats are unavailable', () => {
    mockUseFocusSessionStats.mockReturnValue({ isLoading: false, data: undefined } as any)
    const { container } = render(<FocusStreakBadge />)
    expect(container.innerHTML).not.toContain('streak')
  })

  it('shows green "On fire" tier for streaks of 7+ days', () => {
    mockUseFocusSessionStats.mockReturnValue({
      isLoading: false,
      data: { focusStreak: 9, totalSessions: 20, totalMinutes: 500, completedToday: 2, averageSessionLength: 25 },
    } as any)
    render(<FocusStreakBadge />)
    expect(screen.getByText('9 days streak')).toBeInTheDocument()
    expect(screen.getByText('On fire')).toBeInTheDocument()
  })

  it('shows yellow "Building" tier for streaks of 3-6 days', () => {
    mockUseFocusSessionStats.mockReturnValue({
      isLoading: false,
      data: { focusStreak: 4, totalSessions: 10, totalMinutes: 250, completedToday: 1, averageSessionLength: 25 },
    } as any)
    render(<FocusStreakBadge />)
    expect(screen.getByText('4 days streak')).toBeInTheDocument()
    expect(screen.getByText('Building')).toBeInTheDocument()
  })

  it('shows red "Getting started" tier for streaks under 3 days', () => {
    mockUseFocusSessionStats.mockReturnValue({
      isLoading: false,
      data: { focusStreak: 1, totalSessions: 2, totalMinutes: 50, completedToday: 0, averageSessionLength: 25 },
    } as any)
    render(<FocusStreakBadge />)
    expect(screen.getByText('1 day streak')).toBeInTheDocument()
    expect(screen.getByText('Getting started')).toBeInTheDocument()
  })

  it('uses singular "day" for a 1-day streak', () => {
    mockUseFocusSessionStats.mockReturnValue({
      isLoading: false,
      data: { focusStreak: 1, totalSessions: 1, totalMinutes: 25, completedToday: 1, averageSessionLength: 25 },
    } as any)
    render(<FocusStreakBadge />)
    expect(screen.getByText('1 day streak')).toBeInTheDocument()
  })

  it('renders a progress bar with width based on streak', () => {
    mockUseFocusSessionStats.mockReturnValue({
      isLoading: false,
      data: { focusStreak: 7, totalSessions: 20, totalMinutes: 500, completedToday: 2, averageSessionLength: 25 },
    } as any)
    const { container } = render(<FocusStreakBadge />)
    const bar = container.querySelector('.h-full.rounded-full')
    expect(bar).not.toBeNull()
    expect((bar as HTMLElement).style.width).toBe('50%')
  })
})
