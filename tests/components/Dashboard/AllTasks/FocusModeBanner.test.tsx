import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { FocusModeBanner } from '@/components/Dashboard/AllTasks/FocusModeBanner'

vi.mock('framer-motion', () => ({
  motion: { div: (p: Record<string, unknown>) => <div {...p} /> },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}))
vi.mock('next/image', () => ({ default: (p: Record<string, unknown>) => <img {...p} /> }))
vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name }: { name: string }) => <div data-testid="avatar">{name}</div>,
}))

const mockTask = {
  id: 't-1',
  title: 'Focus Task',
  description: 'Important task description',
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  project: { id: 'p-1', name: 'Project Alpha', color: '#3b82f6', slug: 'project-alpha' },
  assignees: [{ user: { id: 'u-1', name: 'John Doe', image: null } }],
  estimatedHours: 5,
}

describe('FocusModeBanner', () => {
  const defaultProps = {
    task: mockTask as any,
    timeRemaining: 600,
    onEndFocus: vi.fn(),
    sessionDuration: 25,
    workspaceSlug: 'test-ws',
  }

  it('renders FOCUS MODE ACTIVE badge', () => {
    render(<FocusModeBanner {...defaultProps} />)
    expect(screen.getByText('FOCUS MODE ACTIVE')).toBeInTheDocument()
  })

  it('displays formatted time (10:00 for 600 seconds)', () => {
    render(<FocusModeBanner {...defaultProps} timeRemaining={600} />)
    expect(screen.getByText('10:00')).toBeInTheDocument()
  })

  it('shows task title', () => {
    render(<FocusModeBanner {...defaultProps} />)
    expect(screen.getByText('Focus Task')).toBeInTheDocument()
  })

  it('shows description when provided', () => {
    render(<FocusModeBanner {...defaultProps} />)
    expect(screen.getByText('Important task description')).toBeInTheDocument()
  })

  it('calls onEndFocus when close button clicked', async () => {
    const user = userEvent.setup()
    const onEndFocus = vi.fn()
    render(<FocusModeBanner {...defaultProps} onEndFocus={onEndFocus} />)
    await user.click(screen.getByTitle('End focus session'))
    expect(onEndFocus).toHaveBeenCalledTimes(1)
  })
})
