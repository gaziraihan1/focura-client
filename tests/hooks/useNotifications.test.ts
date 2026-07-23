import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import { useNotifications } from '@/hooks/useNotifications'
import { server } from '@/tests/mock/server'
import { http, HttpResponse } from 'msw'

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { backendToken: 'test-token' } }),
}))

class MockEventSource {
  static instances: MockEventSource[] = []
  url: string
  onopen: (() => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  close = vi.fn()
  readyState = 0

  static CONNECTING = 0
  static OPEN = 1
  static CLOSED = 2

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

const emptyNotificationsResponse = {
  items: [],
  nextCursor: null,
  hasMore: false,
}

describe('useNotifications', () => {
  beforeEach(() => {
    MockEventSource.instances = []
  })

  it('fetches notifications list', async () => {
    server.use(
      http.get('*/api/v1/notifications', () => {
        return HttpResponse.json({ data: notificationsResponse })
      }),
      http.get('*/api/v1/notifications/unread-count', () => {
        return HttpResponse.json({ data: { count: 1 } })
      })
    )

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.notifications).toHaveLength(1)
    expect(result.current.unreadCount).toBe(1)
  })

  it('returns empty array when no notifications', async () => {
    server.use(
      http.get('*/api/v1/notifications', () => {
        return HttpResponse.json({ data: emptyNotificationsResponse })
      }),
      http.get('*/api/v1/notifications/unread-count', () => {
        return HttpResponse.json({ data: { count: 0 } })
      })
    )

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.notifications).toHaveLength(0)
    expect(result.current.unreadCount).toBe(0)
  })

  it('marks notification as read', async () => {
    server.use(
      http.get('*/api/v1/notifications', () => {
        return HttpResponse.json({ data: notificationsResponse })
      }),
      http.get('*/api/v1/notifications/unread-count', () => {
        return HttpResponse.json({ data: { count: 1 } })
      }),
      http.patch('*/api/v1/notifications/:id/read', () => {
        return HttpResponse.json({ success: true })
      })
    )

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      result.current.markAsRead('notif-1')
    })

    await waitFor(() => {
      const notif = result.current.notifications.find((n) => n.id === 'notif-1')
      expect(notif?.read).toBe(true)
    })
  })

  it('marks all notifications as read', async () => {
    server.use(
      http.get('*/api/v1/notifications', () => {
        return HttpResponse.json({ data: notificationsResponse })
      }),
      http.get('*/api/v1/notifications/unread-count', () => {
        return HttpResponse.json({ data: { count: 1 } })
      }),
      http.patch('*/api/v1/notifications/read-all', () => {
        return HttpResponse.json({ success: true })
      })
    )

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      result.current.markAllAsRead()
    })

    await waitFor(() => {
      expect(result.current.unreadCount).toBe(0)
    })
  })

  it('deletes a notification', async () => {
    server.use(
      http.get('*/api/v1/notifications', () => {
        return HttpResponse.json({ data: notificationsResponse })
      }),
      http.get('*/api/v1/notifications/unread-count', () => {
        return HttpResponse.json({ data: { count: 1 } })
      }),
      http.delete('*/api/v1/notifications/:id', () => {
        return HttpResponse.json({ success: true })
      })
    )

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      result.current.deleteNotification('notif-1')
    })

    await waitFor(() => {
      expect(result.current.notifications).toHaveLength(0)
    })
  })

  it('deletes all read notifications', async () => {
    const readNotif = { ...mockNotification, id: 'notif-2', read: true }
    const twoNotificationsResponse = {
      items: [mockNotification, readNotif],
      nextCursor: null,
      hasMore: false,
    }

    server.use(
      http.get('*/api/v1/notifications', () => {
        return HttpResponse.json({ data: twoNotificationsResponse })
      }),
      http.get('*/api/v1/notifications/unread-count', () => {
        return HttpResponse.json({ data: { count: 1 } })
      }),
      http.delete('*/api/v1/notifications/read/all', () => {
        return HttpResponse.json({ success: true })
      })
    )

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.notifications).toHaveLength(2))

    await act(async () => {
      result.current.deleteAllRead()
    })

    await waitFor(() => {
      expect(result.current.notifications).toHaveLength(1)
      expect(result.current.notifications[0].id).toBe('notif-1')
    })
  })

  describe('SSE connection management', () => {
    it('establishes SSE connection when token is available', async () => {
      server.use(
        http.get('*/api/v1/notifications', () => {
          return HttpResponse.json({ data: emptyNotificationsResponse })
        }),
        http.get('*/api/v1/notifications/unread-count', () => {
          return HttpResponse.json({ data: { count: 0 } })
        })
      )

      renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(MockEventSource.instances.length).toBeGreaterThan(0)
      })

      const es = MockEventSource.instances[0]
      expect(es.url).toContain('/api/v1/notifications/stream')
      expect(es.url).toContain('token=test-token')
    })

    it('updates connection status on open', async () => {
      server.use(
        http.get('*/api/v1/notifications', () => {
          return HttpResponse.json({ data: emptyNotificationsResponse })
        }),
        http.get('*/api/v1/notifications/unread-count', () => {
          return HttpResponse.json({ data: { count: 0 } })
        })
      )

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(MockEventSource.instances.length).toBeGreaterThan(0)
      })

      const es = MockEventSource.instances[0]
      act(() => {
        es.simulateOpen()
      })

      expect(result.current.connectionStatus).toBe('connected')
    })

    it('receives notification via SSE and updates cache', async () => {
      server.use(
        http.get('*/api/v1/notifications', () => {
          return HttpResponse.json({ data: emptyNotificationsResponse })
        }),
        http.get('*/api/v1/notifications/unread-count', () => {
          return HttpResponse.json({ data: { count: 0 } })
        })
      )

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(MockEventSource.instances.length).toBeGreaterThan(0)
      })

      const es = MockEventSource.instances[0]
      act(() => {
        es.simulateOpen()
      })

      const newNotification = {
        id: 'notif-new',
        type: 'TASK_ASSIGNED',
        title: 'New Task',
        message: 'You have a new task',
        read: false,
        createdAt: new Date().toISOString(),
      }

      act(() => {
        es.simulateMessage(newNotification)
      })

      await waitFor(() => {
        expect(result.current.notifications).toHaveLength(1)
        expect(result.current.notifications[0].id).toBe('notif-new')
        expect(result.current.unreadCount).toBe(1)
      })
    })

    it('deduplicates notifications on reconnect', async () => {
      server.use(
        http.get('*/api/v1/notifications', () => {
          return HttpResponse.json({ data: notificationsResponse })
        }),
        http.get('*/api/v1/notifications/unread-count', () => {
          return HttpResponse.json({ data: { count: 1 } })
        })
      )

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isLoading).toBe(false))
      expect(result.current.notifications).toHaveLength(1)

      const es = MockEventSource.instances[0]
      act(() => {
        es.simulateOpen()
      })

      // Simulate receiving the same notification again
      act(() => {
        es.simulateMessage(mockNotification)
      })

      // Should not duplicate
      await waitFor(() => {
        expect(result.current.notifications).toHaveLength(1)
      })
    })

    it('sets reconnecting status on error', async () => {
      server.use(
        http.get('*/api/v1/notifications', () => {
          return HttpResponse.json({ data: emptyNotificationsResponse })
        }),
        http.get('*/api/v1/notifications/unread-count', () => {
          return HttpResponse.json({ data: { count: 0 } })
        })
      )

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(MockEventSource.instances.length).toBeGreaterThan(0)
      })

      // Open the connection first
      act(() => {
        MockEventSource.instances[0].simulateOpen()
      })

      expect(result.current.connectionStatus).toBe('connected')

      // Now trigger an error
      act(() => {
        MockEventSource.instances[0].simulateError()
      })

      expect(result.current.connectionStatus).toBe('reconnecting')
    })
  })

  describe('connection status', () => {
    it('exposes connection status', async () => {
      server.use(
        http.get('*/api/v1/notifications', () => {
          return HttpResponse.json({ data: emptyNotificationsResponse })
        }),
        http.get('*/api/v1/notifications/unread-count', () => {
          return HttpResponse.json({ data: { count: 0 } })
        })
      )

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      })

      expect(result.current.connectionStatus).toBeDefined()
      expect(['connecting', 'connected', 'reconnecting', 'disconnected']).toContain(
        result.current.connectionStatus
      )
    })
  })

  describe('notification preferences', () => {
    it('exposes default preferences', async () => {
      server.use(
        http.get('*/api/v1/notifications', () => {
          return HttpResponse.json({ data: emptyNotificationsResponse })
        }),
        http.get('*/api/v1/notifications/unread-count', () => {
          return HttpResponse.json({ data: { count: 0 } })
        })
      )

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      })

      expect(result.current.preferences).toEqual({
        browserNotifications: false,
        soundEnabled: true,
        projectDueSoon: true,
        projectOverdue: true,
        projectAutoArchived: true,
      })
    })

    it('can update preferences', async () => {
      server.use(
        http.get('*/api/v1/notifications', () => {
          return HttpResponse.json({ data: emptyNotificationsResponse })
        }),
        http.get('*/api/v1/notifications/unread-count', () => {
          return HttpResponse.json({ data: { count: 0 } })
        })
      )

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.updatePreferences({ soundEnabled: false })
      })

      expect(result.current.preferences.soundEnabled).toBe(false)
    })
  })
})
