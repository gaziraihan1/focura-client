import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useServiceWorker } from '@/hooks/useServiceWorker'

interface FakeServiceWorkerRegistration {
  installing: {
    state: string
    addEventListener: (t: string, cb: () => void) => void
    removeEventListener: ReturnType<typeof vi.fn>
  } | null
  addEventListener: (t: string, cb: () => void) => void
  removeEventListener: ReturnType<typeof vi.fn>
  update: ReturnType<typeof vi.fn>
}

function installServiceWorkerMock(
  reg: FakeServiceWorkerRegistration,
  controller?: object
) {
  Object.defineProperty(window.navigator, 'serviceWorker', {
    value: {
      register: vi.fn().mockResolvedValue(reg),
      controller: controller ?? null,
    },
    configurable: true,
  })
}

function removeServiceWorkerMock() {
  try {
    delete (window.navigator as unknown as Record<string, unknown>).serviceWorker
  } catch {
    /* not configurable in this environment */
  }
}

describe('useServiceWorker', () => {
  beforeEach(() => {
    removeServiceWorkerMock()
  })

  afterEach(() => {
    removeServiceWorkerMock()
  })

  it('reports unsupported when service workers are unavailable', () => {
    const { result } = renderHook(() => useServiceWorker())
    expect(result.current.isSupported).toBe(false)
    expect(result.current.isRegistered).toBe(false)
  })

  it('registers the service worker when supported', async () => {
    const reg: FakeServiceWorkerRegistration = {
      installing: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      update: vi.fn().mockResolvedValue(undefined),
    }
    installServiceWorkerMock(reg)

    const { result } = renderHook(() => useServiceWorker())

    await waitFor(() => expect(result.current.isRegistered).toBe(true))
    expect(result.current.isSupported).toBe(true)
    expect(
      (window.navigator.serviceWorker.register as ReturnType<typeof vi.fn>)
    ).toHaveBeenCalledWith('/sw.js', { scope: '/' })
  })

  it('handles the updatefound flow and flags waiting updates', async () => {
    const stateHandlers: Record<string, () => void> = {}
    let updateFoundHandler: (() => void) | undefined

    const newWorker = {
      state: 'installing',
      addEventListener: (type: string, cb: () => void) => {
        stateHandlers[type] = cb
      },
      removeEventListener: vi.fn(),
    }

    const reg: FakeServiceWorkerRegistration = {
      installing: newWorker,
      addEventListener: (type: string, cb: () => void) => {
        if (type === 'updatefound') updateFoundHandler = cb
      },
      removeEventListener: vi.fn(),
      update: vi.fn().mockResolvedValue(undefined),
    }
    // controller present -> a new version is waiting
    installServiceWorkerMock(reg, {})

    const { result } = renderHook(() => useServiceWorker())
    await waitFor(() => expect(result.current.isRegistered).toBe(true))

    act(() => {
      updateFoundHandler?.()
    })
    expect(result.current.isInstalling).toBe(true)

    newWorker.state = 'installed'
    act(() => {
      stateHandlers.statechange?.()
    })

    expect(result.current.isInstalling).toBe(false)
    expect(result.current.isWaiting).toBe(true)
  })

  it('does not flag waiting when there is no controller (first install)', async () => {
    const stateHandlers: Record<string, () => void> = {}
    let updateFoundHandler: (() => void) | undefined

    const newWorker = {
      state: 'installing',
      addEventListener: (type: string, cb: () => void) => {
        stateHandlers[type] = cb
      },
      removeEventListener: vi.fn(),
    }

    const reg: FakeServiceWorkerRegistration = {
      installing: newWorker,
      addEventListener: (type: string, cb: () => void) => {
        if (type === 'updatefound') updateFoundHandler = cb
      },
      removeEventListener: vi.fn(),
      update: vi.fn().mockResolvedValue(undefined),
    }
    installServiceWorkerMock(reg)

    const { result } = renderHook(() => useServiceWorker())
    await waitFor(() => expect(result.current.isRegistered).toBe(true))

    act(() => {
      updateFoundHandler?.()
    })
    newWorker.state = 'installed'
    act(() => {
      stateHandlers.statechange?.()
    })

    expect(result.current.isWaiting).toBe(false)
  })

  it('update() refreshes the registration and reloads the page', async () => {
    const reg: FakeServiceWorkerRegistration = {
      installing: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      update: vi.fn().mockResolvedValue(undefined),
    }
    installServiceWorkerMock(reg)

    const { result } = renderHook(() => useServiceWorker())
    await waitFor(() => expect(result.current.isRegistered).toBe(true))

    await act(async () => {
      await result.current.update()
    })

    expect(reg.update).toHaveBeenCalled()
    expect(result.current.isWaiting).toBe(false)
  })

  it('update() is a no-op when there is no registration', async () => {
    // Unsupported -> registration stays null
    const { result } = renderHook(() => useServiceWorker())
    expect(result.current.isSupported).toBe(false)

    await act(async () => {
      await result.current.update()
    })

    expect(result.current.isRegistered).toBe(false)
  })
})
