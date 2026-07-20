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

vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name }: { name: string }) => <div data-testid="avatar">{name}</div>,
}))

import { WorkloadChart } from '@/components/Dashboard/Workspaces/Analytics/WorkloadChart'
import type { WorkloadMember } from '@/hooks/useAnalytics'

const mockWorkloadData: WorkloadMember[] = [
  { userId: 'u-1', userName: 'Alice Johnson', userEmail: 'alice@test.com', assignedTasks: 12, status: 'high' },
  { userId: 'u-2', userName: 'Bob Smith', userEmail: 'bob@test.com', assignedTasks: 5, status: 'normal' },
  { userId: 'u-3', userName: null, userEmail: 'charlie@test.com', assignedTasks: 18, status: 'overloaded' },
]

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
    expect(screen.getByText('BS')).toBeInTheDocument()
  })
})
