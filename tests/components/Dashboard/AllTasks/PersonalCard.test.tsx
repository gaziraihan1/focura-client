import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
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

vi.mock('date-fns', () => ({
  formatDistanceToNow: () => '3 days ago',
  format: () => 'Jan 15, 2025',
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

vi.mock('@/components/Dashboard/AllTasks/TaskQouta/StartPill', () => ({
  StatPill: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="stat-pill" {...props} />,
}))

vi.mock('@/components/Dashboard/AllTasks/TaskQouta/ProgressRing', () => ({
  ProgressRing: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="progress-ring" {...props} />,
}))

vi.mock('@/components/Dashboard/AllTasks/TaskQouta/MemberRow', () => ({
  MemberRow: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="member-row" {...props} />,
}))

vi.mock('@/components/Dashboard/AllTasks/TaskQouta/QoutaSkeleton', () => ({
  QuotaSkeleton: () => <div data-testid="quota-skeleton" />,
}))

import { PersonalCard } from '@/components/Dashboard/AllTasks/TaskQouta/PersonalCard'
import type { PersonalQuotaInfo } from '@/hooks/useTask'

const mockPersonalQuota: PersonalQuotaInfo = {
  plan: 'FREE',
  dailyLimit: 10,
  usedToday: 7,
  remaining: 3,
  resetAt: new Date(Date.now() + 3600000).toISOString(),
  perMinuteLimit: 5,
}

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
