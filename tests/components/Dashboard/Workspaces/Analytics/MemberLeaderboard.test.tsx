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

import { MemberLeaderboard } from '@/components/Dashboard/Workspaces/Analytics/MemberLeaderboard'
import type { MemberContribution } from '@/hooks/useAnalytics'

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
    expect(screen.getByText('BS')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(<MemberLeaderboard data={[]} />)
    expect(screen.getByText('No team members yet')).toBeInTheDocument()
  })
})
