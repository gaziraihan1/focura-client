import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

vi.mock('@/hooks/useActivity', () => ({
  useWorkspaceActivities: vi.fn(),
}))

vi.mock('@/components/Dashboard/TaskDetails/TaskActivityList', () => ({
  TaskActivityList: ({ activities }: any) => (
    <div data-testid="task-activity-list" data-count={activities.length}>
      {activities.map((a: any) => <div key={a.id}>{a.id}</div>)}
    </div>
  ),
}))

import { WorkspaceOverviewTab } from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceOverviewTab'
import { useWorkspaceActivities } from '@/hooks/useActivity'

describe('WorkspaceOverviewTab', () => {
  const defaultProps = {
    workspaceId: 'ws-1',
    owner: { name: 'John Doe', email: 'john@test.com' },
    createdAt: '2024-01-15T00:00:00Z',
    isPublic: true,
    maxStorage: 1024,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
  })

  it('renders the Recent Activity heading', () => {
    render(<WorkspaceOverviewTab {...defaultProps} />)
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
  })

  it('shows loading spinner when activities are loading', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: true })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('renders TaskActivityList when activities loaded', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    expect(screen.getByTestId('task-activity-list')).toBeInTheDocument()
  })

  it('shows "see more" button', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    expect(screen.getByText('see more')).toBeInTheDocument()
  })

  it('disables "see more" when no more activities', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    const seeMore = screen.getByText('see more').closest('button')!
    expect(seeMore).toBeDisabled()
  })

  it('enables "see more" when has more activities', () => {
    const activities = Array.from({ length: 5 }, (_, i) => ({ id: `a${i}` }))
    ;(useWorkspaceActivities as any).mockReturnValue({ data: activities, isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    const seeMore = screen.getByText('see more').closest('button')!
    expect(seeMore).not.toBeDisabled()
  })

  it('clicking "see more" increases the limit', () => {
    const activities = Array.from({ length: 10 }, (_, i) => ({ id: `a${i}` }))
    ;(useWorkspaceActivities as any).mockReturnValue({ data: activities, isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    fireEvent.click(screen.getByText('see more'))
    // After clicking, limit increases by 9 (from 3 to 12), component passes limit+1=13
    expect(useWorkspaceActivities).toHaveBeenCalledWith('ws-1', { limit: 13 })
  })

  it('shows "see less" button when limit > 9', () => {
    const activities = Array.from({ length: 15 }, (_, i) => ({ id: `a${i}` }))
    ;(useWorkspaceActivities as any).mockReturnValue({ data: activities, isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    // Click see more to increase limit beyond 9
    fireEvent.click(screen.getByText('see more'))
    expect(screen.getByText('see less')).toBeInTheDocument()
  })

  it('clicking "see less" decreases the limit', () => {
    const activities = Array.from({ length: 15 }, (_, i) => ({ id: `a${i}` }))
    ;(useWorkspaceActivities as any).mockReturnValue({ data: activities, isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    fireEvent.click(screen.getByText('see more'))
    fireEvent.click(screen.getByText('see less'))
    // After see less, limit goes from 12 back to 3, component passes limit+1=4
    const calls = (useWorkspaceActivities as any).mock.calls
    const lastCall = calls[calls.length - 1]
    expect(lastCall).toEqual(['ws-1', { limit: 4 }])
  })

  it('renders WorkspaceInformation component', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    expect(screen.getByText('Information')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders WorkspaceStorageInfo component', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    expect(screen.getByText('Storage')).toBeInTheDocument()
    expect(screen.getByText('0 MB / 1024 MB')).toBeInTheDocument()
  })

  it('passes correct props to useWorkspaceActivities', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    expect(useWorkspaceActivities).toHaveBeenCalledWith('ws-1', { limit: 4 }) // 3 + 1
  })

  it('renders activities list with visible count', () => {
    const activities = [
      { id: 'a1' },
      { id: 'a2' },
      { id: 'a3' },
    ]
    ;(useWorkspaceActivities as any).mockReturnValue({ data: activities, isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    const list = screen.getByTestId('task-activity-list')
    expect(list.getAttribute('data-count')).toBe('3')
  })

  it('slices activities to limit', () => {
    const activities = [
      { id: 'a1' },
      { id: 'a2' },
      { id: 'a3' },
      { id: 'a4' },
      { id: 'a5' },
    ]
    ;(useWorkspaceActivities as any).mockReturnValue({ data: activities, isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    const list = screen.getByTestId('task-activity-list')
    expect(list.getAttribute('data-count')).toBe('3') // sliced to limit=3
  })

  it('handles owner with null name', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} owner={{ name: null, email: 'john@test.com' }} />)
    expect(screen.getByText('john@test.com')).toBeInTheDocument()
  })

  it('hides "see less" button when limit is <= 9', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    expect(screen.queryByText('see less')).not.toBeInTheDocument()
  })
})
