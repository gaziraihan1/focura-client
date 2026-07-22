import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

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

vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name }: { name: string }) => <div data-testid="avatar">{name}</div>,
}))

import { WorkspaceCard } from '@/components/Dashboard/AllTasks/TaskQouta/WorkspaceCard'
import type { WorkspaceQuotaInfo } from '@/hooks/useTask'

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
    expect(screen.getByText('2')).toBeInTheDocument()
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
