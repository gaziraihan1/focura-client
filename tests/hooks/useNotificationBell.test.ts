import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import { useNotificationBell } from '@/hooks/useNotificationBell'
import { server } from '@/tests/mock/server'
import { http, HttpResponse } from 'msw'

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'test-token' } }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

class MockEventSource {
  static instances: MockEventSource[] = []
  url: string
  onopen: (() => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  close = vi.fn()
  readyState = 0

  constructor(url: string) {
    this.url = url
    MockEventSource.instances.push(this)
  }

  simulateOpen() {
    this.readyState = 1
    this.onopen?.(new Event('open'))
  }

  simulateMessage(data: unknown) {
    this.onmessage?.(new MessageEvent('message', { data: JSON.stringify(data) }))
  }

  simulateError() {
    this.onerror?.(new Event('error'))
  }
}

vi.stubGlobal('EventSource', MockEventSource)

const mockNotification = {
  id: 'notif-1',
  type: 'TASK_ASSIGNED',
  title: 'Task Assigned',
  message: 'You have been assigned a task',
  read: false,
  actionUrl: '/tasks/task-1',
  createdAt: new Date().toISOString(),
  sender: { id: 'user-2', name: 'Bob', email: 'bob@test.com' },
}

const notificationsResponse = {
  items: [mockNotification],
  nextCursor: null,
  hasMore: false,
}

describe('useNotificationBell', () => {
  beforeEach(() => {
    MockEventSource.instances = []
  })

  it('returns recent notifications (max 5)', async () => {
    const manyNotifications = Array.from({ length: 10 }, (_, i) => ({
      ...mockNotification,
      id: `notif-${i}`,
    }))

    server.use(
      http.get('*/api/v1/notifications', () => {
        return HttpResponse.json({
          data: { items: manyNotifications, nextCursor: null, hasMore: false },
        })
      }),
      http.get('*/api/v1/notifications/unread-count', () => {
        return HttpResponse.json({ data: { count: 10 } })
      })
    )

    const { result } = renderHook(() => useNotificationBell(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.recentNotifications).toHaveLength(5)
  })

  it('formats badge correctly for counts > 9', async () => {
    server.use(
      http.get('*/api/v1/notifications', () => {
        return HttpResponse.json({ data: notificationsResponse })
      }),
      http.get('*/api/v1/notifications/unread-count', () => {
        return HttpResponse.json({ data: { count: 15 } })
      })
    )

    const { result } = renderHook(() => useNotificationBell(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.badge).toBe('9+')
  })

  it('returns null badge when no unread', async () => {
    server.use(
      http.get('*/api/v1/notifications', () => {
        return HttpResponse.json({ data: notificationsResponse })
      }),
      http.get('*/api/v1/notifications/unread-count', () => {
        return HttpResponse.json({ data: { count: 0 } })
      })
    )

    const { result } = renderHook(() => useNotificationBell(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.badge).toBeNull()
  })

  it('formats time ago correctly', async () => {
    server.use(
      http.get('*/api/v1/notifications', () => {
        return HttpResponse.json({ data: notificationsResponse })
      }),
      http.get('*/api/v1/notifications/unread-count', () => {
        return HttpResponse.json({ data: { count: 1 } })
      })
    )

    const { result } = renderHook(() => useNotificationBell(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // Test "just now"
    const now = new Date().toISOString()
    expect(result.current.formatTimeAgo(now)).toBe('just now')

    // Test minutes ago
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    expect(result.current.formatTimeAgo(fiveMinAgo)).toBe('5m ago')

    // Test hours ago
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    expect(result.current.formatTimeAgo(twoHoursAgo)).toBe('2h ago')

    // Test days ago
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    expect(result.current.formatTimeAgo(threeDaysAgo)).toBe('3d ago')
  })

  describe('connection status', () => {
    it('exposes connection status and label', async () => {
      server.use(
        http.get('*/api/v1/notifications', () => {
          return HttpResponse.json({ data: notificationsResponse })
        }),
        http.get('*/api/v1/notifications/unread-count', () => {
          return HttpResponse.json({ data: { count: 1 } })
        })
      )

      const { result } = renderHook(() => useNotificationBell(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(MockEventSource.instances.length).toBeGreaterThan(0)
      })

      expect(result.current.connectionStatus).toBeDefined()
      expect(result.current.connectionStatusLabel).toBeDefined()
      expect(typeof result.current.isConnected).toBe('boolean')
    })

    it('updates status label based on connection state', async () => {
      server.use(
        http.get('*/api/v1/notifications', () => {
          return HttpResponse.json({ data: notificationsResponse })
        }),
        http.get('*/api/v1/notifications/unread-count', () => {
          return HttpResponse.json({ data: { count: 1 } })
        })
      )

      const { result } = renderHook(() => useNotificationBell(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(MockEventSource.instances.length).toBeGreaterThan(0)
      })

      // Before open, should be connecting
      expect(result.current.connectionStatusLabel).toBe('Connecting...')

      // After open, should be connected
      act(() => {
        MockEventSource.instances[0].simulateOpen()
      })

      expect(result.current.connectionStatusLabel).toBe('Connected')
      expect(result.current.isConnected).toBe(true)
    })
  })

  describe('notification preferences', () => {
    it('exposes preferences and update function', async () => {
      server.use(
        http.get('*/api/v1/notifications', () => {
          return HttpResponse.json({ data: notificationsResponse })
        }),
        http.get('*/api/v1/notifications/unread-count', () => {
          return HttpResponse.json({ data: { count: 1 } })
        })
      )

      const { result } = renderHook(() => useNotificationBell(), {
        wrapper: createWrapper(),
      })

      expect(result.current.preferences).toBeDefined()
      expect(result.current.preferences.soundEnabled).toBe(true)
      expect(result.current.preferences.browserNotifications).toBe(false)
      expect(typeof result.current.updatePreferences).toBe('function')
      expect(typeof result.current.enableBrowserNotifications).toBe('function')
    })

    it('can update preferences', async () => {
      server.use(
        http.get('*/api/v1/notifications', () => {
          return HttpResponse.json({ data: notificationsResponse })
        }),
        http.get('*/api/v1/notifications/unread-count', () => {
          return HttpResponse.json({ data: { count: 1 } })
        })
      )

      const { result } = renderHook(() => useNotificationBell(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.updatePreferences({ soundEnabled: false })
      })

      expect(result.current.preferences.soundEnabled).toBe(false)
    })
  })
})
