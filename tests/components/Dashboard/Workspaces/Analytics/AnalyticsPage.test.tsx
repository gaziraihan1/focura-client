import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/dashboard/workspaces/test-ws/projects/test-proj/tasks',
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

vi.mock('date-fns', () => ({
  formatDistanceToNow: () => '3 days ago',
  format: () => 'Jan 15, 2025',
}))

vi.mock('lucide-react', () => {
  const React = require('react')
  const mock = (name: string) => {
    const Cmp = (props: any) => React.createElement('svg', { 'data-testid': `${name}-icon`, ...props })
    Cmp.displayName = name
    return Cmp
  }
  return {
    Loader2: mock('loader2'),
    AlertTriangle: mock('alert-triangle'),
    BarChart3: mock('bar-chart3'),
    Folder: mock('folder'),
    CheckCircle2: mock('check-circle2'),
    CheckCircle: mock('check-circle'),
    AlertCircle: mock('alert-circle'),
    Clock: mock('clock'),
    Users: mock('users'),
    TrendingUp: mock('trending-up'),
    Crown: mock('crown'),
    User: mock('user'),
    Calendar: mock('calendar'),
    Activity: mock('activity'),
    Flame: mock('flame'),
    Search: mock('search'),
    ArrowUpDown: mock('arrow-up-down'),
    ArrowUp: mock('arrow-up'),
    ArrowDown: mock('arrow-down'),
    Megaphone: mock('megaphone'),
    Menu: mock('menu'),
    X: mock('x'),
    ChevronLeft: mock('chevron-left'),
    Pin: mock('pin'),
    Trash2: mock('trash2'),
    Globe: mock('globe'),
    Lock: mock('lock'),
    Plus: mock('plus'),
    Building2: mock('building2'),
    HardDrive: mock('hard-drive'),
    Timer: mock('timer'),
    LayoutGrid: mock('layout-grid'),
    Zap: mock('zap'),
    Infinity: mock('infinity'),
    Bold: mock('bold'),
    Italic: mock('italic'),
    Code2: mock('code2'),
    Link2: mock('link2'),
    CornerDownLeft: mock('corner-down-left'),
    Check: mock('check'),
    Copy: mock('copy'),
    FolderOpen: mock('folder-open'),
    RotateCcw: mock('rotate-ccw'),
    ArrowLeft: mock('arrow-left'),
    UserCircle2: mock('user-circle2'),
  }
})

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart: (props: any) => <div data-testid="bar-chart" {...props} />,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
  PieChart: (props: any) => <div data-testid="pie-chart" {...props} />,
  Pie: () => null,
  Cell: () => null,
  LineChart: (props: any) => <div data-testid="line-chart" {...props} />,
  Line: () => null,
  Legend: () => null,
  AreaChart: (props: any) => <div data-testid="area-chart" {...props} />,
  Area: () => null,
  RadarChart: (props: any) => <div data-testid="radar-chart" {...props} />,
  Radar: () => null,
  PolarGrid: () => null,
  PolarAngleAxis: () => null,
  PolarRadiusAxis: () => null,
}))

vi.mock('@/hooks/useAnalyticsPage', () => ({
  useAnalyticsPage: vi.fn(),
}))

vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name }: any) => <div data-testid="avatar">{name}</div>,
}))

import { AnalyticsPage } from '@/components/Dashboard/Workspaces/Analytics/AnalyticsPage'
import { useAnalyticsPage } from '@/hooks/useAnalyticsPage'
import type { ExecutiveKPIs, TaskStatusItem, TasksByPriorityItem, ActivityTrendPoint, TrendDataPoint, MemberContribution, ProjectHealth, DeadlineRisk, TimeSummary, MostActiveDay as MostActiveDayType, WorkloadMember } from '@/hooks/useAnalytics'

const mockKpis: ExecutiveKPIs = {
  totalProjects: 10,
  activeProjects: 5,
  totalTasks: 100,
  completedTasks: 60,
  overdueTasks: 8,
  completionRate: 60,
  totalMembers: 12,
  activeMembers: 8,
  totalHours: 240.5,
  storageUsed: 1500.3,
}

const mockTaskStatusData: TaskStatusItem[] = [
  { status: 'TODO', count: 20, percentage: 20 },
  { status: 'IN_PROGRESS', count: 15, percentage: 15 },
  { status: 'COMPLETED', count: 50, percentage: 50 },
  { status: 'BLOCKED', count: 5, percentage: 5 },
  { status: 'IN_REVIEW', count: 10, percentage: 10 },
]

const mockPriorityData: TasksByPriorityItem[] = [
  { priority: 'URGENT', count: 5 },
  { priority: 'HIGH', count: 15 },
  { priority: 'MEDIUM', count: 30 },
  { priority: 'LOW', count: 10 },
]

const mockActivityTrendData: ActivityTrendPoint[] = [
  { date: new Date('2025-01-01'), created: 5, updated: 3, completed: 2, assigned: 1, total: 11 },
  { date: new Date('2025-01-02'), created: 8, updated: 4, completed: 3, assigned: 2, total: 17 },
  { date: new Date('2025-01-03'), created: 3, updated: 6, completed: 1, assigned: 0, total: 10 },
]

const mockCompletionTrendData: TrendDataPoint[] = [
  { date: new Date('2025-01-01'), count: 5 },
  { date: new Date('2025-01-02'), count: 8 },
  { date: new Date('2025-01-03'), count: 12 },
  { date: new Date('2025-01-04'), count: 15 },
  { date: new Date('2025-01-05'), count: 10 },
]

const mockMemberData: MemberContribution[] = [
  {
    userId: 'u-1',
    userName: 'Alice Johnson',
    userEmail: 'alice@test.com',
    userImage: 'https://example.com/alice.jpg',
    role: 'ADMIN',
    completedTasks: 25,
    totalHours: 80,
    commentsCount: 40,
    filesCount: 12,
    contributionScore: 95,
  },
  {
    userId: 'u-2',
    userName: 'Bob Smith',
    userEmail: 'bob@test.com',
    userImage: null,
    role: 'MEMBER',
    completedTasks: 15,
    totalHours: 50,
    commentsCount: 20,
    filesCount: 5,
    contributionScore: 60,
  },
  {
    userId: 'u-3',
    userName: null,
    userEmail: 'charlie@test.com',
    userImage: null,
    role: 'MEMBER',
    completedTasks: 10,
    totalHours: 30,
    commentsCount: 10,
    filesCount: 3,
    contributionScore: 40,
  },
]

const mockProjectHealthData: ProjectHealth[] = [
  {
    projectId: 'p-1',
    projectName: 'Project Alpha',
    status: 'ACTIVE',
    progress: 75,
    totalTasks: 40,
    completedTasks: 30,
    remainingTasks: 10,
    dueDate: new Date('2025-06-01'),
    health: 'healthy',
  },
  {
    projectId: 'p-2',
    projectName: 'Project Beta',
    status: 'PLANNING',
    progress: 30,
    totalTasks: 20,
    completedTasks: 6,
    remainingTasks: 14,
    dueDate: null,
    health: 'at-risk',
  },
  {
    projectId: 'p-3',
    projectName: 'Project Gamma',
    status: 'ACTIVE',
    progress: 10,
    totalTasks: 15,
    completedTasks: 1,
    remainingTasks: 14,
    dueDate: new Date('2025-03-01'),
    health: 'critical',
  },
]

const mockDeadlineRiskData: DeadlineRisk = {
  dueIn3Days: [
    {
      id: 't-1',
      title: 'Urgent Task Alpha',
      dueDate: new Date('2025-01-16'),
      priority: 'URGENT',
      assignedTo: 'Alice',
    },
    {
      id: 't-2',
      title: 'Urgent Task Beta',
      dueDate: new Date('2025-01-17'),
      priority: 'HIGH',
      assignedTo: undefined,
    },
  ],
  dueIn7DaysCount: 5,
  highPriorityNearDeadline: [
    {
      id: 't-3',
      title: 'High Priority Task',
      dueDate: new Date('2025-01-20'),
      priority: 'HIGH',
      assignedTo: 'Bob',
    },
  ],
  riskLevel: 'high',
}

const mockTimeSummaryData: TimeSummary = {
  totalHours: 120.5,
  avgHoursPerMember: 15.1,
  projectBreakdown: [
    { projectId: 'p-1', projectName: 'Project Alpha', hours: 50.5 },
    { projectId: 'p-2', projectName: 'Project Beta', hours: 35.0 },
    { projectId: 'p-3', projectName: 'Project Gamma', hours: 35.0 },
  ],
}

const mockMostActiveDayData: MostActiveDayType = {
  day: 'Monday',
  count: 45,
  mostCommonAction: 'CREATED',
}

const mockWorkloadData: WorkloadMember[] = [
  { userId: 'u-1', userName: 'Alice Johnson', userEmail: 'alice@test.com', assignedTasks: 12, status: 'high' },
  { userId: 'u-2', userName: 'Bob Smith', userEmail: 'bob@test.com', assignedTasks: 5, status: 'normal' },
  { userId: 'u-3', userName: null, userEmail: 'charlie@test.com', assignedTasks: 18, status: 'overloaded' },
]

describe('AnalyticsPage', () => {
  const mockUseAnalyticsPage = vi.mocked(useAnalyticsPage)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state', () => {
    mockUseAnalyticsPage.mockReturnValue({
      overview: undefined,
      hasNotPlan: false,
      taskTrends: undefined,
      projectHealth: undefined,
      memberContribution: undefined,
      timeSummary: undefined,
      activityTrends: undefined,
      workload: undefined,
      overviewLoading: true,
      isLoading: false,
      overviewError: null,
      isAccessDenied: false,
      errorMessage: '',
    })
    render(<AnalyticsPage workspaceId="ws-1" />)
    expect(screen.getByText('Loading analytics...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    mockUseAnalyticsPage.mockReturnValue({
      overview: undefined,
      hasNotPlan: false,
      taskTrends: undefined,
      projectHealth: undefined,
      memberContribution: undefined,
      timeSummary: undefined,
      activityTrends: undefined,
      workload: undefined,
      overviewLoading: false,
      isLoading: false,
      overviewError: { status: 500, message: 'Server error' },
      isAccessDenied: false,
      errorMessage: 'An error occurred',
    })
    render(<AnalyticsPage workspaceId="ws-1" />)
    expect(screen.getByText('Failed to load analytics')).toBeInTheDocument()
    expect(screen.getByText('An error occurred')).toBeInTheDocument()
  })

  it('shows access denied state', () => {
    mockUseAnalyticsPage.mockReturnValue({
      overview: undefined,
      hasNotPlan: false,
      taskTrends: undefined,
      projectHealth: undefined,
      memberContribution: undefined,
      timeSummary: undefined,
      activityTrends: undefined,
      workload: undefined,
      overviewLoading: false,
      isLoading: false,
      overviewError: { status: 403, message: 'permission denied' },
      isAccessDenied: true,
      errorMessage: 'You do not have permission to view analytics for this workspace.',
    })
    render(<AnalyticsPage workspaceId="ws-1" />)
    expect(screen.getByText('Access Restricted')).toBeInTheDocument()
    expect(screen.getByText('Contact your workspace admin to request analytics access.')).toBeInTheDocument()
  })

  it('shows no data state', () => {
    mockUseAnalyticsPage.mockReturnValue({
      overview: undefined,
      hasNotPlan: false,
      taskTrends: undefined,
      projectHealth: undefined,
      memberContribution: undefined,
      timeSummary: undefined,
      activityTrends: undefined,
      workload: undefined,
      overviewLoading: false,
      isLoading: false,
      overviewError: null,
      isAccessDenied: false,
      errorMessage: '',
    })
    render(<AnalyticsPage workspaceId="ws-1" />)
    expect(screen.getByText('No Analytics Data')).toBeInTheDocument()
    expect(screen.getByText('Analytics data is not available for this workspace.')).toBeInTheDocument()
  })

  it('renders full analytics with all data', () => {
    mockUseAnalyticsPage.mockReturnValue({
      overview: {
        kpis: mockKpis,
        taskStatus: mockTaskStatusData,
        projectStatus: [],
        tasksByPriority: mockPriorityData,
        deadlineRisk: mockDeadlineRiskData,
      },
      hasNotPlan: false,
      taskTrends: { completionTrend: mockCompletionTrendData, overdueTrend: [] },
      projectHealth: mockProjectHealthData,
      memberContribution: mockMemberData,
      timeSummary: mockTimeSummaryData,
      activityTrends: { volumeTrend: mockActivityTrendData, mostActiveDay: mockMostActiveDayData },
      workload: mockWorkloadData,
      overviewLoading: false,
      isLoading: false,
      overviewError: null,
      isAccessDenied: false,
      errorMessage: '',
    })
    render(<AnalyticsPage workspaceId="ws-1" />)
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    expect(screen.getByText('Comprehensive workspace insights and metrics')).toBeInTheDocument()
    expect(screen.getByText('Total Projects')).toBeInTheDocument()
    expect(screen.getByText('Task Status Distribution')).toBeInTheDocument()
    expect(screen.getByText('Tasks by Priority')).toBeInTheDocument()
    expect(screen.getByText('Team Leaderboard')).toBeInTheDocument()
    expect(screen.getByText('Activity Volume Trend')).toBeInTheDocument()
    expect(screen.getByText('Workload Distribution')).toBeInTheDocument()
    expect(screen.getByText('Time Tracking Summary')).toBeInTheDocument()
    expect(screen.getByText('Peak Activity Day')).toBeInTheDocument()
    expect(screen.getByText('Deadline Risk Analysis')).toBeInTheDocument()
  })

  it('renders without optional data sections', () => {
    mockUseAnalyticsPage.mockReturnValue({
      overview: {
        kpis: mockKpis,
        taskStatus: mockTaskStatusData,
        projectStatus: [],
        tasksByPriority: mockPriorityData,
        deadlineRisk: mockDeadlineRiskData,
      },
      hasNotPlan: false,
      taskTrends: undefined,
      projectHealth: undefined,
      memberContribution: undefined,
      timeSummary: undefined,
      activityTrends: undefined,
      workload: undefined,
      overviewLoading: false,
      isLoading: false,
      overviewError: null,
      isAccessDenied: false,
      errorMessage: '',
    })
    render(<AnalyticsPage workspaceId="ws-1" />)
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    expect(screen.queryByText('Team Leaderboard')).not.toBeInTheDocument()
    expect(screen.queryByText('Workload Distribution')).not.toBeInTheDocument()
  })

  it('hides project health when empty', () => {
    mockUseAnalyticsPage.mockReturnValue({
      overview: {
        kpis: mockKpis,
        taskStatus: mockTaskStatusData,
        projectStatus: [],
        tasksByPriority: mockPriorityData,
        deadlineRisk: mockDeadlineRiskData,
      },
      hasNotPlan: false,
      taskTrends: undefined,
      projectHealth: [],
      memberContribution: undefined,
      timeSummary: undefined,
      activityTrends: undefined,
      workload: [],
      overviewLoading: false,
      isLoading: false,
      overviewError: null,
      isAccessDenied: false,
      errorMessage: '',
    })
    render(<AnalyticsPage workspaceId="ws-1" />)
    expect(screen.queryByText('Project Health')).not.toBeInTheDocument()
  })

  it('shows loading overlay when isLoading is true', () => {
    mockUseAnalyticsPage.mockReturnValue({
      overview: {
        kpis: mockKpis,
        taskStatus: mockTaskStatusData,
        projectStatus: [],
        tasksByPriority: mockPriorityData,
        deadlineRisk: mockDeadlineRiskData,
      },
      hasNotPlan: false,
      taskTrends: undefined,
      projectHealth: undefined,
      memberContribution: undefined,
      timeSummary: undefined,
      activityTrends: undefined,
      workload: undefined,
      overviewLoading: false,
      isLoading: true,
      overviewError: null,
      isAccessDenied: false,
      errorMessage: '',
    })
    render(<AnalyticsPage workspaceId="ws-1" />)
    expect(screen.getByText('Updating analytics...')).toBeInTheDocument()
  })
})
