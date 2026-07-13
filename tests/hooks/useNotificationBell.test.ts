import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNotificationBell } from '@/hooks/useNotificationBell'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'token' } }),
}))

const mockMarkAsRead = vi.fn()
const mockMarkAllAsRead = vi.fn()

vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: () => ({
    notifications: [
      { id: 'n1', title: 'Task Assigned', message: 'msg', read: false, actionUrl: '/tasks/t1', createdAt: new Date().toISOString() },
      { id: 'n2', title: 'Comment', message: 'msg', read: true, createdAt: new Date().toISOString() },
    ],
    unreadCount: 1,
    isLoading: false,
    markAsRead: mockMarkAsRead,
    markAllAsRead: mockMarkAllAsRead,
    isMarkingAllAsRead: false,
  }),
}))

describe('useNotificationBell', () => {
  it('returns recent notifications limited to 5', () => {
    const { result } = renderHook(() => useNotificationBell())
    expect(result.current.recentNotifications).toHaveLength(2)
  })

  it('computes badge correctly for 1 unread', () => {
    const { result } = renderHook(() => useNotificationBell())
    expect(result.current.badge).toBe(1)
  })

  it('toggles dropdown', () => {
    const { result } = renderHook(() => useNotificationBell())

    expect(result.current.showDropdown).toBe(false)

    act(() => result.current.handleToggleDropdown())
    expect(result.current.showDropdown).toBe(true)

    act(() => result.current.handleToggleDropdown())
    expect(result.current.showDropdown).toBe(false)
  })

  it('closes dropdown', () => {
    const { result } = renderHook(() => useNotificationBell())

    act(() => result.current.handleToggleDropdown())
    expect(result.current.showDropdown).toBe(true)

    act(() => result.current.handleCloseDropdown())
    expect(result.current.showDropdown).toBe(false)
  })

  it('formats time ago correctly', () => {
    const { result } = renderHook(() => useNotificationBell())

    const now = new Date()
    const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000)
    expect(result.current.formatTimeAgo(thirtySecondsAgo.toISOString())).toBe('just now')

    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
    expect(result.current.formatTimeAgo(fiveMinutesAgo.toISOString())).toBe('5m ago')

    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
    expect(result.current.formatTimeAgo(twoHoursAgo.toISOString())).toBe('2h ago')

    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    expect(result.current.formatTimeAgo(threeDaysAgo.toISOString())).toBe('3d ago')
  })

  it('marks notification as read and closes dropdown on click', () => {
    const { result } = renderHook(() => useNotificationBell())

    act(() => result.current.handleToggleDropdown())
    expect(result.current.showDropdown).toBe(true)

    act(() => result.current.handleNotificationClick({
      id: 'n1', title: 't', message: 'm', read: false, createdAt: new Date().toISOString()
    }))

    expect(mockMarkAsRead).toHaveBeenCalledWith('n1')
    expect(result.current.showDropdown).toBe(false)
  })

  it('does not mark as read if already read', () => {
    mockMarkAsRead.mockClear()
    const { result } = renderHook(() => useNotificationBell())

    act(() => result.current.handleNotificationClick({
      id: 'n2', title: 't', message: 'm', read: true, createdAt: new Date().toISOString()
    }))

    expect(mockMarkAsRead).not.toHaveBeenCalled()
  })

  it('exposes isLoading and isMarkingAllAsRead', () => {
    const { result } = renderHook(() => useNotificationBell())
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isMarkingAllAsRead).toBe(false)
  })
})
