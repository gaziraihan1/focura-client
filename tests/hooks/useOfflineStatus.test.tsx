import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useOfflineStatus } from '@/hooks/useOfflineStatus'

const storage = vi.hoisted(() => ({
  getPendingMutations: vi.fn(),
  addPendingMutation: vi.fn(),
  deletePendingMutation: vi.fn(),
}))

vi.mock('@/lib/offline/offlineStorage', () => ({
  getPendingMutations: storage.getPendingMutations,
  addPendingMutation: storage.addPendingMutation,
  deletePendingMutation: storage.deletePendingMutation,
}))

const pending = [
  {
    id: 'm1',
    endpoint: '/api/v1/tasks',
    method: 'POST',
    data: { title: 'Offline task' },
    timestamp: 1,
    retryCount: 0,
  },
]

function setOnline(value: boolean) {
  Object.defineProperty(window.navigator, 'onLine', {
    value,
    configurable: true,
  })
}

describe('useOfflineStatus', () => {
  beforeEach(() => {
    setOnline(true)
    storage.getPendingMutations.mockReset()
    storage.addPendingMutation.mockReset()
    storage.deletePendingMutation.mockReset()
    storage.getPendingMutations.mockResolvedValue([])
    storage.addPendingMutation.mockResolvedValue(undefined)
    storage.deletePendingMutation.mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts online', () => {
    const { result } = renderHook(() => useOfflineStatus())
    expect(result.current.isOnline).toBe(true)
    expect(result.current.isOffline).toBe(false)
  })

  it('flips to offline when the offline event fires', async () => {
    const { result } = renderHook(() => useOfflineStatus())

    setOnline(false)
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(result.current.isOnline).toBe(false)
    expect(result.current.isOffline).toBe(true)
  })

  it('flips back to online when the online event fires', async () => {
    const { result } = renderHook(() => useOfflineStatus())

    setOnline(false)
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })
    expect(result.current.isOffline).toBe(true)

    setOnline(true)
    act(() => {
      window.dispatchEvent(new Event('online'))
    })
    expect(result.current.isOnline).toBe(true)
  })

  it('loads the pending mutation count on mount', async () => {
    storage.getPendingMutations.mockResolvedValue(pending)
    const { result } = renderHook(() => useOfflineStatus())

    await waitFor(() => expect(result.current.pendingCount).toBe(1))
  })

  it('queues a mutation and increments the pending count', async () => {
    const { result } = renderHook(() => useOfflineStatus())

    await act(async () => {
      await result.current.queueMutation({
        endpoint: '/api/v1/tasks',
        method: 'POST',
        data: { title: 'New' },
      })
    })

    expect(storage.addPendingMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: '/api/v1/tasks',
        method: 'POST',
        data: { title: 'New' },
        retryCount: 0,
      })
    )
    expect(result.current.pendingCount).toBe(1)
  })

  it('keeps the count unchanged when queueing fails', async () => {
    storage.addPendingMutation.mockRejectedValue(new Error('storage down'))
    const { result } = renderHook(() => useOfflineStatus())

    await act(async () => {
      await result.current.queueMutation({
        endpoint: '/api/v1/tasks',
        method: 'POST',
      })
    })

    expect(result.current.pendingCount).toBe(0)
  })

  // The auto-sync effect only fires while online, so render offline to
  // exercise syncPending deterministically without a race with auto-sync.
  async function renderOfflineWithPending() {
    setOnline(false)
    storage.getPendingMutations.mockResolvedValue(pending)
    const { result } = renderHook(() => useOfflineStatus())
    await waitFor(() => expect(result.current.pendingCount).toBe(1))
    return result
  }

  it('syncs pending mutations and removes them on success', async () => {
    const result = await renderOfflineWithPending()
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      statusText: 'OK',
    })
    vi.stubGlobal('fetch', fetchMock)

    await act(async () => {
      await result.current.syncPending()
    })

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/tasks',
      expect.objectContaining({ method: 'POST' })
    )
    expect(storage.deletePendingMutation).toHaveBeenCalledWith('m1')
    expect(result.current.pendingCount).toBe(0)
  })

  it('keeps pending mutations when the sync request fails', async () => {
    const result = await renderOfflineWithPending()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('network down'))
    )

    await act(async () => {
      await result.current.syncPending()
    })

    expect(storage.deletePendingMutation).not.toHaveBeenCalled()
    expect(result.current.pendingCount).toBe(1)
  })

  it('keeps pending mutations when the server rejects', async () => {
    const result = await renderOfflineWithPending()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, statusText: 'Server Error' })
    )

    await act(async () => {
      await result.current.syncPending()
    })

    expect(storage.deletePendingMutation).not.toHaveBeenCalled()
    expect(result.current.pendingCount).toBe(1)
  })
})
