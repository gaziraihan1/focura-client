import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
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
    Megaphone: mock('megaphone'),
    Pin: mock('pin'),
    Trash2: mock('trash2'),
  }
})

vi.mock('@/components/Dashboard/Workspaces/Announcement/AnnouncementCard', () => ({
  AnnouncementCard: (props: any) => <div data-testid="announcement-card" {...props} />,
}))

vi.mock('@/components/Dashboard/Workspaces/Announcement/AnnouncementDetailModal', () => ({
  AnnouncementDetailModal: (props: any) => <div data-testid="announcement-detail-modal" {...props} />,
}))

vi.mock('@/components/Shared/Pagination', () => ({
  Pagination: (props: any) => <div data-testid="pagination" {...props} />,
}))

import { AnnouncementList } from '@/components/Dashboard/Workspaces/Announcement/AnnouncementList'
import type { Announcement, AnnouncementPagination } from '@/types/announcement.types'

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
