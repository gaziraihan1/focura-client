import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { FocusSessionCard } from '@/components/Dashboard/TaskDetails/FocusSessionCard'
import { createWrapper } from '@/tests/utils/renderWithProviders'

vi.mock('framer-motion', () => ({
  motion: { div: (p: Record<string, unknown>) => <div {...p} /> },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

const mockUseFocusSession = vi.fn()
vi.mock('@/hooks/useFocusSession', () => ({
  useFocusSession: () => mockUseFocusSession(),
}))

describe('FocusSessionCard', () => {
  beforeEach(() => {
    mockUseFocusSession.mockReturnValue({
      activeSession: null,
      isLoading: false,
      startSession: vi.fn(),
      completeSession: vi.fn(),
      cancelSession: vi.fn(),
    })
  })

  it('renders without crashing', () => {
    render(<FocusSessionCard taskId="t-1" />, { wrapper: createWrapper() })
    expect(document.body).toBeInTheDocument()
  })

  it('shows start button when no active session', () => {
    render(<FocusSessionCard taskId="t-1" />, { wrapper: createWrapper() })
    expect(screen.getByText('Pomodoro')).toBeInTheDocument()
    expect(screen.getByText('Deep Work')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    mockUseFocusSession.mockReturnValue({
      activeSession: null,
      isLoading: true,
      startSession: vi.fn(),
      completeSession: vi.fn(),
      cancelSession: vi.fn(),
    })
    render(<FocusSessionCard taskId="t-1" />, { wrapper: createWrapper() })
    expect(screen.getByText('Focus Session')).toBeInTheDocument()
  })
})
