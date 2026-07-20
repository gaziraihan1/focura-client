import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ActivityFeed } from '@/components/Dashboard/ActivityLogs/ActivityFeed'
import { createWrapper } from '@/tests/utils/renderWithProviders'

vi.mock('next/image', () => ({ default: (p: any) => <img {...p} /> }))
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}))
vi.mock('date-fns', () => ({
  formatDistanceToNow: () => '2 hours ago',
}))

const mockUseActivities = vi.fn()
vi.mock('@/hooks/useActivity', () => ({
  useActivities: (...args: any[]) => mockUseActivities(...args),
}))

const mockActivity = {
  id: 'act-1',
  action: 'CREATED',
  entityType: 'TASK',
  entityId: 'task-1',
  userId: 'user-1',
  workspaceId: 'ws-1',
  createdAt: new Date().toISOString(),
  user: { id: 'user-1', name: 'John Doe', email: 'john@test.com', image: null },
  workspace: { id: 'ws-1', name: 'Test Workspace' },
  task: { id: 'task-1', title: 'Test Task', project: { id: 'p-1', name: 'Project A', color: '#3b82f6' } },
  metadata: null,
}

describe('ActivityFeed', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state', () => {
    mockUseActivities.mockReturnValue({ data: null, isLoading: true, error: null })
    render(<ActivityFeed />, { wrapper: createWrapper() })
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('shows error state', () => {
    mockUseActivities.mockReturnValue({ data: null, isLoading: false, error: new Error('fail') })
    render(<ActivityFeed />, { wrapper: createWrapper() })
    expect(screen.getByText(/Failed to load activities/)).toBeInTheDocument()
  })

  it('shows empty state', () => {
    mockUseActivities.mockReturnValue({ data: [], isLoading: false, error: null })
    render(<ActivityFeed />, { wrapper: createWrapper() })
    expect(screen.getByText('No activities yet')).toBeInTheDocument()
  })

  it('renders activity items when data available', () => {
    mockUseActivities.mockReturnValue({ data: [mockActivity], isLoading: false, error: null })
    render(<ActivityFeed />, { wrapper: createWrapper() })
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
    expect(screen.getByText('1 activity')).toBeInTheDocument()
  })
})
