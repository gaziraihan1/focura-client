import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NotificationListItem } from '@/components/Notifications/NotificationListItem'

const mockNotification = {
  id: 'notif-1',
  title: 'Task Assigned',
  message: 'You have been assigned a new task',
  read: false,
  createdAt: '2025-07-13T10:00:00.000Z',
}

describe('NotificationListItem', () => {
  it('renders notification title', () => {
    render(
      <NotificationListItem
        notification={mockNotification}
        formatTimeAgo={(d) => 'just now'}
        onClick={vi.fn()}
      />
    )

    expect(screen.getByText('Task Assigned')).toBeInTheDocument()
  })

  it('renders notification message', () => {
    render(
      <NotificationListItem
        notification={mockNotification}
        formatTimeAgo={(d) => 'just now'}
        onClick={vi.fn()}
      />
    )

    expect(screen.getByText('You have been assigned a new task')).toBeInTheDocument()
  })

  it('renders formatted time', () => {
    render(
      <NotificationListItem
        notification={mockNotification}
        formatTimeAgo={(d) => '5m ago'}
        onClick={vi.fn()}
      />
    )

    expect(screen.getByText('5m ago')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(
      <NotificationListItem
        notification={mockNotification}
        formatTimeAgo={(d) => 'just now'}
        onClick={onClick}
      />
    )

    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })

  it('shows unread indicator for unread notifications', () => {
    render(
      <NotificationListItem
        notification={{ ...mockNotification, read: false }}
        formatTimeAgo={(d) => 'just now'}
        onClick={vi.fn()}
      />
    )

    // The unread indicator is a small dot
    const dot = document.querySelector('.bg-primary')
    expect(dot).toBeInTheDocument()
  })

  it('does not show unread indicator for read notifications', () => {
    render(
      <NotificationListItem
        notification={{ ...mockNotification, read: true }}
        formatTimeAgo={(d) => 'just now'}
        onClick={vi.fn()}
      />
    )

    // Should not have the unread dot
    const buttons = screen.getAllByRole('button')
    const listItem = buttons[0]
    expect(listItem.querySelector('.bg-primary')).not.toBeInTheDocument()
  })

  it('applies different background for unread', () => {
    const { container } = render(
      <NotificationListItem
        notification={{ ...mockNotification, read: false }}
        formatTimeAgo={(d) => 'just now'}
        onClick={vi.fn()}
      />
    )

    expect(container.querySelector('.bg-accent\\/30')).toBeInTheDocument()
  })
})
