import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useNotificationsPage } from '@/hooks/useNotificationsPage'

const mocks = vi.hoisted(() => ({
  markAsRead: vi.fn(),
  markAllAsRead: vi.fn(),
  deleteAllRead: vi.fn(),
  deleteNotification: vi.fn(),
  push: vi.fn(),
  notifications: [] as Array<{
    id: string
    title: string
    message: string
    read: boolean
    createdAt: string
    actionUrl?: string | null
    sender?: { id: string; name: string; email: string } | null
  }>,
}))

vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: () => ({
    notifications: mocks.notifications,
    isLoading: false,
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: vi.fn(),
    unreadCount: 3,
    markAsRead: mocks.markAsRead,
    markAllAsRead: mocks.markAllAsRead,
    deleteNotification: mocks.deleteNotification,
    deleteAllRead: mocks.deleteAllRead,
    isMarkingAllAsRead: false,
    isDeletingAllRead: false,
  }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push, replace: vi.fn() }),
}))

const baseNotification = {
  id: 'n1',
  title: 'New task',
  message: 'You were assigned a task',
  createdAt: '2024-01-01T00:00:00.000Z',
  actionUrl: '/dashboard/workspaces/test-ws/tasks',
  sender: null,
}

describe('useNotificationsPage', () => {
  beforeEach(() => {
    mocks.markAsRead.mockClear()
    mocks.markAllAsRead.mockClear()
    mocks.deleteAllRead.mockClear()
    mocks.deleteNotification.mockClear()
    mocks.push.mockClear()
    mocks.notifications = [{ ...baseNotification, read: false }]
  })

  it('exposes notifications and derived state', () => {
    const { result } = renderHook(() => useNotificationsPage())
    expect(result.current.notifications).toHaveLength(1)
    expect(result.current.unreadCount).toBe(3)
    expect(result.current.hasReadNotifications).toBe(false)
  })

  it('marks an unread notification as read on click and navigates', () => {
    const { result } = renderHook(() => useNotificationsPage())

    act(() => {
      result.current.handleNotificationClick(result.current.notifications[0])
    })

    expect(mocks.markAsRead).toHaveBeenCalledWith('n1')
    expect(mocks.push).toHaveBeenCalledWith(
      '/dashboard/workspaces/test-ws/tasks'
    )
  })

  it('does not mark a read notification again but still navigates', () => {
    mocks.notifications = [{ ...baseNotification, read: true }]
    const { result } = renderHook(() => useNotificationsPage())
    expect(result.current.hasReadNotifications).toBe(true)

    act(() => {
      result.current.handleNotificationClick(result.current.notifications[0])
    })

    expect(mocks.markAsRead).not.toHaveBeenCalled()
    expect(mocks.push).toHaveBeenCalledWith(
      '/dashboard/workspaces/test-ws/tasks'
    )
  })

  it('does not navigate when the notification has no action url', () => {
    mocks.notifications = [{ ...baseNotification, read: false, actionUrl: null }]
    const { result } = renderHook(() => useNotificationsPage())

    act(() => {
      result.current.handleNotificationClick(result.current.notifications[0])
    })

    expect(mocks.markAsRead).toHaveBeenCalledWith('n1')
    expect(mocks.push).not.toHaveBeenCalled()
  })

  it('marks all notifications as read', () => {
    const { result } = renderHook(() => useNotificationsPage())

    act(() => {
      result.current.handleMarkAllAsRead()
    })

    expect(mocks.markAllAsRead).toHaveBeenCalled()
  })

  it('deletes all read notifications and closes the confirm dialog', () => {
    const { result } = renderHook(() => useNotificationsPage())

    act(() => {
      result.current.setShowDeleteConfirm(true)
    })
    expect(result.current.showDeleteConfirm).toBe(true)

    act(() => {
      result.current.handleDeleteAllRead()
    })

    expect(mocks.deleteAllRead).toHaveBeenCalled()
    expect(result.current.showDeleteConfirm).toBe(false)
  })

  it('exposes deleteNotification for single notifications', () => {
    const { result } = renderHook(() => useNotificationsPage())

    act(() => {
      result.current.deleteNotification('n1')
    })

    expect(mocks.deleteNotification).toHaveBeenCalledWith('n1')
  })

  it('exposes pagination controls from the underlying hook', () => {
    const { result } = renderHook(() => useNotificationsPage())
    expect(result.current.hasNextPage).toBe(false)
    expect(result.current.isFetchingNextPage).toBe(false)
    expect(typeof result.current.fetchNextPage).toBe('function')
  })
})
