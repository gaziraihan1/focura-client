import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EngagementSection } from '@/components/Dashboard/Analytics/WorkspaceUsage/EngagementSection'
import type { UserEngagementMetrics } from '@/types/workspace-usage.types'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...props} />,
}))

const mockUserEngagement: UserEngagementMetrics = {
  activeUsers: { online: 3, thisWeek: 12, thisMonth: 25 },
  inactiveUsers: [
    { id: '1', name: 'Inactive User', email: 'inactive@test.com', image: null, lastActive: null, daysSinceActive: 30 },
  ],
  collaborationIndex: [
    { userId: 'u1', userName: 'Alice', userEmail: 'alice@test.com', userImage: null, commentsCount: 15, tasksCreated: 10, tasksAssigned: 8, collaborationScore: 92 },
    { userId: 'u2', userName: 'Bob', userEmail: 'bob@test.com', userImage: null, commentsCount: 8, tasksCreated: 5, tasksAssigned: 12, collaborationScore: 78 },
  ],
  dailyActiveUsers: [
    { date: '2025-07-13', count: 8 },
    { date: '2025-07-14', count: 12 },
  ],
  peakHours: [
    { day: 'Mon', hour: 9, activity: 100 },
    { day: 'Mon', hour: 15, activity: 50 },
  ],
}

describe('EngagementSection', () => {
  it('renders section heading', () => {
    render(<EngagementSection userEngagement={mockUserEngagement} />)
    expect(screen.getByText('User Engagement')).toBeInTheDocument()
  })

  it('renders active user stats', () => {
    render(<EngagementSection userEngagement={mockUserEngagement} />)
    expect(screen.getByText('Online Now')).toBeInTheDocument()
    expect(screen.getByText('This Week')).toBeInTheDocument()
    expect(screen.getByText('This Month')).toBeInTheDocument()
  })

  it('renders inactive members badge count', () => {
    render(<EngagementSection userEngagement={mockUserEngagement} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Inactive Members')).toBeInTheDocument()
  })

  it('renders collaboration leaderboard', () => {
    render(<EngagementSection userEngagement={mockUserEngagement} />)
    expect(screen.getByText('Collaboration Leaderboard')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('renders the peak hours heatmap from real data', () => {
    const { container } = render(<EngagementSection userEngagement={mockUserEngagement} />)
    const cells = container.querySelectorAll('[title*="activity"]')
    expect(cells.length).toBeGreaterThan(0)
    expect(container.querySelector('[title^="Mon 9:00"]')).toBeTruthy()
  })
})
