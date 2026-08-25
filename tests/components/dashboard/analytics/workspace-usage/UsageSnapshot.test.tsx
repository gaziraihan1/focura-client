import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UsageSnapshot } from '@/components/dashboard/analytics/WorkspaceUsage/UsageSnapshot'
import type { WorkspaceUsageData } from '@/types/workspace-usage.types'

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />
    C.displayName = name
    return C
  }
  return {
    Users: icon('Users'),
    UserCheck: icon('UserCheck'),
    ListTodo: icon('ListTodo'),
    Folder: icon('Folder'),
    HardDrive: icon('HardDrive'),
    Activity: icon('Activity'),
    TrendingUp: icon('TrendingUp'),
    Zap: icon('Zap'),
  }
})

const mockData: WorkspaceUsageData = {
  snapshot: {
    totalMembers: 10,
    activeMembers: 7,
    totalTasks: 1500,
    totalProjects: 5,
    storageUsedMB: 512,
    activityEvents: 1200,
    avgDailyUsers: 5,
    engagementScore: 70,
  },
  projectActivity: { mostActive: [], lowActivity: [], tasksPerProjectTrend: [] },
  userEngagement: { activeUsers: { online: 2, thisWeek: 7, thisMonth: 10 }, inactiveUsers: [], collaborationIndex: [], dailyActiveUsers: [], peakHours: [] },
  resourceUsage: { storageByProject: [], filesByUser: [], totalStorage: { usedMB: 512, totalMB: 10240, percentage: 5 }, storageGrowth: [], fileTrend: [], fileGrowthPct: null, fileTypeDistribution: [] },
  workspaceLoad: { tasksPerUser: [], projectsNearingDeadlines: [], averageTaskCompletion: { byUser: [], byProject: [] } },
  workspaceGrowth: { thisMonth: { newUsers: 2, newProjects: 1, newTasks: 30 }, trend: [], projectLifecycle: { created: 5, active: 4, completed: 1, archived: 0 }, changes: { newTasks: null, newUsers: null, newProjects: null }, insights: [] },
  featureUsage: { tasksCreated: 150, commentsAdded: 300, timeEntriesLogged: 50, filesUploaded: 25, mentionsUsed: 10, notificationsTriggered: 400 },
  planLimits: { currentPlan: 'PRO', memberCount: 10, memberLimit: 25, storageUsedMB: 512, storageLimitMB: 10240, projectCount: 5, projectLimit: 20, automationCount: 0, automationLimit: 10 },
  isAdmin: true,
}

describe('UsageSnapshot', () => {
  it('renders the Overview heading', () => {
    render(<UsageSnapshot data={mockData} />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
  })

  it('renders all KPI labels with formatted values', () => {
    render(<UsageSnapshot data={mockData} />)
    expect(screen.getByText('Total Members')).toBeInTheDocument()
    expect(screen.getByText('Active Members')).toBeInTheDocument()
    expect(screen.getByText('Total Tasks')).toBeInTheDocument()
    expect(screen.getByText('Total Projects')).toBeInTheDocument()
    expect(screen.getByText('Storage Used')).toBeInTheDocument()
    expect(screen.getByText('Activity Events')).toBeInTheDocument()
    expect(screen.getByText('Avg Daily Users')).toBeInTheDocument()
    expect(screen.getByText('Engagement Score')).toBeInTheDocument()

    expect(screen.getByText('1,500')).toBeInTheDocument()
    expect(screen.getByText('1,200')).toBeInTheDocument()
    expect(screen.getByText('70%')).toBeInTheDocument()
    expect(screen.getByText('512 MB')).toBeInTheDocument()
  })

  it('formats storage over 1 GB', () => {
    render(
      <UsageSnapshot
        data={{ ...mockData, snapshot: { ...mockData.snapshot, storageUsedMB: 2048 } }}
      />
    )
    expect(screen.getByText('2.0 GB')).toBeInTheDocument()
  })

  it('uses chart token classes for KPI icons', () => {
    const { container } = render(<UsageSnapshot data={mockData} />)
    // First card (Total Members) uses chart-1 token.
    const iconWrap = container.querySelector('[class*="bg-chart-1"]')
    expect(iconWrap).toBeTruthy()
    const svg = screen.getByTestId('icon-Users')
    expect(svg.getAttribute('class')).toContain('text-chart-1')
  })
})
