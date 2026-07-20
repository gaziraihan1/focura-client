import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

vi.mock('lucide-react', () => {
  const React = require('react')
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

import { TimeSummaryCard } from '@/components/Dashboard/Workspaces/Analytics/TimeSummaryCard'
import type { TimeSummary } from '@/hooks/useAnalytics'

const mockTimeSummaryData: TimeSummary = {
  totalHours: 120.5,
  avgHoursPerMember: 15.1,
  projectBreakdown: [
    { projectId: 'p-1', projectName: 'Project Alpha', hours: 50.5 },
    { projectId: 'p-2', projectName: 'Project Beta', hours: 35.0 },
    { projectId: 'p-3', projectName: 'Project Gamma', hours: 35.0 },
  ],
}

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
