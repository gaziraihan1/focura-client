import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...props} />,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/dashboard/workspaces/test-ws/projects/test-proj/tasks',
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

vi.mock('lucide-react', () => {

  const mock = (name: string) => {
    const Cmp = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': `${name}-icon`, ...props })
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
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  BarChart: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="bar-chart" {...props} />,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
  PieChart: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="pie-chart" {...props} />,
  Pie: () => null,
  Cell: () => null,
  LineChart: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="line-chart" {...props} />,
  Line: () => null,
  Legend: () => null,
  AreaChart: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="area-chart" {...props} />,
  Area: () => null,
  RadarChart: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="radar-chart" {...props} />,
  Radar: () => null,
  PolarGrid: () => null,
  PolarAngleAxis: () => null,
  PolarRadiusAxis: () => null,
}))

import { KPICards } from '@/components/Dashboard/Workspaces/Analytics/KPICards'
import type { ExecutiveKPIs } from '@/hooks/useAnalytics'

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
