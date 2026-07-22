import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

// ─── NotificationsEmptyState ─────────────────────────────────────────────────
import { NotificationsEmptyState } from '@/components/Dashboard/Notifications/NotificationsEmptyState'

describe('NotificationsEmptyState', () => {
  it('renders the empty state message', () => {
    render(<NotificationsEmptyState />)
    expect(screen.getByText('No notifications yet')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<NotificationsEmptyState />)
    expect(screen.getByText(/We'll notify you when something important happens/)).toBeInTheDocument()
  })
})

// ─── EndOfListMessage ────────────────────────────────────────────────────────
import { EndOfListMessage } from '@/components/Dashboard/Notifications/EndOfListMessage'

describe('EndOfListMessage', () => {
  it('renders the message when show is true', () => {
    render(<EndOfListMessage show={true} />)
    expect(screen.getByText("You've reached the end of your notifications")).toBeInTheDocument()
  })

  it('renders nothing when show is false', () => {
    const { container } = render(<EndOfListMessage show={false} />)
    expect(container.innerHTML).toBe('')
  })
})

// ─── NotificationsLoadingState ───────────────────────────────────────────────
import { NotificationsLoadingState } from '@/components/Dashboard/Notifications/NotificationsLoadingState'

describe('NotificationsLoadingState', () => {
  it('renders 5 loading placeholders', () => {
    const { container } = render(<NotificationsLoadingState />)
    const placeholders = container.querySelectorAll('.animate-pulse')
    expect(placeholders.length).toBe(5)
  })
})

// ─── LoadMoreButton ──────────────────────────────────────────────────────────
import { LoadMoreButton } from '@/components/Dashboard/Notifications/LoadMoreButton'

describe('LoadMoreButton', () => {
  it('renders nothing when hasNextPage is false', () => {
    const { container } = render(<LoadMoreButton hasNextPage={false} isFetchingNextPage={false} onLoadMore={vi.fn()} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders Load More button when hasNextPage is true', () => {
    render(<LoadMoreButton hasNextPage={true} isFetchingNextPage={false} onLoadMore={vi.fn()} />)
    expect(screen.getByText('Load More')).toBeInTheDocument()
  })

  it('calls onLoadMore when clicked', () => {
    const onLoadMore = vi.fn()
    render(<LoadMoreButton hasNextPage={true} isFetchingNextPage={false} onLoadMore={onLoadMore} />)
    fireEvent.click(screen.getByText('Load More'))
    expect(onLoadMore).toHaveBeenCalledOnce()
  })

  it('shows loading text when fetching', () => {
    render(<LoadMoreButton hasNextPage={true} isFetchingNextPage={true} onLoadMore={vi.fn()} />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('disables button when fetching', () => {
    render(<LoadMoreButton hasNextPage={true} isFetchingNextPage={true} onLoadMore={vi.fn()} />)
    expect(screen.getByText('Loading...').closest('button')).toBeDisabled()
  })
})

// ─── NotificationsPageHeader ─────────────────────────────────────────────────
import { NotificationsPageHeader } from '@/components/Dashboard/Notifications/NotificationsPageHeader'

describe('NotificationsPageHeader', () => {
  const defaultProps = {
    unreadCount: 0,
    hasReadNotifications: false,
    isMarkingAllAsRead: false,
    isDeletingAllRead: false,
    onMarkAllAsRead: vi.fn(),
    onDeleteAllRead: vi.fn(),
  }

  it('renders the heading', () => {
    render(<NotificationsPageHeader {...defaultProps} />)
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  it('shows unread count badge when > 0', () => {
    render(<NotificationsPageHeader {...defaultProps} unreadCount={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('hides unread count badge when 0', () => {
    render(<NotificationsPageHeader {...defaultProps} unreadCount={0} />)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('shows Mark all as read button when unread > 0', () => {
    render(<NotificationsPageHeader {...defaultProps} unreadCount={3} />)
    expect(screen.getByText('Mark all as read')).toBeInTheDocument()
  })

  it('hides Mark all as read button when unread is 0', () => {
    render(<NotificationsPageHeader {...defaultProps} unreadCount={0} />)
    expect(screen.queryByText('Mark all as read')).not.toBeInTheDocument()
  })

  it('calls onMarkAllAsRead when button is clicked', () => {
    const onMarkAllAsRead = vi.fn()
    render(<NotificationsPageHeader {...defaultProps} unreadCount={3} onMarkAllAsRead={onMarkAllAsRead} />)
    fireEvent.click(screen.getByText('Mark all as read'))
    expect(onMarkAllAsRead).toHaveBeenCalledOnce()
  })

  it('shows Clear read button when hasReadNotifications is true', () => {
    render(<NotificationsPageHeader {...defaultProps} hasReadNotifications={true} />)
    expect(screen.getByText('Clear read')).toBeInTheDocument()
  })

  it('hides Clear read button when hasReadNotifications is false', () => {
    render(<NotificationsPageHeader {...defaultProps} hasReadNotifications={false} />)
    expect(screen.queryByText('Clear read')).not.toBeInTheDocument()
  })

  it('calls onDeleteAllRead when Clear read is clicked', () => {
    const onDeleteAllRead = vi.fn()
    render(<NotificationsPageHeader {...defaultProps} hasReadNotifications={true} onDeleteAllRead={onDeleteAllRead} />)
    fireEvent.click(screen.getByText('Clear read'))
    expect(onDeleteAllRead).toHaveBeenCalledOnce()
  })

  it('disables Mark all as read when loading', () => {
    render(<NotificationsPageHeader {...defaultProps} unreadCount={3} isMarkingAllAsRead={true} />)
    expect(screen.getByText('Mark all as read').closest('button')).toBeDisabled()
  })

  it('disables Clear read when loading', () => {
    render(<NotificationsPageHeader {...defaultProps} hasReadNotifications={true} isDeletingAllRead={true} />)
    expect(screen.getByText('Clear read').closest('button')).toBeDisabled()
  })
})

// ─── NotificationItem ────────────────────────────────────────────────────────
import { NotificationItem } from '@/components/Dashboard/Notifications/NotificationItem'

describe('NotificationItem', () => {
  const mockNotification = {
    id: '1',
    title: 'New comment on task',
    message: 'Alice commented on your task',
    read: false,
    createdAt: new Date().toISOString(),
    sender: { id: 'u1', name: 'Alice', email: 'alice@test.com' },
  }

  it('renders the notification title', () => {
    render(<NotificationItem notification={mockNotification} onClick={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('New comment on task')).toBeInTheDocument()
  })

  it('renders the notification message', () => {
    render(<NotificationItem notification={mockNotification} onClick={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Alice commented on your task')).toBeInTheDocument()
  })

  it('renders the sender name', () => {
    render(<NotificationItem notification={mockNotification} onClick={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/from Alice/)).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<NotificationItem notification={mockNotification} onClick={onClick} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByText('New comment on task'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn()
    render(<NotificationItem notification={mockNotification} onClick={vi.fn()} onDelete={onDelete} />)
    fireEvent.click(screen.getByTitle('Delete notification'))
    expect(onDelete).toHaveBeenCalledOnce()
  })

  it('applies unread styling when not read', () => {
    const { container } = render(<NotificationItem notification={mockNotification} onClick={vi.fn()} onDelete={vi.fn()} />)
    const button = container.querySelector('[role="button"]')
    expect(button?.className).toContain('bg-accent/30')
  })

  it('applies read styling when read', () => {
    const readNotification = { ...mockNotification, read: true }
    const { container } = render(<NotificationItem notification={readNotification} onClick={vi.fn()} onDelete={vi.fn()} />)
    const button = container.querySelector('[role="button"]')
    expect(button?.className).toContain('bg-card')
  })

  it('shows unread dot when not read', () => {
    const { container } = render(<NotificationItem notification={mockNotification} onClick={vi.fn()} onDelete={vi.fn()} />)
    const dot = container.querySelector('.bg-primary.rounded-full')
    expect(dot).toBeInTheDocument()
  })

  it('hides unread dot when read', () => {
    const readNotification = { ...mockNotification, read: true }
    const { container } = render(<NotificationItem notification={readNotification} onClick={vi.fn()} onDelete={vi.fn()} />)
    const dot = container.querySelector('.bg-primary.rounded-full')
    expect(dot).not.toBeInTheDocument()
  })

  it('renders without sender when sender is null', () => {
    const noSenderNotification = { ...mockNotification, sender: null }
    render(<NotificationItem notification={noSenderNotification} onClick={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByText(/from/)).not.toBeInTheDocument()
  })
})
