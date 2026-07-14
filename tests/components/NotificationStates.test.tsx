import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NotificationEmptyState } from '@/components/Notifications/NotificationEmptyState'
import { NotificationLoadingState } from '@/components/Notifications/NotificationLoadingState'
import { NotificationDropdownFooter } from '@/components/Notifications/NotificationDropdownFooter'
import { NotificationDropdownHeader } from '@/components/Notifications/NotificationDropdownHeader'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('Notification States', () => {
  describe('NotificationEmptyState', () => {
    it('renders no notifications message', () => {
      render(<NotificationEmptyState />)
      expect(screen.getByText('No notifications yet')).toBeInTheDocument()
    })

    it('renders helper text', () => {
      render(<NotificationEmptyState />)
      expect(screen.getByText(/We'll notify you when something happens/)).toBeInTheDocument()
    })
  })

  describe('NotificationLoadingState', () => {
    it('renders three skeleton items', () => {
      const { container } = render(<NotificationLoadingState />)
      const skeletonItems = container.querySelectorAll('.animate-pulse')
      expect(skeletonItems.length).toBe(3)
    })
  })

  describe('NotificationDropdownFooter', () => {
    it('renders view all link', () => {
      const onClose = vi.fn()
      render(<NotificationDropdownFooter onClose={onClose} />)
      const link = screen.getByText('View all notifications')
      expect(link).toHaveAttribute('href', '/dashboard/notifications')
    })

    it('calls onClose when link is clicked', () => {
      const onClose = vi.fn()
      render(<NotificationDropdownFooter onClose={onClose} />)
      fireEvent.click(screen.getByText('View all notifications'))
      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('NotificationDropdownHeader', () => {
    it('renders notifications heading', () => {
      render(
        <NotificationDropdownHeader
          unreadCount={0}
          isMarkingAllAsRead={false}
          onMarkAllAsRead={vi.fn()}
        />
      )
      expect(screen.getByText('Notifications')).toBeInTheDocument()
    })

    it('shows unread count when greater than 0', () => {
      render(
        <NotificationDropdownHeader
          unreadCount={5}
          isMarkingAllAsRead={false}
          onMarkAllAsRead={vi.fn()}
        />
      )
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('does not show unread count when 0', () => {
      render(
        <NotificationDropdownHeader
          unreadCount={0}
          isMarkingAllAsRead={false}
          onMarkAllAsRead={vi.fn()}
        />
      )
      expect(screen.queryByText('0')).not.toBeInTheDocument()
    })

    it('shows mark all read button when unread > 0', () => {
      render(
        <NotificationDropdownHeader
          unreadCount={3}
          isMarkingAllAsRead={false}
          onMarkAllAsRead={vi.fn()}
        />
      )
      expect(screen.getByText('Mark all read')).toBeInTheDocument()
    })

    it('does not show mark all read button when unread = 0', () => {
      render(
        <NotificationDropdownHeader
          unreadCount={0}
          isMarkingAllAsRead={false}
          onMarkAllAsRead={vi.fn()}
        />
      )
      expect(screen.queryByText('Mark all read')).not.toBeInTheDocument()
    })

    it('calls onMarkAllAsRead when button is clicked', () => {
      const onMarkAllAsRead = vi.fn()
      render(
        <NotificationDropdownHeader
          unreadCount={2}
          isMarkingAllAsRead={false}
          onMarkAllAsRead={onMarkAllAsRead}
        />
      )
      fireEvent.click(screen.getByText('Mark all read'))
      expect(onMarkAllAsRead).toHaveBeenCalled()
    })

    it('disables button when isMarkingAllAsRead is true', () => {
      render(
        <NotificationDropdownHeader
          unreadCount={2}
          isMarkingAllAsRead={true}
          onMarkAllAsRead={vi.fn()}
        />
      )
      expect(screen.getByText('Mark all read')).toBeDisabled()
    })
  })
})
