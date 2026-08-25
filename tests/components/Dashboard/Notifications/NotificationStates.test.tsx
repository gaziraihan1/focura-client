import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { EmptyState } from '@/components/shared/EmptyState'
import { Bell } from 'lucide-react'
import { NotificationsLoadingState } from '@/components/dashboard/notifications/NotificationsLoadingState'
import { EndOfListMessage } from '@/components/dashboard/notifications/EndOfListMessage'
import { NotificationsPageHeader } from '@/components/dashboard/notifications/NotificationsPageHeader'

describe('NotificationsEmptyState', () => {
  it('renders "No notifications yet" text', () => {
    render(
      <EmptyState
        icon={Bell}
        title="No notifications yet"
        description="We'll notify you when something important happens."
      />
    )
    expect(screen.getByText('No notifications yet')).toBeInTheDocument()
  })

  it('shows secondary message', () => {
    render(
      <EmptyState
        icon={Bell}
        title="No notifications yet"
        description="We'll notify you when something important happens."
      />
    )
    expect(screen.getByText(/something important happens/)).toBeInTheDocument()
  })
})

describe('NotificationsLoadingState', () => {
  it('renders 5 loading placeholders', () => {
    const { container } = render(<NotificationsLoadingState />)
    const placeholders = container.querySelectorAll('.animate-pulse')
    expect(placeholders.length).toBe(5)
  })
})

describe('EndOfListMessage', () => {
  it('renders nothing when show=false', () => {
    const { container } = render(<EndOfListMessage show={false} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders end message when show=true', () => {
    render(<EndOfListMessage show={true} />)
    expect(screen.getByText(/reached the end of your notifications/)).toBeInTheDocument()
  })
})

describe('NotificationsPageHeader', () => {
  const defaultProps = {
    unreadCount: 0,
    hasReadNotifications: false,
    isMarkingAllAsRead: false,
    isDeletingAllRead: false,
    onMarkAllAsRead: vi.fn(),
    onDeleteAllRead: vi.fn(),
  }

  it('renders "Notifications" heading', () => {
    render(<NotificationsPageHeader {...defaultProps} />)
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  it('shows unread count badge when unreadCount > 0', () => {
    render(<NotificationsPageHeader {...defaultProps} unreadCount={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows Mark all as read button when unreadCount > 0', () => {
    render(<NotificationsPageHeader {...defaultProps} unreadCount={3} />)
    expect(screen.getByRole('button', { name: /mark all as read/i })).toBeInTheDocument()
  })

  it('shows Clear read button when hasReadNotifications=true', () => {
    render(<NotificationsPageHeader {...defaultProps} hasReadNotifications={true} />)
    expect(screen.getByRole('button', { name: /clear read/i })).toBeInTheDocument()
  })

  it('calls onMarkAllAsRead when button clicked', async () => {
    const user = userEvent.setup()
    const onMarkAllAsRead = vi.fn()
    render(<NotificationsPageHeader {...defaultProps} unreadCount={1} onMarkAllAsRead={onMarkAllAsRead} />)
    await user.click(screen.getByRole('button', { name: /mark all as read/i }))
    expect(onMarkAllAsRead).toHaveBeenCalledTimes(1)
  })

  it('calls onDeleteAllRead when button clicked', async () => {
    const user = userEvent.setup()
    const onDeleteAllRead = vi.fn()
    render(<NotificationsPageHeader {...defaultProps} hasReadNotifications={true} onDeleteAllRead={onDeleteAllRead} />)
    await user.click(screen.getByRole('button', { name: /clear read/i }))
    expect(onDeleteAllRead).toHaveBeenCalledTimes(1)
  })
})
