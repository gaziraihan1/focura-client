import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FocusDailySummary } from '@/components/Dashboard/FocusDailySummary'
import { useFocusSessionDailySummary } from '@/hooks/useFocusSession'

vi.mock('@/hooks/useFocusSession', () => ({
  useFocusSessionDailySummary: vi.fn(),
}))

vi.mock('@/lib/utils', () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(' '),
}))

const mockUseFocusSessionDailySummary = vi.mocked(useFocusSessionDailySummary)

describe('FocusDailySummary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a loading placeholder while fetching summary', () => {
    mockUseFocusSessionDailySummary.mockReturnValue({ isLoading: true, data: undefined } as any)
    render(<FocusDailySummary />)
    expect(document.querySelector('.animate-spin')).not.toBeNull()
  })

  it('shows nothing when summary is unavailable', () => {
    mockUseFocusSessionDailySummary.mockReturnValue({ isLoading: false, data: undefined } as any)
    const { container } = render(<FocusDailySummary />)
    expect(container.innerHTML).toBe('')
  })

  it('renders session count and focused time', () => {
    mockUseFocusSessionDailySummary.mockReturnValue({
      isLoading: false,
      data: {
        date: '2024-01-01',
        totalSessions: 3,
        totalMinutes: 140,
        byType: [
          { type: 'POMODORO', sessions: 2, minutes: 50 },
          { type: 'DEEP_WORK', sessions: 1, minutes: 90 },
        ],
      },
    } as any)
    render(<FocusDailySummary />)
    expect(screen.getByText('3 sessions today')).toBeInTheDocument()
    expect(screen.getByText('2h 20m of focused time')).toBeInTheDocument()
  })

  it('uses singular "session" for a single session', () => {
    mockUseFocusSessionDailySummary.mockReturnValue({
      isLoading: false,
      data: {
        date: '2024-01-01',
        totalSessions: 1,
        totalMinutes: 25,
        byType: [{ type: 'POMODORO', sessions: 1, minutes: 25 }],
      },
    } as any)
    render(<FocusDailySummary />)
    expect(screen.getByText('1 session today')).toBeInTheDocument()
  })

  it('shows minutes-only when under an hour', () => {
    mockUseFocusSessionDailySummary.mockReturnValue({
      isLoading: false,
      data: {
        date: '2024-01-01',
        totalSessions: 1,
        totalMinutes: 45,
        byType: [{ type: 'POMODORO', sessions: 1, minutes: 45 }],
      },
    } as any)
    render(<FocusDailySummary />)
    expect(screen.getByText('45m of focused time')).toBeInTheDocument()
  })

  it('renders per-type breakdown with labels', () => {
    mockUseFocusSessionDailySummary.mockReturnValue({
      isLoading: false,
      data: {
        date: '2024-01-01',
        totalSessions: 2,
        totalMinutes: 115,
        byType: [
          { type: 'POMODORO', sessions: 1, minutes: 25 },
          { type: 'DEEP_WORK', sessions: 1, minutes: 90 },
        ],
      },
    } as any)
    render(<FocusDailySummary />)
    expect(screen.getByText('Pomodoro')).toBeInTheDocument()
    expect(screen.getByText('Deep work')).toBeInTheDocument()
  })

  it('shows an empty-state message when no sessions today', () => {
    mockUseFocusSessionDailySummary.mockReturnValue({
      isLoading: false,
      data: {
        date: '2024-01-01',
        totalSessions: 0,
        totalMinutes: 0,
        byType: [],
      },
    } as any)
    render(<FocusDailySummary />)
    expect(screen.getByText(/No focus sessions yet today/)).toBeInTheDocument()
  })
})
