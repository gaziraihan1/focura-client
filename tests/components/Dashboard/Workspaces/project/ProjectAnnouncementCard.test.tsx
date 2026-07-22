import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
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

vi.mock('@/components/Dashboard/Workspaces/project/Announcements/AuthorAvatar', () => ({
  AuthorAvatar: ({ author }: Record<string, unknown>) => <div data-testid="author-avatar">{author?.name ?? 'Unknown'}</div>,
}))

vi.mock('@/app/(dashboard-pages)/dashboard/workspaces/[workspaceSlug]/projects/[projectSlug]/announcements/page', () => ({
  timeAgo: () => '3 days ago',
  formatFullDate: (date: string) => new Date(date).toLocaleString(),
  initials: (name?: string | null) => name ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '??',
}))

vi.mock('@/utils/announcement.utils', () => ({
  stripTokens: (raw: string) => raw,
}))

import { AnnouncementCard as ProjectAnnouncementCard } from '@/components/Dashboard/Workspaces/project/Announcements/AnnouncementCard'
import type { Announcement } from '@/types/announcement.types'

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
    fireEvent.click(screen.getByRole('button', { name: /open announcement/i }))
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
    fireEvent.click(screen.getByRole('button', { name: /unpin announcement/i }))
    expect(defaultProps.onTogglePin).toHaveBeenCalledWith('pa-1')
  })

  it('shows delete button when canManage and not archived', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    expect(screen.getByTestId('trash2-icon')).toBeInTheDocument()
  })

  it('calls onDelete when delete button clicked', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /delete announcement/i }))
    expect(defaultProps.onDelete).toHaveBeenCalledWith('pa-1')
  })

  it('hides manage buttons when cannot manage', () => {
    render(<ProjectAnnouncementCard {...defaultProps} canManage={false} />)
    expect(screen.queryByRole('button', { name: /pin/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
  })

  it('hides manage buttons when archived', () => {
    render(<ProjectAnnouncementCard {...defaultProps} isArchived={true} />)
    expect(screen.queryByRole('button', { name: /pin/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
  })

  it('shows spinner when pinning', () => {
    render(<ProjectAnnouncementCard {...defaultProps} pinningId="pa-1" />)
    const pinBtn = screen.getByRole('button', { name: /unpin announcement/i })
    expect(pinBtn).toBeDisabled()
  })

  it('shows spinner when deleting', () => {
    render(<ProjectAnnouncementCard {...defaultProps} deletingId="pa-1" />)
    const deleteBtn = screen.getByRole('button', { name: /delete announcement/i })
    expect(deleteBtn).toBeDisabled()
  })

  it('shows filled pin icon when pinned', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    expect(screen.getByRole('button', { name: /unpin announcement/i })).toBeInTheDocument()
  })

  it('prevents event propagation on pin click', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /unpin announcement/i }))
    expect(defaultProps.onOpen).not.toHaveBeenCalled()
  })

  it('prevents event propagation on delete click', () => {
    render(<ProjectAnnouncementCard {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /delete announcement/i }))
    expect(defaultProps.onOpen).not.toHaveBeenCalled()
  })
})
