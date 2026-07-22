import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NotificationsPageHeader } from '@/components/Dashboard/Notifications/NotificationsPageHeader'

vi.mock('lucide-react', () => ({
  Bell: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  CheckCheck: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  Trash2: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  Loader2: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
}))

describe('NotificationsPageHeader', () => {
  it('renders the title', () => {
    render(
      <NotificationsPageHeader
        unreadCount={0}
        hasReadNotifications={false}
        isMarkingAllAsRead={false}
        isDeletingAllRead={false}
        onMarkAllAsRead={vi.fn()}
        onDeleteAllRead={vi.fn()}
      />
    )
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  it('shows unread count badge when unread > 0', () => {
    render(
      <NotificationsPageHeader
        unreadCount={5}
        hasReadNotifications={false}
        isMarkingAllAsRead={false}
        isDeletingAllRead={false}
        onMarkAllAsRead={vi.fn()}
        onDeleteAllRead={vi.fn()}
      />
    )
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows mark all as read button when unread > 0', () => {
    render(
      <NotificationsPageHeader
        unreadCount={3}
        hasReadNotifications={false}
        isMarkingAllAsRead={false}
        isDeletingAllRead={false}
        onMarkAllAsRead={vi.fn()}
        onDeleteAllRead={vi.fn()}
      />
    )
    expect(screen.getByText('Mark all as read')).toBeInTheDocument()
  })

  it('does not show mark all as read when no unread', () => {
    render(
      <NotificationsPageHeader
        unreadCount={0}
        hasReadNotifications={false}
        isMarkingAllAsRead={false}
        isDeletingAllRead={false}
        onMarkAllAsRead={vi.fn()}
        onDeleteAllRead={vi.fn()}
      />
    )
    expect(screen.queryByText('Mark all as read')).not.toBeInTheDocument()
  })

  it('shows clear read button when has read notifications', () => {
    render(
      <NotificationsPageHeader
        unreadCount={0}
        hasReadNotifications={true}
        isMarkingAllAsRead={false}
        isDeletingAllRead={false}
        onMarkAllAsRead={vi.fn()}
        onDeleteAllRead={vi.fn()}
      />
    )
    expect(screen.getByText('Clear read')).toBeInTheDocument()
  })

  it('calls onMarkAllAsRead when button is clicked', () => {
    const onMarkAllAsRead = vi.fn()
    render(
      <NotificationsPageHeader
        unreadCount={3}
        hasReadNotifications={false}
        isMarkingAllAsRead={false}
        isDeletingAllRead={false}
        onMarkAllAsRead={onMarkAllAsRead}
        onDeleteAllRead={vi.fn()}
      />
    )
    fireEvent.click(screen.getByText('Mark all as read'))
    expect(onMarkAllAsRead).toHaveBeenCalled()
  })

  it('calls onDeleteAllRead when clear read is clicked', () => {
    const onDeleteAllRead = vi.fn()
    render(
      <NotificationsPageHeader
        unreadCount={0}
        hasReadNotifications={true}
        isMarkingAllAsRead={false}
        isDeletingAllRead={false}
        onMarkAllAsRead={vi.fn()}
        onDeleteAllRead={onDeleteAllRead}
      />
    )
    fireEvent.click(screen.getByText('Clear read'))
    expect(onDeleteAllRead).toHaveBeenCalled()
  })
})
