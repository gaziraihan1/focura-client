import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react';
import { RecentActivity } from '@/components/Dashboard/RecentActivity'

vi.mock('@/hooks/useWorkspace', () => ({
  useWorkspaces: vi.fn(),
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}))

import { useWorkspaces } from '@/hooks/useWorkspace'
import { useQuery } from '@tanstack/react-query'

describe('RecentActivity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders heading', () => {
    vi.mocked(useWorkspaces).mockReturnValue({ data: [], isLoading: false } as any as Record<string, unknown>)
    vi.mocked(useQuery).mockReturnValue({ data: [], isLoading: false } as any as Record<string, unknown>)

    render(<RecentActivity />)

    expect(screen.getByText('Recent activity')).toBeInTheDocument()
  })

  it('shows loading skeleton when loading', () => {
    vi.mocked(useWorkspaces).mockReturnValue({ data: [], isLoading: true } as any as Record<string, unknown>)
    vi.mocked(useQuery).mockReturnValue({ data: [], isLoading: false } as any as Record<string, unknown>)

    const { container } = render(<RecentActivity />)

    const pulseElements = container.querySelectorAll('.animate-pulse')
    expect(pulseElements.length).toBeGreaterThan(0)
  })

  it('shows empty state when no activities', () => {
    vi.mocked(useWorkspaces).mockReturnValue({ data: [{ id: 'ws-1' }], isLoading: false } as any as Record<string, unknown>)
    vi.mocked(useQuery).mockReturnValue({ data: [], isLoading: false } as any as Record<string, unknown>)

    render(<RecentActivity />)

    expect(screen.getByText('No recent activity yet.')).toBeInTheDocument()
    expect(screen.getByText(/Activity across all your workspaces/)).toBeInTheDocument()
  })

  it('renders activity items', () => {
    vi.mocked(useWorkspaces).mockReturnValue({ data: [{ id: 'ws-1' }], isLoading: false } as any as Record<string, unknown>)
    vi.mocked(useQuery).mockReturnValue({
      data: [
        {
          id: 'act-1',
          type: 'TASK_COMPLETED',
          description: 'Completed task "Fix login bug"',
          workspaceName: 'My Workspace',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'act-2',
          type: 'MEMBER_JOINED',
          description: 'New member joined',
          workspaceName: 'My Workspace',
          createdAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
    } as any as Record<string, unknown>)

    render(<RecentActivity />)

    expect(screen.getByText('Completed task "Fix login bug"')).toBeInTheDocument()
    expect(screen.getByText('New member joined')).toBeInTheDocument()
  })

  it('renders workspace name with activity', () => {
    vi.mocked(useWorkspaces).mockReturnValue({ data: [{ id: 'ws-1' }], isLoading: false } as any as Record<string, unknown>)
    vi.mocked(useQuery).mockReturnValue({
      data: [
        {
          id: 'act-1',
          type: 'TASK_COMPLETED',
          description: 'Task done',
          workspaceName: 'Acme Corp',
          createdAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
    } as any as Record<string, unknown>)

    render(<RecentActivity />)

    expect(screen.getByText(/Acme Corp/)).toBeInTheDocument()
  })

  it('renders correct icon for TASK_COMPLETED', () => {
    vi.mocked(useWorkspaces).mockReturnValue({ data: [{ id: 'ws-1' }], isLoading: false } as any as Record<string, unknown>)
    vi.mocked(useQuery).mockReturnValue({
      data: [
        {
          id: 'act-1',
          type: 'TASK_COMPLETED',
          description: 'Task done',
          workspaceName: 'WS',
          createdAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
    } as any as Record<string, unknown>)

    const { container } = render(<RecentActivity />)

    const iconBg = container.querySelector('.bg-blue-500\\/10')
    expect(iconBg).toBeInTheDocument()
  })

  it('renders correct icon for MEMBER_JOINED', () => {
    vi.mocked(useWorkspaces).mockReturnValue({ data: [{ id: 'ws-1' }], isLoading: false } as any as Record<string, unknown>)
    vi.mocked(useQuery).mockReturnValue({
      data: [
        {
          id: 'act-1',
          type: 'MEMBER_JOINED',
          description: 'Joined',
          workspaceName: 'WS',
          createdAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
    } as any as Record<string, unknown>)

    const { container } = render(<RecentActivity />)

    const iconBg = container.querySelector('.bg-green-500\\/10')
    expect(iconBg).toBeInTheDocument()
  })

  it('renders correct icon for PROJECT_CREATED', () => {
    vi.mocked(useWorkspaces).mockReturnValue({ data: [{ id: 'ws-1' }], isLoading: false } as any as Record<string, unknown>)
    vi.mocked(useQuery).mockReturnValue({
      data: [
        {
          id: 'act-1',
          type: 'PROJECT_CREATED',
          description: 'Created project',
          workspaceName: 'WS',
          createdAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
    } as any as Record<string, unknown>)

    const { container } = render(<RecentActivity />)

    const iconBg = container.querySelector('.bg-orange-500\\/10')
    expect(iconBg).toBeInTheDocument()
  })

  it('renders correct icon for MEETING_SCHEDULED', () => {
    vi.mocked(useWorkspaces).mockReturnValue({ data: [{ id: 'ws-1' }], isLoading: false } as any as Record<string, unknown>)
    vi.mocked(useQuery).mockReturnValue({
      data: [
        {
          id: 'act-1',
          type: 'MEETING_SCHEDULED',
          description: 'Meeting set',
          workspaceName: 'WS',
          createdAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
    } as any as Record<string, unknown>)

    const { container } = render(<RecentActivity />)

    const iconBg = container.querySelector('.bg-pink-500\\/10')
    expect(iconBg).toBeInTheDocument()
  })

  it('renders fallback icon for unknown type', () => {
    vi.mocked(useWorkspaces).mockReturnValue({ data: [{ id: 'ws-1' }], isLoading: false } as any as Record<string, unknown>)
    vi.mocked(useQuery).mockReturnValue({
      data: [
        {
          id: 'act-1',
          type: 'UNKNOWN_TYPE',
          description: 'Something happened',
          workspaceName: 'WS',
          createdAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
    } as any as Record<string, unknown>)

    const { container } = render(<RecentActivity />)

    const iconBg = container.querySelector('.bg-muted')
    expect(iconBg).toBeInTheDocument()
  })

  it('shows time ago text', () => {
    vi.mocked(useWorkspaces).mockReturnValue({ data: [{ id: 'ws-1' }], isLoading: false } as any as Record<string, unknown>)
    vi.mocked(useQuery).mockReturnValue({
      data: [
        {
          id: 'act-1',
          type: 'TASK_COMPLETED',
          description: 'Task done',
          workspaceName: 'WS',
          createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
        },
      ],
      isLoading: false,
    } as any as Record<string, unknown>)

    render(<RecentActivity />)

    expect(screen.getByText(/min ago/)).toBeInTheDocument()
  })

  it('shows "just now" for very recent items', () => {
    vi.mocked(useWorkspaces).mockReturnValue({ data: [{ id: 'ws-1' }], isLoading: false } as any as Record<string, unknown>)
    vi.mocked(useQuery).mockReturnValue({
      data: [
        {
          id: 'act-1',
          type: 'TASK_COMPLETED',
          description: 'Task done',
          workspaceName: 'WS',
          createdAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
    } as any as Record<string, unknown>)

    render(<RecentActivity />)

    const matches = screen.getAllByText((content, element) => {
      return element?.textContent?.includes('just now') ?? false
    })
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })
})
