import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('lucide-react', () => {
  const mock = (name: string) => {
    const Cmp = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': `${name}-icon`, ...props })
    Cmp.displayName = name
    return Cmp
  }
  return {
    Loader2: mock('loader2'),
    Pin: mock('pin'),
    PinOff: mock('pin-off'),
    Trash2: mock('trash2'),
  }
})

vi.mock('@/components/dashboard/workspace/project-overview/Announcements/AuthorAvatar', () => ({
  AuthorAvatar: ({ author }: Record<string, unknown>) => <div data-testid="author-avatar">{author?.name ?? 'Unknown'}</div>,
}))

vi.mock('@/app/(dashboard-pages)/dashboard/workspaces/[workspaceSlug]/projects/[projectSlug]/announcements/utils', () => ({
  timeAgo: () => '3 days ago',
  formatFullDate: (date: string) => new Date(date).toLocaleString(),
  initials: (name?: string | null) => name ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '??',
}))

vi.mock('@/utils/announcement.utils', () => ({
  stripTokens: (raw: string) => raw,
}))

import { PinnedBanner } from '@/components/dashboard/workspace/project-overview/Announcements/PinnedBanner'
import type { Announcement } from '@/types/announcement.types'

const baseAnnouncement: Announcement = {
  id: 'pa-1',
  title: 'Pinned Update',
  content: 'Pinned announcement content.',
  visibility: 'PUBLIC',
  isPinned: true,
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-01-15T10:00:00Z',
  workspaceId: 'ws-1',
  projectId: 'p-1',
  project: null,
  createdById: 'u-1',
  createdBy: { id: 'u-1', name: 'Alice', image: null },
  targets: [],
}

const defaultProps = {
  announcements: [baseAnnouncement],
  canManage: true,
  pinningId: null,
  deletingId: null,
  onTogglePin: vi.fn(),
  onDelete: vi.fn(),
  isArchived: false,
}

describe('PinnedBanner', () => {
  it('renders nothing when there are no pinned announcements', () => {
    const { container } = render(
      <PinnedBanner {...defaultProps} announcements={[{ ...baseAnnouncement, isPinned: false }]} />
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders pinned announcement title and time', () => {
    render(<PinnedBanner {...defaultProps} />)
    expect(screen.getByText('Pinned Update')).toBeInTheDocument()
    expect(screen.getByText('3 days ago')).toBeInTheDocument()
  })

  it('shows Edited chip when updatedAt is later than createdAt', () => {
    render(
      <PinnedBanner
        {...defaultProps}
        announcements={[{ ...baseAnnouncement, updatedAt: '2025-01-18T10:00:00Z' }]}
      />
    )
    expect(screen.getByText('Edited')).toBeInTheDocument()
  })

  it('hides Edited chip when not edited', () => {
    render(<PinnedBanner {...defaultProps} />)
    expect(screen.queryByText('Edited')).not.toBeInTheDocument()
  })

  it('shows unpin and delete buttons when canManage and not archived', () => {
    render(<PinnedBanner {...defaultProps} />)
    expect(screen.getByTestId('pin-off-icon')).toBeInTheDocument()
    expect(screen.getByTestId('trash2-icon')).toBeInTheDocument()
  })

  it('hides buttons when archived', () => {
    render(<PinnedBanner {...defaultProps} isArchived={true} />)
    expect(screen.queryByTestId('pin-off-icon')).not.toBeInTheDocument()
    expect(screen.queryByTestId('trash2-icon')).not.toBeInTheDocument()
  })

  it('calls onTogglePin and onDelete', () => {
    render(<PinnedBanner {...defaultProps} />)
    fireEvent.click(screen.getByTestId('pin-off-icon'))
    expect(defaultProps.onTogglePin).toHaveBeenCalledWith('pa-1')
    fireEvent.click(screen.getByTestId('trash2-icon'))
    expect(defaultProps.onDelete).toHaveBeenCalledWith('pa-1')
  })
})
