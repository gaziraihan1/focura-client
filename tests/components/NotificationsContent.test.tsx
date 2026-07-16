import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NotificationsContent } from '@/components/Dashboard/Notifications/NotificationsContent'

vi.mock('@/components/Dashboard/Notifications/NotificationsList', () => ({
  NotificationsList: (props: any) => (
    <div data-testid="notifications-list">
      {props.notifications?.length || 0} notifications
    </div>
  ),
}))

vi.mock('@/components/Dashboard/Notifications/NotificationsEmptyState', () => ({
  NotificationsEmptyState: () => <div data-testid="empty-state">No notifications</div>,
}))

vi.mock('@/components/Dashboard/Notifications/NotificationsLoadingState', () => ({
  NotificationsLoadingState: () => <div data-testid="loading-state">Loading...</div>,
}))

vi.mock('lucide-react', () => ({
  Bell: (props: any) => <svg {...props} />,
  Trash2: (props: any) => <svg {...props} />,
}))

describe('NotificationsContent', () => {
  it('shows loading state when loading', () => {
    render(
      <NotificationsContent
        notifications={[]}
        isLoading={true}
        onLoadMore={vi.fn()}
        hasMore={false}
        onDeleteAll={vi.fn()}
      />
    )
    expect(screen.getByTestId('loading-state')).toBeInTheDocument()
  })

  it('shows empty state when no notifications', () => {
    render(
      <NotificationsContent
        notifications={[]}
        isLoading={false}
        onLoadMore={vi.fn()}
        hasMore={false}
        onDeleteAll={vi.fn()}
      />
    )
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('renders notifications list when data exists', () => {
    render(
      <NotificationsContent
        notifications={[{ id: '1', title: 'Test' } as any]}
        isLoading={false}
        onLoadMore={vi.fn()}
        hasMore={false}
        onDeleteAll={vi.fn()}
      />
    )
    expect(screen.getByTestId('notifications-list')).toBeInTheDocument()
  })
})
