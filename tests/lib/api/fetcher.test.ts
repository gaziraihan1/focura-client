import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockSignOut = vi.fn()
vi.mock('next-auth/react', () => ({
  signOut: (...args: any[]) => mockSignOut(...args),
}))

const { apiFetch } = await import('@/lib/api/fetcher')

describe('apiFetch', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    mockSignOut.mockReset()
    globalThis.fetch = vi.fn()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('performs a GET request', async () => {
    const response = { ok: true, status: 200, json: () => Promise.resolve({ data: 'ok' }) }
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(response as any)

    const res = await apiFetch('/api/test')
    expect(res).toBe(response)
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/test', {
      headers: { Authorization: '' },
    })
  })

  it('includes Authorization header when backendToken is provided', async () => {
    const response = { ok: true, status: 200 }
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(response as any)

    await apiFetch('/api/test', {}, 'my-token')
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/test', {
      headers: { Authorization: 'Bearer my-token' },
    })
  })

  it('merges custom headers with Authorization', async () => {
    const response = { ok: true, status: 200 }
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(response as any)

    await apiFetch('/api/test', {
      headers: { 'Content-Type': 'application/json' },
    })
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/test', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: '',
      },
    })
  })

  it('performs a POST request with body', async () => {
    const response = { ok: true, status: 201 }
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(response as any)

    const body = JSON.stringify({ name: 'test' })
    await apiFetch('/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: '' },
      body,
    })
  })

  it('performs a PUT request', async () => {
    const response = { ok: true, status: 200 }
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(response as any)

    await apiFetch('/api/test/1', { method: 'PUT' })
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/test/1', {
      method: 'PUT',
      headers: { Authorization: '' },
    })
  })

  it('performs a DELETE request', async () => {
    const response = { ok: true, status: 204 }
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(response as any)

    await apiFetch('/api/test/1', { method: 'DELETE' })
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/test/1', {
      method: 'DELETE',
      headers: { Authorization: '' },
    })
  })

  it('signs out on 401 and returns undefined', async () => {
    const response = { ok: false, status: 401 }
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(response as any)

    const res = await apiFetch('/api/test')
    expect(res).toBeUndefined()
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/authentication/login' })
  })

  it('returns response for non-401 error status', async () => {
    const response = { ok: false, status: 500, statusText: 'Server Error' }
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(response as any)

    const res = await apiFetch('/api/test')
    expect(res).toBe(response)
    expect(mockSignOut).not.toHaveBeenCalled()
  })

  it('throws on network error', async () => {
    vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error('Network failure'))

    await expect(apiFetch('/api/test')).rejects.toThrow('Network failure')
  })

  it('passes through additional init options', async () => {
    const response = { ok: true, status: 200 }
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(response as any)
    const controller = new AbortController()

    await apiFetch('/api/test', {
      signal: controller.signal,
      cache: 'no-cache',
    })

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/test', {
      signal: controller.signal,
      cache: 'no-cache',
      headers: { Authorization: '' },
    })
  })
})
