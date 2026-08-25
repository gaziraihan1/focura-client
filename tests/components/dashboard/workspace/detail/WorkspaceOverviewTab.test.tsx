import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('@/hooks/useActivity', () => ({
  useWorkspaceActivities: vi.fn(),
}))

vi.mock('@/hooks/useStorage', () => ({
  useWorkspaceStorageInfo: vi.fn(() => ({
    data: { usedMB: 0, totalMB: 1024, percentage: 0 },
    isLoading: false,
  })),
}))

vi.mock('@/components/dashboard/task-details/TaskActivityList', () => ({
  TaskActivityList: ({ activities }: { activities: any[] }) => (
    <div data-testid="task-activity-list" data-count={activities.length}>
      {activities.map((a: Record<string, unknown>) => <div key={a.id}>{a.id}</div>)}
    </div>
  ),
}))

import { WorkspaceOverviewTab } from '@/components/dashboard/workspace/detail/WorkspaceOverviewTab'
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
    const activities = [{ id: 'a1' }, { id: 'a2' }]
    ;(useWorkspaceActivities as any).mockReturnValue({ data: activities, isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    expect(screen.getByTestId('task-activity-list')).toBeInTheDocument()
  })

  it('shows "View more" button when has more activities', () => {
    const activities = Array.from({ length: 6 }, (_, i) => ({ id: `a${i}` }))
    ;(useWorkspaceActivities as any).mockReturnValue({ data: activities, isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    expect(screen.getByText('View more')).toBeInTheDocument()
  })

  it('hides "View more" when no more activities', () => {
    const activities = Array.from({ length: 3 }, (_, i) => ({ id: `a${i}` }))
    ;(useWorkspaceActivities as any).mockReturnValue({ data: activities, isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    expect(screen.queryByText('View more')).not.toBeInTheDocument()
  })

  it('clicking "View more" increases the limit', () => {
    const activities = Array.from({ length: 10 }, (_, i) => ({ id: `a${i}` }))
    ;(useWorkspaceActivities as any).mockReturnValue({ data: activities, isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    fireEvent.click(screen.getByText('View more'))
    // After clicking, limit increases by 5 (from 5 to 10), component passes limit+1=11
    expect(useWorkspaceActivities).toHaveBeenCalledWith('ws-1', { limit: 11 })
  })

  it('shows "Show less" button when limit > 5', () => {
    const activities = Array.from({ length: 15 }, (_, i) => ({ id: `a${i}` }))
    ;(useWorkspaceActivities as any).mockReturnValue({ data: activities, isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    fireEvent.click(screen.getByText('View more'))
    expect(screen.getByText('Show less')).toBeInTheDocument()
  })

  it('clicking "Show less" decreases the limit', () => {
    const activities = Array.from({ length: 15 }, (_, i) => ({ id: `a${i}` }))
    ;(useWorkspaceActivities as any).mockReturnValue({ data: activities, isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    fireEvent.click(screen.getByText('View more'))
    fireEvent.click(screen.getByText('Show less'))
    // After Show less, limit goes from 10 back to 5, component passes limit+1=6
    const calls = (useWorkspaceActivities as any).mock.calls
    const lastCall = calls[calls.length - 1]
    expect(lastCall).toEqual(['ws-1', { limit: 6 }])
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
  })

  it('passes correct props to useWorkspaceActivities', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    expect(useWorkspaceActivities).toHaveBeenCalledWith('ws-1', { limit: 6 }) // 5 + 1
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
    expect(list.getAttribute('data-count')).toBe('5') // sliced to limit=5
  })

  it('handles owner with null name', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} owner={{ name: null, email: 'john@test.com' }} />)
    expect(screen.getByText('john@test.com')).toBeInTheDocument()
  })

  it('hides "Show less" button when limit is <= 5', () => {
    ;(useWorkspaceActivities as any).mockReturnValue({ data: [], isLoading: false })
    render(<WorkspaceOverviewTab {...defaultProps} />)
    expect(screen.queryByText('Show less')).not.toBeInTheDocument()
  })
})
