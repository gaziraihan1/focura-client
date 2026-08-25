import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NotificationDropdown } from '@/components/dashboard/notifications/NotificationDropdown'

vi.mock('@/components/dashboard/notifications/NotificationDropdownHeader', () => ({
  NotificationDropdownHeader: (props: Record<string, unknown>) => (
    <div data-testid="dropdown-header">
      <span>Header</span>
      <span>Unread: {props.unreadCount}</span>
    </div>
  ),
}))

vi.mock('@/components/dashboard/notifications/NotificationLoadingState', () => ({
  NotificationLoadingState: () => <div data-testid="loading-state">Loading...</div>,
}))

vi.mock('@/components/shared/EmptyState', () => ({
  EmptyState: () => <div data-testid="empty-state">No notifications</div>,
}))

vi.mock('@/components/dashboard/notifications/NotificationListItem', () => ({
  NotificationListItem: (props: Record<string, unknown>) => (
    <div data-testid="notification-item">
      <span>{props.notification.title}</span>
    </div>
  ),
}))

vi.mock('@/components/dashboard/notifications/NotificationDropdownFooter', () => ({
  NotificationDropdownFooter: (props: Record<string, unknown>) => (
    <div data-testid="dropdown-footer">Footer</div>
  ),
}))

const mockNotifications = [
  { id: '1', title: 'Test 1', message: 'Message 1', read: false, createdAt: new Date().toISOString() },
  { id: '2', title: 'Test 2', message: 'Message 2', read: true, createdAt: new Date().toISOString() },
]

describe('NotificationDropdown', () => {
  it('renders dropdown header', () => {
    render(
      <NotificationDropdown
        notifications={mockNotifications}
        recentNotifications={mockNotifications}
        unreadCount={1}
        isLoading={false}
        isMarkingAllAsRead={false}
        formatTimeAgo={(d) => 'just now'}
        onNotificationClick={vi.fn()}
        onMarkAllAsRead={vi.fn()}
        onClose={vi.fn()}
      />
    )

    expect(screen.getByTestId('dropdown-header')).toBeInTheDocument()
  })

  it('shows loading state when loading', () => {
    render(
      <NotificationDropdown
        notifications={[]}
        recentNotifications={[]}
        unreadCount={0}
        isLoading={true}
        isMarkingAllAsRead={false}
        formatTimeAgo={(d) => 'just now'}
        onNotificationClick={vi.fn()}
        onMarkAllAsRead={vi.fn()}
        onClose={vi.fn()}
      />
    )

    expect(screen.getByTestId('loading-state')).toBeInTheDocument()
  })

  it('shows empty state when no notifications', () => {
    render(
      <NotificationDropdown
        notifications={[]}
        recentNotifications={[]}
        unreadCount={0}
        isLoading={false}
        isMarkingAllAsRead={false}
        formatTimeAgo={(d) => 'just now'}
        onNotificationClick={vi.fn()}
        onMarkAllAsRead={vi.fn()}
        onClose={vi.fn()}
      />
    )

    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('renders notification items', () => {
    render(
      <NotificationDropdown
        notifications={mockNotifications}
        recentNotifications={mockNotifications}
        unreadCount={1}
        isLoading={false}
        isMarkingAllAsRead={false}
        formatTimeAgo={(d) => 'just now'}
        onNotificationClick={vi.fn()}
        onMarkAllAsRead={vi.fn()}
        onClose={vi.fn()}
      />
    )

    const items = screen.getAllByTestId('notification-item')
    expect(items).toHaveLength(2)
  })

  it('renders footer when notifications exist', () => {
    render(
      <NotificationDropdown
        notifications={mockNotifications}
        recentNotifications={mockNotifications}
        unreadCount={1}
        isLoading={false}
        isMarkingAllAsRead={false}
        formatTimeAgo={(d) => 'just now'}
        onNotificationClick={vi.fn()}
        onMarkAllAsRead={vi.fn()}
        onClose={vi.fn()}
      />
    )

    expect(screen.getByTestId('dropdown-footer')).toBeInTheDocument()
  })

  it('does not render footer when no notifications', () => {
    render(
      <NotificationDropdown
        notifications={[]}
        recentNotifications={[]}
        unreadCount={0}
        isLoading={false}
        isMarkingAllAsRead={false}
        formatTimeAgo={(d) => 'just now'}
        onNotificationClick={vi.fn()}
        onMarkAllAsRead={vi.fn()}
        onClose={vi.fn()}
      />
    )

    expect(screen.queryByTestId('dropdown-footer')).not.toBeInTheDocument()
  })
})
