import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// ─── Global mocks ────────────────────────────────────────────────────────────
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

// Mock analytics hooks
vi.mock('@/hooks/useAnalyticsPage', () => ({
  useAnalyticsPage: vi.fn(),
}))

// Mock shared Avatar
vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name }: any) => <div data-testid="avatar">{name}</div>,
}))

// Mock sub-components
vi.mock('@/components/Dashboard/Workspaces/Announcement/AnnouncementCard', () => ({
  AnnouncementCard: (props: any) => <div data-testid="announcement-card" {...props} />,
}))

vi.mock('@/components/Dashboard/Workspaces/Announcement/AnnouncementDetailModal', () => ({
  AnnouncementDetailModal: (props: any) => <div data-testid="announcement-detail-modal" {...props} />,
}))

vi.mock('@/components/Shared/Pagination', () => ({
  Pagination: (props: any) => <div data-testid="pagination" {...props} />,
}))

vi.mock('@/components/Dashboard/Workspaces/Announcement/DeleteConfirmModal', () => ({
  DeleteConfirmModal: (props: any) => <div data-testid="delete-confirm-modal" {...props} />,
}))

vi.mock('@/components/Dashboard/Workspaces/Announcement/RenderedContent', () => ({
  RenderedContent: (props: any) => <div data-testid="rendered-content" {...props} />,
}))

vi.mock('@/utils/announcement.utils', () => ({
  stripTokens: (raw: string) => raw,
}))

vi.mock('@/components/Dashboard/Workspaces/project/Announcements/AuthorAvatar', () => ({
  AuthorAvatar: ({ author }: any) => <div data-testid="author-avatar">{author?.name ?? 'Unknown'}</div>,
}))

// Mock the page module that exports timeAgo, formatFullDate, initials
vi.mock('@/app/(dashboard-pages)/dashboard/workspaces/[workspaceSlug]/projects/[projectSlug]/announcements/page', () => ({
  timeAgo: () => '3 days ago',
  formatFullDate: (date: string) => new Date(date).toLocaleString(),
  initials: (name?: string | null) => name ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '??',
}))

vi.mock('@/components/Dashboard/AllTasks/TaskQouta/StartPill', () => ({
  StatPill: (props: any) => <div data-testid="stat-pill" {...props} />,
}))

vi.mock('@/components/Dashboard/AllTasks/TaskQouta/ProgressRing', () => ({
  ProgressRing: (props: any) => <div data-testid="progress-ring" {...props} />,
}))

vi.mock('@/components/Dashboard/AllTasks/TaskQouta/MemberRow', () => ({
  MemberRow: (props: any) => <div data-testid="member-row" {...props} />,
}))

vi.mock('@/components/Dashboard/AllTasks/TaskQouta/QoutaSkeleton', () => ({
  QuotaSkeleton: () => <div data-testid="quota-skeleton" />,
}))

// ═══════════════════════════════════════════════════════════════════════════════
// Imports under test
// ═══════════════════════════════════════════════════════════════════════════════
import { KPICards } from '@/components/Dashboard/Workspaces/Analytics/KPICards'
import { TaskStatusChart } from '@/components/Dashboard/Workspaces/Analytics/TaskStatusChart'
import { PriorityDistribution } from '@/components/Dashboard/Workspaces/Analytics/PriorityDistribution'
import { ActivityTrendChart } from '@/components/Dashboard/Workspaces/Analytics/ActivityTrendChart'
import { TaskCompletionTrend } from '@/components/Dashboard/Workspaces/Analytics/TaskCompletionTrend'
import { MemberLeaderboard } from '@/components/Dashboard/Workspaces/Analytics/MemberLeaderboard'
import { ProjectHealthCards } from '@/components/Dashboard/Workspaces/Analytics/ProjectHealthCards'
import { DeadlineRiskPanel } from '@/components/Dashboard/Workspaces/Analytics/DeadlineRiskPanel'
import { TimeSummaryCard } from '@/components/Dashboard/Workspaces/Analytics/TimeSummaryCard'
import { MostActiveDay } from '@/components/Dashboard/Workspaces/Analytics/MostActiveDay'
import { WorkloadChart } from '@/components/Dashboard/Workspaces/Analytics/WorkloadChart'
import LoadingAnalytics from '@/components/Dashboard/Workspaces/Analytics/LoadingAnalytics'
import { AnalyticsPage } from '@/components/Dashboard/Workspaces/Analytics/AnalyticsPage'
import { AnnouncementEmptyState } from '@/components/Dashboard/Workspaces/Announcement/AnnouncementEmptyState'
import { AnnouncementList } from '@/components/Dashboard/Workspaces/Announcement/AnnouncementList'
import { MobileTopBar } from '@/components/Dashboard/Workspaces/project/Layout/MobileTopBar'
import { MobileDrawer } from '@/components/Dashboard/Workspaces/project/Layout/MobileDrawer'
import { SidebarContent } from '@/components/Dashboard/Workspaces/project/Layout/SidebarContent'
import { TaskFiltersBar } from '@/components/Dashboard/AllTasks/TaskFiltersBar'
import { PersonalCard } from '@/components/Dashboard/AllTasks/TaskQouta/PersonalCard'
import { WorkspaceCard } from '@/components/Dashboard/AllTasks/TaskQouta/WorkspaceCard'
import { EmptyAnnouncements } from '@/components/Dashboard/Workspaces/project/Announcements/EmptyAnnouncements'
import { AnnouncementCard as ProjectAnnouncementCard } from '@/components/Dashboard/Workspaces/project/Announcements/AnnouncementCard'

import type { ExecutiveKPIs, TaskStatusItem, TasksByPriorityItem, ActivityTrendPoint, TrendDataPoint, MemberContribution, ProjectHealth, DeadlineRisk, TimeSummary, MostActiveDay as MostActiveDayType, WorkloadMember } from '@/hooks/useAnalytics'
import type { PersonalQuotaInfo, WorkspaceQuotaInfo } from '@/hooks/useTask'
import type { Announcement, AnnouncementPagination } from '@/types/announcement.types'
import { useAnalyticsPage } from '@/hooks/useAnalyticsPage'

// ─── Shared test data ────────────────────────────────────────────────────────
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

const mockAnnouncement: Announcement = {
  id: 'a-1',
  title: 'Test Announcement',
  content: 'This is a test announcement content for testing purposes.',
  visibility: 'PUBLIC',
  isPinned: false,
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-01-15T10:00:00Z',
  workspaceId: 'ws-1',
  projectId: null,
  project: null,
  createdById: 'u-1',
  createdBy: { id: 'u-1', name: 'Alice', image: null },
  targets: [],
}

const mockAnnouncementPagination: AnnouncementPagination = {
  page: 1,
  pageSize: 10,
  totalCount: 25,
  totalPages: 3,
  hasNext: true,
  hasPrev: false,
}

const mockPersonalQuota: PersonalQuotaInfo = {
  plan: 'FREE',
  dailyLimit: 10,
  usedToday: 7,
  remaining: 3,
  resetAt: new Date(Date.now() + 3600000).toISOString(),
  perMinuteLimit: 5,
}

const mockWorkspaceQuota: WorkspaceQuotaInfo = {
  plan: 'PRO',
  dailyWorkspaceLimit: 50,
  dailyPerMemberLimit: 10,
  workspaceUsedToday: 35,
  workspaceRemaining: 15,
  perMinuteLimit: 20,
  isUnlimited: false,
  resetAt: new Date(Date.now() + 3600000).toISOString(),
  members: [
    { userId: 'u-1', name: 'Alice', email: 'alice@test.com', image: null, usedToday: 12, memberLimit: 10, remaining: 0 },
    { userId: 'u-2', name: 'Bob', email: 'bob@test.com', image: null, usedToday: 5, memberLimit: 10, remaining: 5 },
  ],
}

const mockWorkspaceQuotaUnlimited: WorkspaceQuotaInfo = {
  ...mockWorkspaceQuota,
  plan: 'ENTERPRISE',
  isUnlimited: true,
  dailyWorkspaceLimit: null,
  workspaceRemaining: null,
  perMinuteLimit: null,
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. KPICards
// ═══════════════════════════════════════════════════════════════════════════════
describe('KPICards', () => {
  it('renders all KPI cards', () => {
    render(<KPICards kpis={mockKpis} />)
    expect(screen.getByText('Total Projects')).toBeInTheDocument()
    expect(screen.getByText('Active Projects')).toBeInTheDocument()
    expect(screen.getByText('Total Tasks')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Overdue')).toBeInTheDocument()
    expect(screen.getByText('Completion Rate')).toBeInTheDocument()
    expect(screen.getByText('Team Members')).toBeInTheDocument()
    expect(screen.getByText('Active Members')).toBeInTheDocument()
    expect(screen.getByText('Hours Logged')).toBeInTheDocument()
    expect(screen.getByText('Storage Used')).toBeInTheDocument()
  })

  it('displays correct KPI values', () => {
    render(<KPICards kpis={mockKpis} />)
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('60%')).toBeInTheDocument()
    expect(screen.getByText('240.5h')).toBeInTheDocument()
    expect(screen.getByText('1500.3 MB')).toBeInTheDocument()
  })

  it('shows Active Members subtitle', () => {
    render(<KPICards kpis={mockKpis} />)
    expect(screen.getByText('Last 7 days')).toBeInTheDocument()
  })

  it('displays storage used with decimal', () => {
    render(<KPICards kpis={mockKpis} />)
    expect(screen.getByText('1500.3 MB')).toBeInTheDocument()
  })

  it('renders with zero KPIs', () => {
    const zeroKpis: ExecutiveKPIs = {
      totalProjects: 0,
      activeProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      overdueTasks: 0,
      completionRate: 0,
      totalMembers: 0,
      activeMembers: 0,
      totalHours: 0,
      storageUsed: 0,
    }
    render(<KPICards kpis={zeroKpis} />)
    expect(screen.getByText('0.0 MB')).toBeInTheDocument()
    expect(screen.getByText('0h')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 2. TaskStatusChart
// ═══════════════════════════════════════════════════════════════════════════════
describe('TaskStatusChart', () => {
  it('renders the chart title', () => {
    render(<TaskStatusChart data={mockTaskStatusData} />)
    expect(screen.getByText('Task Status Distribution')).toBeInTheDocument()
  })

  it('displays total task count', () => {
    render(<TaskStatusChart data={mockTaskStatusData} />)
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('Total Tasks')).toBeInTheDocument()
  })

  it('renders all status legend items', () => {
    render(<TaskStatusChart data={mockTaskStatusData} />)
    expect(screen.getByText('todo')).toBeInTheDocument()
    expect(screen.getByText('in progress')).toBeInTheDocument()
    expect(screen.getByText('completed')).toBeInTheDocument()
    expect(screen.getByText('blocked')).toBeInTheDocument()
    expect(screen.getByText('in review')).toBeInTheDocument()
  })

  it('displays count and percentage for each status', () => {
    render(<TaskStatusChart data={mockTaskStatusData} />)
    expect(screen.getByText('20')).toBeInTheDocument()
    expect(screen.getByText('(20%)')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('(50%)')).toBeInTheDocument()
  })

  it('renders with single status item', () => {
    const singleData: TaskStatusItem[] = [
      { status: 'COMPLETED', count: 10, percentage: 100 },
    ]
    render(<TaskStatusChart data={singleData} />)
    expect(screen.getByText('completed')).toBeInTheDocument()
    expect(screen.getByText('(100%)')).toBeInTheDocument()
  })

  it('renders with empty data', () => {
    render(<TaskStatusChart data={[]} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 3. PriorityDistribution
// ═══════════════════════════════════════════════════════════════════════════════
describe('PriorityDistribution', () => {
  it('renders the title and subtitle', () => {
    render(<PriorityDistribution data={mockPriorityData} />)
    expect(screen.getByText('Tasks by Priority')).toBeInTheDocument()
    expect(screen.getByText('Active and in-progress tasks')).toBeInTheDocument()
  })

  it('renders all priority items', () => {
    render(<PriorityDistribution data={mockPriorityData} />)
    expect(screen.getByText('Urgent')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Low')).toBeInTheDocument()
  })

  it('displays correct counts for each priority', () => {
    render(<PriorityDistribution data={mockPriorityData} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('shows total active tasks', () => {
    render(<PriorityDistribution data={mockPriorityData} />)
    expect(screen.getByText('Total Active Tasks')).toBeInTheDocument()
    expect(screen.getByText('60')).toBeInTheDocument()
  })

  it('renders empty state when no data', () => {
    render(<PriorityDistribution data={[]} />)
    expect(screen.getByText('No active tasks')).toBeInTheDocument()
  })

  it('hides total when no tasks', () => {
    render(<PriorityDistribution data={[]} />)
    expect(screen.queryByText('Total Active Tasks')).not.toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 4. ActivityTrendChart
// ═══════════════════════════════════════════════════════════════════════════════
describe('ActivityTrendChart', () => {
  it('renders chart with data', () => {
    render(<ActivityTrendChart data={mockActivityTrendData} />)
    expect(screen.getByText('Activity Volume Trend')).toBeInTheDocument()
    expect(screen.getByText('Team activity over the last 30 days')).toBeInTheDocument()
  })

  it('renders empty state when no data', () => {
    render(<ActivityTrendChart data={[]} />)
    expect(screen.getByText('No activity data available')).toBeInTheDocument()
  })

  it('shows legend categories', () => {
    render(<ActivityTrendChart data={mockActivityTrendData} />)
    expect(screen.getByText('Created')).toBeInTheDocument()
    expect(screen.getByText('Updated')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Assigned')).toBeInTheDocument()
  })

  it('displays summed legend values', () => {
    render(<ActivityTrendChart data={mockActivityTrendData} />)
    // Created: 5 + 8 + 3 = 16
    const createdLegend = screen.getAllByText('16')
    expect(createdLegend.length).toBeGreaterThan(0)
    // Updated: 3 + 4 + 6 = 13
    const updatedLegend = screen.getAllByText('13')
    expect(updatedLegend.length).toBeGreaterThan(0)
    // Completed: 2 + 3 + 1 = 6
    const completedLegend = screen.getAllByText('6')
    expect(completedLegend.length).toBeGreaterThan(0)
  })

  it('renders stacked bar segments', () => {
    const { container } = render(<ActivityTrendChart data={mockActivityTrendData} />)
    const bars = container.querySelectorAll('.flex-1')
    expect(bars.length).toBeGreaterThan(0)
  })

  it('renders with data where total is 0', () => {
    const zeroData: ActivityTrendPoint[] = [
      { date: new Date('2025-01-01'), created: 0, updated: 0, completed: 0, assigned: 0, total: 0 },
    ]
    render(<ActivityTrendChart data={zeroData} />)
    expect(screen.getByText('Activity Volume Trend')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 5. TaskCompletionTrend
// ═══════════════════════════════════════════════════════════════════════════════
describe('TaskCompletionTrend', () => {
  it('renders the chart title', () => {
    render(<TaskCompletionTrend data={mockCompletionTrendData} />)
    expect(screen.getByText('Task Completion Trend')).toBeInTheDocument()
    expect(screen.getByText('Last 30 days')).toBeInTheDocument()
  })

  it('renders empty state when no data', () => {
    render(<TaskCompletionTrend data={[]} />)
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('shows trend direction as up when last > first', () => {
    const upTrend: TrendDataPoint[] = [
      { date: new Date('2025-01-01'), count: 5 },
      { date: new Date('2025-01-02'), count: 15 },
    ]
    render(<TaskCompletionTrend data={upTrend} />)
    expect(screen.getByText('+200%')).toBeInTheDocument()
  })

  it('shows trend direction as down when last < first', () => {
    const downTrend: TrendDataPoint[] = [
      { date: new Date('2025-01-01'), count: 15 },
      { date: new Date('2025-01-02'), count: 5 },
    ]
    render(<TaskCompletionTrend data={downTrend} />)
    expect(screen.getByText('-67%')).toBeInTheDocument()
  })

  it('shows stable trend when last === first', () => {
    const stableTrend: TrendDataPoint[] = [
      { date: new Date('2025-01-01'), count: 10 },
      { date: new Date('2025-01-02'), count: 10 },
    ]
    render(<TaskCompletionTrend data={stableTrend} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('renders x-axis labels', () => {
    render(<TaskCompletionTrend data={mockCompletionTrendData} />)
    const dateLabels = screen.getAllByText(/Jan/)
    expect(dateLabels.length).toBeGreaterThanOrEqual(3)
  })

  it('handles first value being 0', () => {
    const zeroFirst: TrendDataPoint[] = [
      { date: new Date('2025-01-01'), count: 0 },
      { date: new Date('2025-01-02'), count: 10 },
    ]
    render(<TaskCompletionTrend data={zeroFirst} />)
    expect(screen.getByText('+0%')).toBeInTheDocument()
  })

  it('renders bar chart elements', () => {
    render(<TaskCompletionTrend data={mockCompletionTrendData} />)
    expect(screen.getByText('Task Completion Trend')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 6. MemberLeaderboard
// ═══════════════════════════════════════════════════════════════════════════════
describe('MemberLeaderboard', () => {
  it('renders the title', () => {
    render(<MemberLeaderboard data={mockMemberData} />)
    expect(screen.getByText('Team Leaderboard')).toBeInTheDocument()
    expect(screen.getByText('Top contributors by activity')).toBeInTheDocument()
  })

  it('displays member count', () => {
    render(<MemberLeaderboard data={mockMemberData} />)
    expect(screen.getByText('3 members')).toBeInTheDocument()
  })

  it('renders singular for one member', () => {
    render(<MemberLeaderboard data={[mockMemberData[0]]} />)
    expect(screen.getByText('1 member')).toBeInTheDocument()
  })

  it('renders all member names', () => {
    render(<MemberLeaderboard data={mockMemberData} />)
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
  })

  it('shows "Unknown User" for null name', () => {
    render(<MemberLeaderboard data={mockMemberData} />)
    expect(screen.getByText('Unknown User')).toBeInTheDocument()
  })

  it('shows user email', () => {
    render(<MemberLeaderboard data={mockMemberData} />)
    expect(screen.getByText('alice@test.com')).toBeInTheDocument()
  })

  it('displays contribution scores', () => {
    render(<MemberLeaderboard data={mockMemberData} />)
    expect(screen.getByText('95')).toBeInTheDocument()
    expect(screen.getByText('60')).toBeInTheDocument()
  })

  it('shows stats for each member', () => {
    render(<MemberLeaderboard data={mockMemberData} />)
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getAllByText('40').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('12').length).toBeGreaterThanOrEqual(1)
  })

  it('renders crown icon for first place', () => {
    render(<MemberLeaderboard data={mockMemberData} />)
    expect(screen.getByTestId('crown-icon')).toBeInTheDocument()
  })

  it('renders rank badges for top 3', () => {
    render(<MemberLeaderboard data={mockMemberData} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1)
  })

  it('renders user image when userImage is provided', () => {
    render(<MemberLeaderboard data={mockMemberData} />)
    const img = screen.getByAltText('Alice Johnson')
    expect(img).toBeInTheDocument()
  })

  it('renders initials fallback when no userImage', () => {
    render(<MemberLeaderboard data={mockMemberData} />)
    // Bob Smith has no image - should show initials
    expect(screen.getByText('BS')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(<MemberLeaderboard data={[]} />)
    expect(screen.getByText('No team members yet')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 7. ProjectHealthCards
// ═══════════════════════════════════════════════════════════════════════════════
describe('ProjectHealthCards', () => {
  it('renders the title', () => {
    render(<ProjectHealthCards data={mockProjectHealthData} />)
    expect(screen.getByText('Project Health')).toBeInTheDocument()
  })

  it('renders all project names', () => {
    render(<ProjectHealthCards data={mockProjectHealthData} />)
    expect(screen.getByText('Project Alpha')).toBeInTheDocument()
    expect(screen.getByText('Project Beta')).toBeInTheDocument()
    expect(screen.getByText('Project Gamma')).toBeInTheDocument()
  })

  it('shows task completion info', () => {
    render(<ProjectHealthCards data={mockProjectHealthData} />)
    expect(screen.getByText('30 of 40 tasks')).toBeInTheDocument()
    expect(screen.getByText('6 of 20 tasks')).toBeInTheDocument()
  })

  it('displays health status labels', () => {
    render(<ProjectHealthCards data={mockProjectHealthData} />)
    expect(screen.getByText('healthy')).toBeInTheDocument()
    expect(screen.getByText('at-risk')).toBeInTheDocument()
    expect(screen.getByText('critical')).toBeInTheDocument()
  })

  it('displays progress percentage', () => {
    render(<ProjectHealthCards data={mockProjectHealthData} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByText('30%')).toBeInTheDocument()
    expect(screen.getByText('10%')).toBeInTheDocument()
  })

  it('shows project status', () => {
    render(<ProjectHealthCards data={mockProjectHealthData} />)
    const activeStatuses = screen.getAllByText('ACTIVE')
    expect(activeStatuses.length).toBe(2)
    expect(screen.getByText('PLANNING')).toBeInTheDocument()
  })

  it('shows due date when present', () => {
    render(<ProjectHealthCards data={mockProjectHealthData} />)
    const dueLabels = screen.getAllByText(/Due/)
    expect(dueLabels.length).toBeGreaterThanOrEqual(1)
  })

  it('renders empty state when no data', () => {
    render(<ProjectHealthCards data={[]} />)
    expect(screen.getByText('No projects yet')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 8. DeadlineRiskPanel
// ═══════════════════════════════════════════════════════════════════════════════
describe('DeadlineRiskPanel', () => {
  it('renders the title', () => {
    render(<DeadlineRiskPanel data={mockDeadlineRiskData} />)
    expect(screen.getByText('Deadline Risk Analysis')).toBeInTheDocument()
    expect(screen.getByText('Tasks approaching deadlines')).toBeInTheDocument()
  })

  it('displays risk level badge', () => {
    render(<DeadlineRiskPanel data={mockDeadlineRiskData} />)
    expect(screen.getByText('High Risk')).toBeInTheDocument()
  })

  it('shows medium risk badge', () => {
    const mediumRisk = { ...mockDeadlineRiskData, riskLevel: 'medium' as const }
    render(<DeadlineRiskPanel data={mediumRisk} />)
    expect(screen.getByText('Medium Risk')).toBeInTheDocument()
  })

  it('shows low risk badge', () => {
    const lowRisk = { ...mockDeadlineRiskData, riskLevel: 'low' as const }
    render(<DeadlineRiskPanel data={lowRisk} />)
    expect(screen.getByText('Low Risk')).toBeInTheDocument()
  })

  it('displays summary counts', () => {
    render(<DeadlineRiskPanel data={mockDeadlineRiskData} />)
    expect(screen.getByText('Due in 3 Days')).toBeInTheDocument()
    expect(screen.getByText('Due in 7 Days')).toBeInTheDocument()
    expect(screen.getByText('High Priority')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // dueIn3Days count
    expect(screen.getByText('5')).toBeInTheDocument() // dueIn7DaysCount
    expect(screen.getByText('1')).toBeInTheDocument() // highPriorityNearDeadline count
  })

  it('renders urgent tasks list', () => {
    render(<DeadlineRiskPanel data={mockDeadlineRiskData} />)
    expect(screen.getByText('Urgent Tasks (3 Days)')).toBeInTheDocument()
    expect(screen.getByText('Urgent Task Alpha')).toBeInTheDocument()
    expect(screen.getByText('Urgent Task Beta')).toBeInTheDocument()
  })

  it('shows assigned to info', () => {
    render(<DeadlineRiskPanel data={mockDeadlineRiskData} />)
    expect(screen.getByText('Assigned to: Alice')).toBeInTheDocument()
  })

  it('shows priority badge for urgent tasks', () => {
    render(<DeadlineRiskPanel data={mockDeadlineRiskData} />)
    expect(screen.getByText('URGENT')).toBeInTheDocument()
    expect(screen.getByText('HIGH')).toBeInTheDocument()
  })

  it('renders "+more" text when > 5 urgent tasks', () => {
    const manyTasks: DeadlineRisk = {
      ...mockDeadlineRiskData,
      dueIn3Days: Array.from({ length: 8 }, (_, i) => ({
        id: `t-${i}`,
        title: `Task ${i}`,
        dueDate: new Date('2025-01-16'),
        priority: 'HIGH',
        assignedTo: 'Alice',
      })),
    }
    render(<DeadlineRiskPanel data={manyTasks} />)
    expect(screen.getByText('+3 more urgent tasks')).toBeInTheDocument()
  })

  it('renders empty state when no urgent tasks', () => {
    const noUrgent: DeadlineRisk = {
      dueIn3Days: [],
      dueIn7DaysCount: 0,
      highPriorityNearDeadline: [],
      riskLevel: 'low',
    }
    render(<DeadlineRiskPanel data={noUrgent} />)
    expect(screen.getByText(/No urgent deadlines/)).toBeInTheDocument()
  })

  it('does not show empty state when there are high priority tasks', () => {
    const highOnly: DeadlineRisk = {
      dueIn3Days: [],
      dueIn7DaysCount: 3,
      highPriorityNearDeadline: [
        { id: 't-1', title: 'High Task', dueDate: new Date('2025-01-20'), priority: 'HIGH' },
      ],
      riskLevel: 'medium',
    }
    render(<DeadlineRiskPanel data={highOnly} />)
    expect(screen.queryByText(/No urgent deadlines/)).not.toBeInTheDocument()
  })

  it('hides assignedTo when not present', () => {
    render(<DeadlineRiskPanel data={mockDeadlineRiskData} />)
    expect(screen.queryByText('Assigned to: Bob')).not.toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 9. TimeSummaryCard
// ═══════════════════════════════════════════════════════════════════════════════
describe('TimeSummaryCard', () => {
  it('renders the title', () => {
    render(<TimeSummaryCard data={mockTimeSummaryData} />)
    expect(screen.getByText('Time Tracking Summary')).toBeInTheDocument()
  })

  it('shows default days as 7', () => {
    render(<TimeSummaryCard data={mockTimeSummaryData} />)
    expect(screen.getByText('Last 7 days')).toBeInTheDocument()
  })

  it('shows custom days prop', () => {
    render(<TimeSummaryCard data={mockTimeSummaryData} days={14} />)
    expect(screen.getByText('Last 14 days')).toBeInTheDocument()
  })

  it('displays total hours and avg per member', () => {
    render(<TimeSummaryCard data={mockTimeSummaryData} />)
    expect(screen.getByText('Total Hours')).toBeInTheDocument()
    expect(screen.getByText('Avg per Member')).toBeInTheDocument()
    expect(screen.getByText('120.5h')).toBeInTheDocument()
    expect(screen.getByText('15.1h')).toBeInTheDocument()
  })

  it('renders project breakdown', () => {
    render(<TimeSummaryCard data={mockTimeSummaryData} />)
    expect(screen.getByText('Top Projects by Hours')).toBeInTheDocument()
    expect(screen.getByText('Project Alpha')).toBeInTheDocument()
    expect(screen.getByText('Project Beta')).toBeInTheDocument()
    expect(screen.getByText('Project Gamma')).toBeInTheDocument()
  })

  it('shows project ranking numbers', () => {
    render(<TimeSummaryCard data={mockTimeSummaryData} />)
    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByText('#2')).toBeInTheDocument()
    expect(screen.getByText('#3')).toBeInTheDocument()
  })

  it('shows hours per project', () => {
    render(<TimeSummaryCard data={mockTimeSummaryData} />)
    expect(screen.getByText('50.5h')).toBeInTheDocument()
    expect(screen.getAllByText('35.0h').length).toBeGreaterThanOrEqual(1)
  })

  it('limits to 5 projects', () => {
    const manyProjects: TimeSummary = {
      ...mockTimeSummaryData,
      projectBreakdown: Array.from({ length: 8 }, (_, i) => ({
        projectId: `p-${i}`,
        projectName: `Project ${i}`,
        hours: 10 + i,
      })),
    }
    render(<TimeSummaryCard data={manyProjects} />)
    // Should show at most 5 ranked items (check for #1 through #5)
    expect(screen.queryByText('#6')).not.toBeInTheDocument()
    expect(screen.queryByText('#7')).not.toBeInTheDocument()
    expect(screen.queryByText('#8')).not.toBeInTheDocument()
  })

  it('renders empty state when no project breakdown', () => {
    const emptyTimeSummary: TimeSummary = {
      totalHours: 0,
      avgHoursPerMember: 0,
      projectBreakdown: [],
    }
    render(<TimeSummaryCard data={emptyTimeSummary} />)
    expect(screen.getByText('No time entries yet')).toBeInTheDocument()
  })

  it('hides project breakdown header when empty', () => {
    const emptyTimeSummary: TimeSummary = {
      totalHours: 0,
      avgHoursPerMember: 0,
      projectBreakdown: [],
    }
    render(<TimeSummaryCard data={emptyTimeSummary} />)
    expect(screen.queryByText('Top Projects by Hours')).not.toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 10. MostActiveDay
// ═══════════════════════════════════════════════════════════════════════════════
describe('MostActiveDay', () => {
  it('renders peak activity day title', () => {
    render(<MostActiveDay data={mockMostActiveDayData} />)
    expect(screen.getByText('Peak Activity Day')).toBeInTheDocument()
    expect(screen.getByText('Last 30 days analysis')).toBeInTheDocument()
  })

  it('displays the day name', () => {
    render(<MostActiveDay data={mockMostActiveDayData} />)
    expect(screen.getByText('Monday')).toBeInTheDocument()
  })

  it('shows activity count', () => {
    render(<MostActiveDay data={mockMostActiveDayData} />)
    expect(screen.getByText('45 activities')).toBeInTheDocument()
  })

  it('shows singular "activity" for count of 1', () => {
    const oneActivity: MostActiveDayType = { ...mockMostActiveDayData, count: 1 }
    render(<MostActiveDay data={oneActivity} />)
    expect(screen.getByText('1 activity')).toBeInTheDocument()
  })

  it('displays most common action', () => {
    render(<MostActiveDay data={mockMostActiveDayData} />)
    expect(screen.getByText('Most common: Creating')).toBeInTheDocument()
  })

  it('shows "No data" when day is empty', () => {
    const noData: MostActiveDayType = { ...mockMostActiveDayData, day: '' }
    render(<MostActiveDay data={noData} />)
    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('hides most common action when NONE', () => {
    const noneAction: MostActiveDayType = { ...mockMostActiveDayData, mostCommonAction: 'NONE' }
    render(<MostActiveDay data={noneAction} />)
    expect(screen.queryByText(/Most common/)).not.toBeInTheDocument()
  })

  it('shows raw action label when not in predefined map', () => {
    const customAction: MostActiveDayType = { ...mockMostActiveDayData, mostCommonAction: 'CUSTOM_ACTION' }
    render(<MostActiveDay data={customAction} />)
    expect(screen.getByText('Most common: CUSTOM_ACTION')).toBeInTheDocument()
  })

  it('maps all known activity labels', () => {
    const actions = ['CREATED', 'UPDATED', 'COMPLETED', 'ASSIGNED', 'COMMENTED', 'UPLOADED']
    const labels = ['Creating', 'Updating', 'Completing', 'Assigning', 'Commenting', 'Uploading']
    actions.forEach((action, i) => {
      const data: MostActiveDayType = { ...mockMostActiveDayData, mostCommonAction: action }
      const { unmount } = render(<MostActiveDay data={data} />)
      expect(screen.getByText(`Most common: ${labels[i]}`)).toBeInTheDocument()
      unmount()
    })
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 11. WorkloadChart
// ═══════════════════════════════════════════════════════════════════════════════
describe('WorkloadChart', () => {
  it('renders the title', () => {
    render(<WorkloadChart data={mockWorkloadData} />)
    expect(screen.getByText('Workload Distribution')).toBeInTheDocument()
    expect(screen.getByText('Current task assignments per team member')).toBeInTheDocument()
  })

  it('displays status summary counts', () => {
    render(<WorkloadChart data={mockWorkloadData} />)
    expect(screen.getAllByText('Normal').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('High Load').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Overloaded').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(3)
  })

  it('renders all member names', () => {
    render(<WorkloadChart data={mockWorkloadData} />)
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
  })

  it('shows "Unknown User" for null userName', () => {
    render(<WorkloadChart data={mockWorkloadData} />)
    expect(screen.getByText('Unknown User')).toBeInTheDocument()
  })

  it('displays user emails', () => {
    render(<WorkloadChart data={mockWorkloadData} />)
    expect(screen.getByText('alice@test.com')).toBeInTheDocument()
  })

  it('shows assigned task counts', () => {
    render(<WorkloadChart data={mockWorkloadData} />)
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('18')).toBeInTheDocument()
  })

  it('shows status badges', () => {
    render(<WorkloadChart data={mockWorkloadData} />)
    expect(screen.getAllByText('High Load').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Normal').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Overloaded').length).toBeGreaterThanOrEqual(1)
  })

  it('renders threshold legend', () => {
    render(<WorkloadChart data={mockWorkloadData} />)
    expect(screen.getByText('Workload Thresholds:')).toBeInTheDocument()
    expect(screen.getByText('Normal:')).toBeInTheDocument()
    expect(screen.getByText('< 10 tasks')).toBeInTheDocument()
    expect(screen.getByText('High:')).toBeInTheDocument()
    expect(screen.getByText('10-14 tasks')).toBeInTheDocument()
    expect(screen.getByText('Overloaded:')).toBeInTheDocument()
    expect(screen.getByText('≥ 15 tasks')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(<WorkloadChart data={[]} />)
    expect(screen.getByText('No team members yet')).toBeInTheDocument()
  })

  it('renders user initials fallback', () => {
    render(<WorkloadChart data={mockWorkloadData} />)
    // Bob Smith → BS
    expect(screen.getByText('BS')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 12. LoadingAnalytics
// ═══════════════════════════════════════════════════════════════════════════════
describe('LoadingAnalytics', () => {
  it('renders loading message', () => {
    render(<LoadingAnalytics />)
    expect(screen.getByText('Loading analytics...')).toBeInTheDocument()
  })

  it('renders loader icon', () => {
    render(<LoadingAnalytics />)
    expect(screen.getByTestId('loader2-icon')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 13. AnalyticsPage
// ═══════════════════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════════════════
// 14. AnnouncementEmptyState
// ═══════════════════════════════════════════════════════════════════════════════
describe('AnnouncementEmptyState', () => {
  it('renders empty state message', () => {
    render(<AnnouncementEmptyState />)
    expect(screen.getByText('No announcements yet')).toBeInTheDocument()
    expect(screen.getByText('Workspace announcements will appear here.')).toBeInTheDocument()
  })

  it('renders megaphone icon', () => {
    render(<AnnouncementEmptyState />)
    expect(screen.getByTestId('megaphone-icon')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 15. AnnouncementList
// ═══════════════════════════════════════════════════════════════════════════════
describe('AnnouncementList', () => {
  const defaultProps = {
    announcements: [mockAnnouncement],
    pagination: mockAnnouncementPagination,
    canManage: true,
    isLoading: false,
    deletingId: null,
    pinningId: null,
    currentPage: 1,
    onDelete: vi.fn(),
    onTogglePin: vi.fn(),
    onPageChange: vi.fn(),
    isFetching: false,
  }

  it('shows loading state', () => {
    render(<AnnouncementList {...defaultProps} isLoading={true} announcements={[]} />)
    expect(screen.getByTestId('loader2-icon')).toBeInTheDocument()
  })

  it('shows empty state when no announcements and not fetching', () => {
    render(<AnnouncementList {...defaultProps} announcements={[]} />)
    expect(screen.getByText('No announcements yet')).toBeInTheDocument()
  })

  it('renders announcement cards', () => {
    render(<AnnouncementList {...defaultProps} />)
    const cards = screen.getAllByTestId('announcement-card')
    expect(cards.length).toBe(1)
  })

  it('renders multiple announcement cards', () => {
    const twoAnnouncements = [
      mockAnnouncement,
      { ...mockAnnouncement, id: 'a-2', title: 'Second Announcement' },
    ]
    render(<AnnouncementList {...defaultProps} announcements={twoAnnouncements} />)
    const cards = screen.getAllByTestId('announcement-card')
    expect(cards.length).toBe(2)
  })

  it('renders pagination', () => {
    render(<AnnouncementList {...defaultProps} />)
    expect(screen.getByTestId('pagination')).toBeInTheDocument()
  })

  it('shows updating indicator when fetching', () => {
    render(<AnnouncementList {...defaultProps} isFetching={true} />)
    expect(screen.getByText('Updating…')).toBeInTheDocument()
  })

  it('applies opacity when fetching', () => {
    const { container } = render(<AnnouncementList {...defaultProps} isFetching={true} />)
    const listContainer = container.querySelector('.opacity-70')
    expect(listContainer).toBeInTheDocument()
  })

  it('renders detail modal', () => {
    render(<AnnouncementList {...defaultProps} />)
    expect(screen.getByTestId('announcement-detail-modal')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 16. MobileTopBar (替代 ProjectLayout)
// ═══════════════════════════════════════════════════════════════════════════════
describe('MobileTopBar', () => {
  const defaultProps = {
    projectName: 'Test Project',
    currentLabel: 'Tasks',
    projectColor: '#3b82f6',
    onOpen: vi.fn(),
  }

  it('renders project name', () => {
    render(<MobileTopBar {...defaultProps} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('renders current label with separator', () => {
    render(<MobileTopBar {...defaultProps} />)
    expect(screen.getByText('Tasks')).toBeInTheDocument()
    expect(screen.getByText('/')).toBeInTheDocument()
  })

  it('renders menu button', () => {
    render(<MobileTopBar {...defaultProps} />)
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument()
  })

  it('calls onOpen when menu button clicked', () => {
    render(<MobileTopBar {...defaultProps} />)
    fireEvent.click(screen.getByTestId('menu-icon').closest('button')!)
    expect(defaultProps.onOpen).toHaveBeenCalledTimes(1)
  })

  it('shows first letter of project name in color swatch', () => {
    render(<MobileTopBar {...defaultProps} />)
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('renders fallback when projectName is undefined', () => {
    render(<MobileTopBar {...defaultProps} projectName={undefined} />)
    expect(screen.getByText('Project')).toBeInTheDocument()
    expect(screen.getByText('P')).toBeInTheDocument()
  })

  it('hides currentLabel when undefined', () => {
    render(<MobileTopBar {...defaultProps} currentLabel={undefined} />)
    expect(screen.queryByText('/')).not.toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 17. MobileDrawer (替代 ProjectLayout)
// ═══════════════════════════════════════════════════════════════════════════════
describe('MobileDrawer', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    nav: [
      {
        label: 'Tasks',
        href: '/tasks',
        icon: (props: any) => <svg data-testid="tasks-icon" {...props} />,
        match: (p: string) => p.includes('/tasks'),
      },
    ],
    pathname: '/dashboard/workspaces/ws/projects/proj/tasks',
    projectName: 'Test Project',
    projectColor: '#3b82f6',
    workspaceSlug: 'ws',
  }

  it('renders when open', () => {
    render(<MobileDrawer {...defaultProps} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', () => {
    render(<MobileDrawer {...defaultProps} />)
    const closeBtn = screen.getByTestId('x-icon').closest('button')!
    fireEvent.click(closeBtn)
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop clicked', () => {
    const { container } = render(<MobileDrawer {...defaultProps} />)
    const backdrop = container.querySelector('.fixed.inset-0')
    fireEvent.click(backdrop!)
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('renders navigation items', () => {
    render(<MobileDrawer {...defaultProps} />)
    expect(screen.getByText('Tasks')).toBeInTheDocument()
  })

  it('shows "All Projects" back link', () => {
    render(<MobileDrawer {...defaultProps} />)
    expect(screen.getByText('All Projects')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 18. SidebarContent
// ═══════════════════════════════════════════════════════════════════════════════
describe('SidebarContent', () => {
  const defaultProps = {
    nav: [
      {
        label: 'Overview',
        href: '/overview',
        icon: (props: any) => <svg data-testid="overview-icon" {...props} />,
        match: (p: string) => p === '/overview',
      },
      {
        label: 'Tasks',
        href: '/tasks',
        icon: (props: any) => <svg data-testid="tasks-icon" {...props} />,
        match: (p: string) => p.includes('/tasks'),
        badge: '5',
      },
    ],
    pathname: '/dashboard/workspaces/ws/projects/proj/tasks',
    projectName: 'Test Project',
    projectColor: '#3b82f6',
    workspaceSlug: 'ws',
  }

  it('renders project name', () => {
    render(<SidebarContent {...defaultProps} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('renders project initial in color swatch', () => {
    render(<SidebarContent {...defaultProps} />)
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('renders "All Projects" back link', () => {
    render(<SidebarContent {...defaultProps} />)
    expect(screen.getByText('All Projects')).toBeInTheDocument()
  })

  it('renders navigation items', () => {
    render(<SidebarContent {...defaultProps} />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Tasks')).toBeInTheDocument()
  })

  it('shows badge when present', () => {
    render(<SidebarContent {...defaultProps} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders "Project Workspace" footer', () => {
    render(<SidebarContent {...defaultProps} />)
    expect(screen.getByText('Project Workspace')).toBeInTheDocument()
  })

  it('shows loading skeleton when projectName is undefined', () => {
    render(<SidebarContent {...defaultProps} projectName={undefined} />)
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('calls onNavClick when nav item clicked', () => {
    const onNavClick = vi.fn()
    render(<SidebarContent {...defaultProps} onNavClick={onNavClick} />)
    fireEvent.click(screen.getByText('Tasks'))
    expect(onNavClick).toHaveBeenCalledTimes(1)
  })

  it('renders menu label', () => {
    render(<SidebarContent {...defaultProps} />)
    expect(screen.getByText('Menu')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 19. TaskFiltersBar
// ═══════════════════════════════════════════════════════════════════════════════
describe('TaskFiltersBar', () => {
  const defaultProps = {
    activeTab: 'all' as const,
    onTabChange: vi.fn(),
    searchQuery: '',
    onSearchChange: vi.fn(),
    selectedStatus: 'all',
    onStatusChange: vi.fn(),
    selectedPriority: 'all',
    onPriorityChange: vi.fn(),
    sortBy: 'createdAt' as const,
    sortOrder: undefined as 'asc' | 'desc' | undefined,
    onSortChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all tab buttons', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    expect(screen.getByText('All Tasks')).toBeInTheDocument()
    expect(screen.getByText('Personal')).toBeInTheDocument()
    expect(screen.getByText('Assigned')).toBeInTheDocument()
  })

  it('calls onTabChange when tab clicked', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    fireEvent.click(screen.getByText('Personal'))
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('personal')
  })

  it('renders search input', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument()
  })

  it('calls onSearchChange when typing', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    const input = screen.getByPlaceholderText('Search tasks...')
    fireEvent.change(input, { target: { value: 'test query' } })
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('test query')
  })

  it('renders status dropdown', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    expect(screen.getByText('All Status')).toBeInTheDocument()
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('In Review')).toBeInTheDocument()
    expect(screen.getByText('Blocked')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('calls onStatusChange when status changed', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    const statusSelect = screen.getByDisplayValue('All Status')
    fireEvent.change(statusSelect, { target: { value: 'TODO' } })
    expect(defaultProps.onStatusChange).toHaveBeenCalledWith('TODO')
  })

  it('renders priority dropdown', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    expect(screen.getByText('All Priority')).toBeInTheDocument()
    expect(screen.getByText('Urgent')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Low')).toBeInTheDocument()
  })

  it('calls onPriorityChange when priority changed', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    const prioritySelect = screen.getByDisplayValue('All Priority')
    fireEvent.change(prioritySelect, { target: { value: 'URGENT' } })
    expect(defaultProps.onPriorityChange).toHaveBeenCalledWith('URGENT')
  })

  it('renders sort dropdown', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    expect(screen.getByDisplayValue('Created Date')).toBeInTheDocument()
  })

  it('calls onSortChange when sort changed', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    const sortSelect = screen.getByDisplayValue('Created Date')
    fireEvent.change(sortSelect, { target: { value: 'priority' } })
    expect(defaultProps.onSortChange).toHaveBeenCalledWith('priority')
  })

  it('shows ArrowUpDown icon when no sortOrder', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    expect(screen.getByTestId('arrow-up-down-icon')).toBeInTheDocument()
  })

  it('shows ArrowUp icon when sortOrder is asc', () => {
    render(<TaskFiltersBar {...defaultProps} sortOrder="asc" />)
    expect(screen.getByTestId('arrow-up-icon')).toBeInTheDocument()
  })

  it('shows ArrowDown icon when sortOrder is desc', () => {
    render(<TaskFiltersBar {...defaultProps} sortOrder="desc" />)
    expect(screen.getByTestId('arrow-down-icon')).toBeInTheDocument()
  })

  it('shows search icon', () => {
    render(<TaskFiltersBar {...defaultProps} />)
    expect(screen.getByTestId('search-icon')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 20. PersonalCard (替代 TaskQuotaCard)
// ═══════════════════════════════════════════════════════════════════════════════
describe('PersonalCard', () => {
  it('renders the card title', () => {
    render(<PersonalCard q={mockPersonalQuota} />)
    expect(screen.getByText('Personal Quota')).toBeInTheDocument()
    expect(screen.getByText('Your daily task creation limit')).toBeInTheDocument()
  })

  it('displays plan badge', () => {
    render(<PersonalCard q={mockPersonalQuota} />)
    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('displays Pro plan badge', () => {
    const proQuota = { ...mockPersonalQuota, plan: 'PRO' as const }
    render(<PersonalCard q={proQuota} />)
    expect(screen.getByText(/Pro/)).toBeInTheDocument()
  })

  it('shows progress ring', () => {
    render(<PersonalCard q={mockPersonalQuota} />)
    expect(screen.getByTestId('progress-ring')).toBeInTheDocument()
  })

  it('displays stat pills', () => {
    render(<PersonalCard q={mockPersonalQuota} />)
    const pills = screen.getAllByTestId('stat-pill')
    expect(pills.length).toBe(3)
  })

  it('shows warning when at 90%', () => {
    const warningQuota = { ...mockPersonalQuota, usedToday: 9, dailyLimit: 10 }
    render(<PersonalCard q={warningQuota} />)
    expect(screen.getByText('Limit almost reached')).toBeInTheDocument()
  })

  it('does not show warning below 90%', () => {
    render(<PersonalCard q={mockPersonalQuota} />)
    expect(screen.queryByText('Limit almost reached')).not.toBeInTheDocument()
  })

  it('shows rate limit when present', () => {
    render(<PersonalCard q={mockPersonalQuota} />)
    expect(screen.getByText('5/min rate limit')).toBeInTheDocument()
  })

  it('hides rate limit when null', () => {
    const noRateLimit = { ...mockPersonalQuota, perMinuteLimit: null }
    render(<PersonalCard q={noRateLimit} />)
    expect(screen.queryByText(/rate limit/)).not.toBeInTheDocument()
  })

  it('shows reset time', () => {
    render(<PersonalCard q={mockPersonalQuota} />)
    expect(screen.getByText(/Resets in/)).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 21. WorkspaceCard (替代 TaskQuotaCard)
// ═══════════════════════════════════════════════════════════════════════════════
describe('WorkspaceCard', () => {
  it('renders the card title', () => {
    render(<WorkspaceCard q={mockWorkspaceQuota} />)
    expect(screen.getByText('Workspace Quota')).toBeInTheDocument()
    expect(screen.getByText('Shared team task creation limit')).toBeInTheDocument()
  })

  it('displays plan badge', () => {
    render(<WorkspaceCard q={mockWorkspaceQuota} />)
    expect(screen.getByText(/Pro/)).toBeInTheDocument()
  })

  it('displays Enterprise plan badge', () => {
    render(<WorkspaceCard q={mockWorkspaceQuotaUnlimited} />)
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
  })

  it('shows unlimited badge for unlimited plan', () => {
    render(<WorkspaceCard q={mockWorkspaceQuotaUnlimited} />)
    expect(screen.getByText('Unlimited tasks')).toBeInTheDocument()
    expect(screen.getByText('No daily or rate limits on this plan')).toBeInTheDocument()
  })

  it('hides progress bar for unlimited plan', () => {
    render(<WorkspaceCard q={mockWorkspaceQuotaUnlimited} />)
    expect(screen.queryByTestId('progress-ring')).not.toBeInTheDocument()
  })

  it('shows progress ring for limited plan', () => {
    render(<WorkspaceCard q={mockWorkspaceQuota} />)
    expect(screen.getByTestId('progress-ring')).toBeInTheDocument()
  })

  it('shows member breakdown toggle when has members', () => {
    render(<WorkspaceCard q={mockWorkspaceQuota} />)
    expect(screen.getByText('Member breakdown')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // member count badge
  })

  it('toggles member breakdown visibility', () => {
    render(<WorkspaceCard q={mockWorkspaceQuota} />)
    const toggleBtn = screen.getByText('Show ↓')
    fireEvent.click(toggleBtn)
    expect(screen.getByText('Hide ↑')).toBeInTheDocument()
    expect(screen.getAllByTestId('member-row').length).toBe(2)
  })

  it('shows warning when at 90%', () => {
    const warningQuota = { ...mockWorkspaceQuota, workspaceUsedToday: 45, dailyWorkspaceLimit: 50 }
    render(<WorkspaceCard q={warningQuota} />)
    expect(screen.getByText('Workspace limit almost reached')).toBeInTheDocument()
  })

  it('shows reset time', () => {
    render(<WorkspaceCard q={mockWorkspaceQuota} />)
    expect(screen.getByText(/Resets in/)).toBeInTheDocument()
  })

  it('shows rate limit for non-unlimited', () => {
    render(<WorkspaceCard q={mockWorkspaceQuota} />)
    expect(screen.getByText('20/min rate limit')).toBeInTheDocument()
  })

  it('shows "No rate limit" for unlimited', () => {
    render(<WorkspaceCard q={mockWorkspaceQuotaUnlimited} />)
    expect(screen.getByText('No rate limit')).toBeInTheDocument()
  })

  it('hides member breakdown for no members', () => {
    const noMemberQuota = { ...mockWorkspaceQuota, members: [] }
    render(<WorkspaceCard q={noMemberQuota} />)
    expect(screen.queryByText('Member breakdown')).not.toBeInTheDocument()
  })

  it('shows Business plan badge', () => {
    const bizQuota = { ...mockWorkspaceQuota, plan: 'BUSINESS' as const }
    render(<WorkspaceCard q={bizQuota} />)
    expect(screen.getByText('Business')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 22. EmptyAnnouncements (替代 ProjectAnnouncementList)
// ═══════════════════════════════════════════════════════════════════════════════
describe('EmptyAnnouncements', () => {
  it('shows "No announcements yet" when not filtered and no announcements', () => {
    render(<EmptyAnnouncements filtered={false} canManage={false} onNew={vi.fn()} />)
    expect(screen.getByText('No announcements yet')).toBeInTheDocument()
  })

  it('shows "No matching announcements" when filtered', () => {
    render(<EmptyAnnouncements filtered={true} canManage={true} onNew={vi.fn()} />)
    expect(screen.getByText('No matching announcements')).toBeInTheDocument()
    expect(screen.getByText(/Try adjusting your search/)).toBeInTheDocument()
  })

  it('shows create button when canManage and not filtered', () => {
    const onNew = vi.fn()
    render(<EmptyAnnouncements filtered={false} canManage={true} onNew={onNew} />)
    expect(screen.getByText('Create Announcement')).toBeInTheDocument()
  })

  it('calls onNew when create button clicked', () => {
    const onNew = vi.fn()
    render(<EmptyAnnouncements filtered={false} canManage={true} onNew={onNew} />)
    fireEvent.click(screen.getByText('Create Announcement'))
    expect(onNew).toHaveBeenCalledTimes(1)
  })

  it('hides create button when cannot manage', () => {
    render(<EmptyAnnouncements filtered={false} canManage={false} onNew={vi.fn()} />)
    expect(screen.queryByText('Create Announcement')).not.toBeInTheDocument()
  })

  it('hides create button when filtered', () => {
    render(<EmptyAnnouncements filtered={true} canManage={true} onNew={vi.fn()} />)
    expect(screen.queryByText('Create Announcement')).not.toBeInTheDocument()
  })

  it('shows correct message for non-managers with no announcements', () => {
    render(<EmptyAnnouncements filtered={false} canManage={false} onNew={vi.fn()} />)
    expect(screen.getByText('There are no announcements in this project yet.')).toBeInTheDocument()
  })

  it('shows correct message for managers with no announcements', () => {
    render(<EmptyAnnouncements filtered={false} canManage={true} onNew={vi.fn()} />)
    expect(screen.getByText('Create the first announcement to keep your team informed.')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 23. ProjectAnnouncementCard (替代 ProjectAnnouncementCard)
// ═══════════════════════════════════════════════════════════════════════════════
describe('ProjectAnnouncementCard', () => {
  const projectAnnouncement: Announcement = {
    id: 'pa-1',
    title: 'Project Update',
    content: 'This is a project-specific announcement with important information for the team.',
    visibility: 'PUBLIC',
    isPinned: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    workspaceId: 'ws-1',
    projectId: 'p-1',
    project: null,
    createdById: 'u-1',
    createdBy: { id: 'u-1', name: 'Alice', image: 'https://example.com/alice.jpg' },
    targets: [
      { userId: 'u-1', user: { id: 'u-1', name: 'Alice', image: null } },
      { userId: 'u-2', user: { id: 'u-2', name: 'Bob', image: null } },
      { userId: 'u-3', user: { id: 'u-3', name: 'Charlie', image: null } },
      { userId: 'u-4', user: { id: 'u-4', name: 'Diana', image: null } },
      { userId: 'u-5', user: { id: 'u-5', name: 'Eve', image: null } },
    ],
  }

  const defaultProps = {
    announcement: projectAnnouncement,
    canManage: true,
    pinningId: null,
    deletingId: null,
    onTogglePin: vi.fn(),
    onDelete: vi.fn(),
    onOpen: vi.fn(),
    isArchived: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders announcement title', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    expect(screen.getByText('Project Update')).toBeInTheDocument()
  })

  it('renders announcement content', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    expect(screen.getByText(/This is a project-specific announcement/)).toBeInTheDocument()
  })

  it('calls onOpen when card clicked', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    fireEvent.click(screen.getByRole('article'))
    expect(defaultProps.onOpen).toHaveBeenCalledWith(projectAnnouncement)
  })

  it('shows PUBLIC visibility badge', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    expect(screen.getByText('Public')).toBeInTheDocument()
  })

  it('shows PRIVATE visibility badge', () => {
    const privateAnnouncement = { ...projectAnnouncement, visibility: 'PRIVATE' as const }
    render(<ProjectAnnouncementCard {...defaultProps} announcement={privateAnnouncement} />)
    expect(screen.getByText('Private')).toBeInTheDocument()
  })

  it('renders author avatar', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    expect(screen.getByTestId('author-avatar')).toBeInTheDocument()
    expect(screen.getAllByText('Alice').length).toBeGreaterThanOrEqual(1)
  })

  it('renders time ago text', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    expect(screen.getByText('3 days ago')).toBeInTheDocument()
  })

  it('shows "Click to read more" for long content', () => {
    const longContent = { ...projectAnnouncement, content: 'A'.repeat(250) }
    render(<ProjectAnnouncementCard {...defaultProps} announcement={longContent} />)
    expect(screen.getByText(/Click to read more/)).toBeInTheDocument()
  })

  it('hides "Click to read more" for short content', () => {
    const shortContent = { ...projectAnnouncement, content: 'Short' }
    render(<ProjectAnnouncementCard {...defaultProps} announcement={shortContent} />)
    expect(screen.queryByText(/Click to read more/)).not.toBeInTheDocument()
  })

  it('renders targets/recipients section', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    expect(screen.getAllByText('Alice').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('shows "+1 more" for more than 4 targets', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    expect(screen.getByText('+1 more')).toBeInTheDocument()
  })

  it('shows pin button when canManage and not archived', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    expect(screen.getByTestId('pin-icon')).toBeInTheDocument()
  })

  it('calls onTogglePin when pin button clicked', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    fireEvent.click(screen.getByTitle('Unpin'))
    expect(defaultProps.onTogglePin).toHaveBeenCalledWith('pa-1')
  })

  it('shows delete button when canManage and not archived', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    expect(screen.getByTestId('trash2-icon')).toBeInTheDocument()
  })

  it('calls onDelete when delete button clicked', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    fireEvent.click(screen.getByTitle('Delete'))
    expect(defaultProps.onDelete).toHaveBeenCalledWith('pa-1')
  })

  it('hides manage buttons when cannot manage', () => {
    render(<ProjectAnnouncementCard {...defaultProps} canManage={false} />)
    expect(screen.queryByTitle('Pin')).not.toBeInTheDocument()
    expect(screen.queryByTitle('Delete')).not.toBeInTheDocument()
  })

  it('hides manage buttons when archived', () => {
    render(<ProjectAnnouncementCard {...defaultProps} isArchived={true} />)
    expect(screen.queryByTitle('Pin')).not.toBeInTheDocument()
    expect(screen.queryByTitle('Delete')).not.toBeInTheDocument()
  })

  it('shows spinner when pinning', () => {
    render(<ProjectAnnouncementCard {...defaultProps} pinningId="pa-1" />)
    const pinButtons = screen.getAllByRole('button')
    const pinBtn = pinButtons.find(btn => btn.getAttribute('title') === 'Unpin')
    expect(pinBtn).toBeDisabled()
  })

  it('shows spinner when deleting', () => {
    render(<ProjectAnnouncementCard {...defaultProps} deletingId="pa-1" />)
    const deleteBtn = screen.getByTitle('Delete')
    expect(deleteBtn).toBeDisabled()
  })

  it('shows filled pin icon when pinned', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    expect(screen.getByTitle('Unpin')).toBeInTheDocument()
  })

  it('prevents event propagation on pin click', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    fireEvent.click(screen.getByTitle('Unpin'))
    expect(defaultProps.onOpen).not.toHaveBeenCalled()
  })

  it('prevents event propagation on delete click', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    fireEvent.click(screen.getByTitle('Delete'))
    expect(defaultProps.onOpen).not.toHaveBeenCalled()
  })
})
