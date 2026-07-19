import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EngagementSection } from '@/components/Dashboard/Analytics/WorkspaceUsage/EngagementSection'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}))

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}))

const mockUserEngagement = {
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
}

describe('EngagementSection', () => {
  it('renders section heading', () => {
    render(<EngagementSection userEngagement={mockUserEngagement as any} projectActivity={{} as any} />)
    expect(screen.getByText('User Engagement')).toBeInTheDocument()
  })

  it('renders active user stats', () => {
    render(<EngagementSection userEngagement={mockUserEngagement as any} projectActivity={{} as any} />)
    expect(screen.getByText('Online Now')).toBeInTheDocument()
    expect(screen.getByText('This Week')).toBeInTheDocument()
    expect(screen.getByText('This Month')).toBeInTheDocument()
  })

  it('renders inactive members badge count', () => {
    render(<EngagementSection userEngagement={mockUserEngagement as any} projectActivity={{} as any} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Inactive Members')).toBeInTheDocument()
  })

  it('renders collaboration leaderboard', () => {
    render(<EngagementSection userEngagement={mockUserEngagement as any} projectActivity={{} as any} />)
    expect(screen.getByText('Collaboration Leaderboard')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })
})
